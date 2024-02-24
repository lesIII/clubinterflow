'use strict';

const { Node, Edge, Event } = require('../models')
const {MarkerType} = require("reactflow");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        source: 'president',
        target: 'vice_president',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
      {
        id: '2-3',
        source: '2',
        target: '3', label: 'continuous exchange and mutual approval',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
      {
        id: '3-4',
        source: '3',
        target: '4', label: 'post PR posts',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
        style: {}
      },
      {
        id: '3-5',
        source: '3',
        target: '5', label: 'prepare projector and audio',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
        style: {stroke: 'red'}
      },
      {
        id: '3-6',
        source: '3',
        target: '6', label: 'purchase groceries',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
      {
        id: '3-7',
        source: '3',
        target: '7', label: 'clean before and after',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
      {
        id: '3-8',
        source: '3',
        target: '8', label: 'bar rotation',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
      {
        id: '6-7',
        source: '7',
        target: '6', label: 'restock cleaning items',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
      {
        id: '6-8',
        source: '6',
        target: '8', label: 'approval and payment',
        animated: true,
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow},
      },
    ]

    const event = await Event.create({
      name: 'Arany Nyúl',
      date: '2024-05-01 18:00',
      editor_roles: {
        roles: ['president','vice_president','event_manager'],
      },
    })

    for (const node of nodes) {
      await Node.create({
        id: node.id,
        position: node.position,
        data: node.data.label,
        eventId: event.id,
      })
    }


  },

  async down (queryInterface, Sequelize) {

  }
};
