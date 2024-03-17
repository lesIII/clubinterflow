
import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    updateEdge,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from './FloatingConnectionLine';

import '@/styles/globals.css';

const edgeTypes = {
    floating: FloatingEdge,
};

function Flow({nodes, edges, setNodes, setEdges}) {

    const onNodesChange = useCallback(
        (changes) => {
            const updatedNodes = applyNodeChanges(changes, nodes);
            setNodes(updatedNodes);
            console.log("Updated nodes:", updatedNodes);
        },
        [nodes],
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

    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
        []
    );

    // @ts-ignore
    return (

            <ReactFlow nodes={nodes}
                       onNodesChange={onNodesChange}
                       edges={edges}
                       onEdgesChange={onEdgesChange}
                       onEdgeUpdate={onEdgeUpdate}
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
