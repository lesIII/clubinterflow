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


        const edge = await prisma.edge.findUnique({
            where: {
                id: parseInt(edgeId)
            }
        });

        if (!edge) {
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(edge), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

}