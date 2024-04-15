import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const searchParams = request.nextUrl.searchParams;
    const edgeId = searchParams.get('edgeId');

    try {
        const edge = await prisma.edge.findUnique({
            where: {
                id: parseInt(edgeId)
            }
        });

        if (!edge) {
            return new Response('Edge not found', {
                status: 404
            });
        }

        return new Response(JSON.stringify(edge), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching edge:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}