import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function POST(request, res) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
            include: {
                nodes: true,
                edges: true
            }
        });

        return Response.json(event)
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request, res) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    try {
        const events = await prisma.event.findMany({
            include: {
                nodes: true,
                edges: true
            }
        });
        return Response.json(events)
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request) {
    if (request.method !== 'PUT') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const requestBody = await request.json();

    try {
        await prisma.$transaction([
            prisma.node.deleteMany({
                where: {
                    eventId: requestBody.eventId,
                },
            }),
        ]);

        await Promise.all(requestBody.nodes.map(async node => {
            await prisma.node.create({
                data: {
                    id: node.id,
                    position: node.position,
                    data: node.data,
                    eventId: requestBody.eventId,
                },
            });
        }));

        await prisma.$transaction([
            prisma.edge.deleteMany({
                where: {
                    eventId: requestBody.eventId,
                },
            }),
        ]);

        await Promise.all(requestBody.edges.map(async edge => {
            await prisma.edge.create({
                data: {
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    label: edge.label,
                    animated: edge.animated,
                    type: edge.type,
                    markerEnd: edge.markerEnd,
                    eventId: requestBody.eventId,
                },
            });
        }));

        return new Response('Event update successful', {
            status: 200,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}
