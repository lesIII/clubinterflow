// Import PrismaClient
const { PrismaClient } = require('@prisma/client');
const {MarkerType} = require("reactflow");

// Instantiate PrismaClient
const prisma = new PrismaClient();

// Define seed data
const nodes = [
    {
        id: 1,
        position: {x: 0, y: -100},
        data: {label: 'President'},
        type: 'custom'
    },
    {
        id: 2,
        position: {x: 0, y: 0},
        data: {label: 'Vice President'},
        type: 'custom'
    },
    {
        id: 3,
        position: {x: 0, y: 100},
        data: {label: 'Event Manager'},
        type: 'custom'
    },
    {
        id: 4,
        position: {x: -350, y: 100},
        data: {label: 'PR Manager'},
        type: 'custom'
    },
    {
        id: 5,
        position: {x: 350, y: 100},
        data: {label: 'Technician'},
        type: 'custom'
    },
    {
        id: 6,
        position: {x: -200, y: 300},
        data: {label: 'Logistics Manager'},
        type: 'custom'

    },
    {
        id: 7,
        position: {x: 200, y: 300},
        data: {label: 'Hygiene Manager'},
        type: 'custom'
    },
    {
        id: 8,
        position: {x: 0, y: 400},
        data: {label: 'Finances Manager'},
        type: 'custom'
    },
]

const nodes2 = [
    {
        id: 9,
        position: {x: 200, y: 100},
        data: {label: 'President'},
        type: 'custom'
    },
    {
        id: 10,
        position: {x: -200, y: 0},
        data: {label: 'Vice President'},
        type: 'custom'
    },
    {
        id: 11,
        position: {x: 0, y: 100},
        data: {label: 'Event Manager'},
        type: 'custom'
    },
]

const edges2 = [
    {
        id: 0,
        source: 2,
        target: 3,
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    }
]

const edges = [
    {
        id: 1,
        source: 1,
        target: 2,
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 2,
        source: 2,
        target: 3, label: 'continuous exchange and mutual approval',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 3,
        source: 3,
        target: 4, label: 'post PR posts',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 4,
        source: 3,
        target: 5, label: 'prepare projector and audio',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
        style: {stroke: 'red'}
    },
    {
        id: 5,
        source: 3,
        target: 6, label: 'purchase groceries',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 6,
        source: 3,
        target: 7, label: 'clean before and after',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 7,
        source: 3,
        target: 8, label: 'bar rotation',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 8,
        source: 6,
        target: 7, label: 'restock cleaning items',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 9,
        source: 6,
        target: 8, label: 'approval and payment',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
]

async function seed() {
    const event = await prisma.event.create({
        data: {
            name: "Golden Bunny",
            date: "2024-05-01T18:00:00Z",
            editorRoles: ["president", "vice_president", "event_manager"],
            nodes: {
                createMany: {
                    data: nodes.map(node => ({ ...node })),
                },
            },
            edges: {
                createMany: {
                    data: edges.map(edge => ({ ...edge })),
                },
            },
        },
        include: {
            nodes: true,
            edges: true,
        },
    });

    const event2 = await prisma.event.create({
        data: {
            name: "Colonizer Night",
            date: "2025-03-15T21:30:00Z",
            editorRoles: ["president", "vice_president", "event_manager"],
            nodes: {
                createMany: {
                    data: nodes2.map(node => ({ ...node })),
                },
            },
            edges: {
                createMany: {
                    data: edges2.map(edge => ({ ...edge })),
                },
            },
        },
        include: {
            nodes: true,
            edges: true,
        },
    });

    console.log('Seed data inserted successfully');
}

// Run the seed function
seed()
    .catch((error) => {
        console.error('Error seeding database:', error);
    })
    .finally(async () => {
        // Disconnect PrismaClient
        await prisma.$disconnect();
    });
