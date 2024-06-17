import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function POST(request, res) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const { name, date, editorRoles } = await request.json();

    try {
        const event = await prisma.event.create({
            data: {
                name,
                date,
                editorRoles
            },
        });

        return new Response('Event created successfully.', {
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

