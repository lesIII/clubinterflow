import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    NodeToolbar,
    updateEdge,
    MarkerType,
    ConnectionMode, Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from "./FloatingEdge"
import FloatingConnectionLine from './FloatingConnectionLine'
import CustomNode from "./CustomNode"

import '@/styles/globals.css';

const edgeTypes = {
    floating: FloatingEdge,
};
const nodeTypes = {
    custom: CustomNode,
};

function Flow({nodes, edges, setNodes, setEdges, editorMode, event}) {

    const [nodesWithProps, setNodesWithProps] = useState([]);
    const [maxId, setMaxId] = useState(0);

    const fetchNodes = async () => {
        await fetch('/api/nodes', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(nodes => {
                const currentMaxId = nodes.length > 0 ? Math.max(...nodes.map(node => parseInt(node.id))) : 0;
                setMaxId(currentMaxId);
            })
            .catch(error => console.error('Error fetching nodes:', error));
    }

    useEffect(() => {
        fetchNodes();
    }, []);

    useEffect(() => {
        if (nodes) {
            setNodesWithProps(nodes.map(node => ({
                ...node,
                data: {
                    ...node.data,
                    id: node.id,
                    setNodes: setNodes,
                    setEdges: setEdges
                }
            })));
        }
    }, [nodes, setNodes, setEdges]);

    const edgeUpdateSuccessful = useRef(true);

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

    const onAdd = useCallback(() => {
        const newId = maxId + 1;
        setMaxId(newId);
        console.log(newId)
        setNodes((currentNodes) => {
            const newNode = {
                id: `${newId}`,
                data: { label: 'President' },
                position: {
                    x: Math.floor(Math.random() * 400) - 200,
                    y: Math.floor(Math.random() * 400) - 200,
                },
                type: 'custom'
            };
            return currentNodes.concat(newNode);
        });
    }, [maxId]);


    return (
        <ReactFlow
            nodes={nodesWithProps}
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
            <Panel position="top-right">
                <button onClick={onAdd}>➕</button>
            </Panel>
        </ReactFlow>
    );
}

export default Flow;
