import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    try {
        const edges = await prisma.edge.findMany();
        return Response.json(edges)
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}