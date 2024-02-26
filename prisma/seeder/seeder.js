// Import PrismaClient
const { PrismaClient } = require('@prisma/client');
const {MarkerType} = require("reactflow");

// Instantiate PrismaClient
const prisma = new PrismaClient();

// Define seed data
const nodes = [
    {
        id: 'president',
        position: {x: 0, y: -100},
        data: {label: 'President'},
    },
    {
        id: 'vice_president',
        position: {x: 0, y: 0},
        data: {label: 'Vice President'},
        type: ''
    },
    {
        id: 'event_manager',
        position: {x: 0, y: 100},
        data: {label: 'Event Manager'},
    },
    {
        id: 'pr_manager',
        position: {x: -350, y: 100},
        data: {label: 'PR Manager'},
    },
    {
        id: 'technician',
        position: {x: 350, y: 100},
        data: {label: 'Technician'},
    },
    {
        id: 'logistics_manager',
        position: {x: -200, y: 300},
        data: {label: 'Logistics Manager'},

    },
    {
        id: 'hygiene_manager',
        position: {x: 200, y: 300},
        data: {label: 'Hygiene Manager'},
    },
    {
        id: 'finances_manager',
        position: {x: 0, y: 400},
        data: {label: 'Finances Manager'},
    },
]
const edges = [
    {
        id: 'president-vice_president',
        source: 'president',
        target: 'vice_president',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'vice_president-event_manager',
        source: 'vice_president',
        target: 'event_manager', label: 'continuous exchange and mutual approval',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'event_manager-pr_manager',
        source: 'event_manager',
        target: 'pr_manager', label: 'post PR posts',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'event_manager-technician',
        source: 'event_manager',
        target: 'technician', label: 'prepare projector and audio',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
        style: {stroke: 'red'}
    },
    {
        id: 'event_manager-logistics_manager',
        source: 'event_manager',
        target: 'logistics_manager', label: 'purchase groceries',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'event_manager-hygiene_manager',
        source: 'event_manager',
        target: 'hygiene_manager', label: 'clean before and after',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'event_manager-finances_manager',
        source: 'event_manager',
        target: 'finances_manager', label: 'bar rotation',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'logistics_manager-hygiene_manager',
        source: 'logistics_manager',
        target: 'hygiene_manager', label: 'restock cleaning items',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
    {
        id: 'logistics_manager-finances_manager',
        source: 'logistics_manager',
        target: 'hygiene_manager', label: 'approval and payment',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
    },
]

// Function to seed data
async function seed() {

    const event = await prisma.event.create({
        data: {
            name: "Arany Nyúl",
            date: "2024-05-01T18:00:00Z",
            editorRoles: [
                "president",
                "vice_president",
                "event_manager"
            ],
        }
    });
    await prisma.node.createMany({
        data: nodes.map(node => ({ ...node, eventId: event.id, })),
    });
    await prisma.edge.createMany({
        data: edges.map(edge => ({ ...edge, eventId: event.id, })),
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
