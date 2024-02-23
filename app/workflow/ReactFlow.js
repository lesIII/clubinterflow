
import React, { useCallback, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from './FloatingConnectionLine';

import '@/styles/globals.css';

const initialEdges = [
    {
        id: '1-2',
        source: '1',
        target: '2',
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
];

const initialNodes = [
    {
        id: '1',
        position: {x: 0, y: -100},
        data: {label: 'Elnök'},
        type: 'input',
    },
    {
        id: '2',
        position: {x: 0, y: 0},
        data: {label: 'Alelnökök'},
        type: ''
    },
    {
        id: '3',
        position: {x: 0, y: 100},
        data: {label: 'Rendezvényes'},

    },
    {
        id: '4',
        position: {x: -350, y: 100},
        data: {label: 'PR-os'},
    },
    {
        id: '5',
        position: {x: 350, y: 100},
        data: {label: 'Technikus'},
    },
    {
        id: '6',
        position: {x: -200, y: 300},
        data: {label: 'Beszerzős'},

    },
    {
        id: '7',
        position: {x: 200, y: 300},
        data: {label: 'Takkeres'},
    },
    {
        id: '8',
        position: {x: 0, y: 400},
        data: {label: 'Pénzügyes'},
    },
];

const edgeTypes = {
    floating: FloatingEdge,
};

function Flow() {

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );

    // @ts-ignore
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    // @ts-ignore
    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow }, animated: true, }, eds)
            ),
        [setEdges]
    );

    // @ts-ignore
    return (
            <ReactFlow nodes={nodes}
                       onNodesChange={onNodesChange}
                       edges={edges}
                       onEdgesChange={onEdgesChange}
                       onConnect={onConnect}
                       fitView
                       edgeTypes={edgeTypes}
                       connectionLineComponent={FloatingConnectionLine}
            >
                <Background/>
                <Controls/>
            </ReactFlow>
    );
}

export default Flow;