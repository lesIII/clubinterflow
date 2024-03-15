import { PrismaClient } from '@prisma/client';
import {NextRequest} from "next/server";

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