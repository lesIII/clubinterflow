import React, {useCallback, useRef, useState} from 'react';
import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    removeEdge,
    updateEdge,
    MarkerType,
    ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from './FloatingConnectionLine';
import CustomNode from "./CustomNode";
import ContextMenu from './ContextMenu';
import EdgeContextMenu from './EdgeContextMenu';

import '@/styles/globals.css';

const edgeTypes = {
    floating: FloatingEdge,
};
const nodeTypes = {
    custom: CustomNode,
};

function Flow({nodes, edges, setNodes, setEdges, editorMode}) {

    const edgeUpdateSuccessful = useRef(true);
    const [menu, setMenu] = useState(null);
    const [edgeMenu, setEdgeMenu] = useState(null);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY - 288,
                left: event.clientX - 140,
            });
        },
        [setMenu],
    );

    const onEdgeContextMenu = useCallback(
        (event, edge) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current.getBoundingClientRect();
            setEdgeMenu({
                id: edge.id,
                top: event.clientY - 288,
                left: event.clientX - 140,
            });
        },
        [setEdgeMenu],
    );

    const onPaneClick = useCallback(() => {
        setMenu(null);
        setEdgeMenu(null);
        console.log(JSON.stringify(edges, null, 2));
    }, [setMenu, setEdgeMenu]);

    const onNodesChange = useCallback(
        (changes) => {
            const updatedNodes = applyNodeChanges(changes, nodes);
            setNodes(updatedNodes);
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
        (params) => {
            const maxId = Math.max(...edges.map(edge => parseInt(edge.id))) || 0;
            const newId = (maxId + 1).toString();
            setEdges((eds) =>
                addEdge({
                    ...params,
                    id: newId,
                    type: 'floating',
                    markerEnd: { type: 'arrow' },
                    animated: true,
                }, eds)
            );
        },
        [setEdges, edges]
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

    const ref = useRef(null);

    return (
        <ReactFlow
            ref={ref}
            nodes={nodes}
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
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
        >
            <Background/>
            <Controls
                showInteractive={false}
            />
            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
            {edgeMenu && <EdgeContextMenu onClick={onPaneClick} {...edgeMenu} />}
        </ReactFlow>

    );
}

export default Flow;
