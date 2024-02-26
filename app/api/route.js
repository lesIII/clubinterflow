import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, res) {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    try {
        // Retrieve nodes and edges from the database
        //const nodes = await prisma.node.findMany();
        //const edges = await prisma.edge.findMany();
        const event = await prisma.event.findUnique({
            where: {
                id: 1
            },
            include: {
                nodes: true,
                edges: true
            }
        });

        // Return the retrieved data
        return Response.json(event)
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        // Disconnect PrismaClient
        await prisma.$disconnect();
    }
}
