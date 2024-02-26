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
        const nodes = await prisma.node.findMany();
        const edges = await prisma.edge.findMany();

        // Return the retrieved data
        return Response.json({ nodes, edges })
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
