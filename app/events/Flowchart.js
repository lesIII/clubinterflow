
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    updateEdge,
    MarkerType, ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from './FloatingConnectionLine';
import CustomNode from "./CustomNode";

import '@/styles/globals.css';

const edgeTypes = {
    floating: FloatingEdge,
};
const nodeTypes = {
    custom: CustomNode,
};

function Flow({nodes, edges, setNodes, setEdges, editorMode}) {

    const edgeUpdateSuccessful = useRef(true);

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

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    const asd = false;

    return (
            <ReactFlow nodes={nodes}
                       onNodesChange={onNodesChange}
                       edges={edges}
                       onEdgesChange={onEdgesChange}
                       onEdgeUpdate={onEdgeUpdate}
                       onEdgeUpdateStart={onEdgeUpdateStart}
                       onEdgeUpdateEnd={onEdgeUpdateEnd}
                       onConnect={onConnect}
                       fitView
                       edgeTypes={edgeTypes}
                       nodeTypes={nodeTypes}
                       connectionLineComponent={FloatingConnectionLine}
                       nodesDraggable={editorMode}
                       nodesConnectable={editorMode}
                       connectionMode={ConnectionMode.Loose}
            >
                <Background/>
                <Controls
                    showInteractive={false}
                />
            </ReactFlow>

    );
}

export default Flow;
