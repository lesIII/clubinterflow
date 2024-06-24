import React, {useCallback, useEffect, useRef, useState} from 'react';

import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    updateEdge,
    ConnectionMode, Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import toast, { Toaster } from 'react-hot-toast';

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
    const [localNodesCounter, setLocalNodesCounter] = useState(0);
    const [allEdges, setAllEdges] = useState([]);
    const [edgesFetched, setEdgesFetched] = useState(false);

    const fetchAllEdges = async () => {
        await fetch('/api/edges', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(edges => {
                setAllEdges(edges)
                setEdgesFetched(true);
            })
            .catch(error => console.error('Error fetching edges:', error));
    }

    const fetchNodes = async () => {
        await fetch('/api/nodes', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(nodes => {
                const currentMaxId = nodes.length > 0 ? Math.max(...nodes.map(node => parseInt(node.id))) : 0;
                setMaxId(currentMaxId);
                setLocalNodesCounter(0);
            })
            .catch(error => console.error('Error fetching nodes:', error));
    }

    useEffect(() => {
        fetchNodes();
        fetchAllEdges();
    }, []);

    useEffect(() => {
        if (nodes) {
            setNodesWithProps(nodes.map(node => ({
                ...node,
                data: {
                    ...node.data,
                    id: node.id,
                    setNodes: setNodes,
                    setEdges: setEdges,
                    editorMode: editorMode
                }
            })));
        }
    }, [nodes, setNodes, setEdges, editorMode]);

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
            if (!edgesFetched) {
                return;
            }

            const maxAllEdges = Math.max(...allEdges.map(edge => edge.id));
            const maxEdges = Math.max(...edges.map(edge => edge.id));
            const newId = maxAllEdges > maxEdges ? maxAllEdges : maxEdges;
            console.log(newId)
            setEdges((eds) =>
                addEdge({
                    ...params,
                    id: parseInt(newId) + 1,
                    type: 'floating',
                    markerEnd: { type: 'arrow' },
                    animated: true,
                }, eds)
            );
        },
        [setEdges, edges, edgesFetched]
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
        setLocalNodesCounter(localNodesCounter + 1);

        setNodes((currentNodes) => {
            const newNode = {
                id: `${newId}`,
                data: { label: 'President' },
                position: {
                    x: 20 * localNodesCounter, //Math.floor(Math.random() * 400) - 200,
                    y: 20 * localNodesCounter //Math.floor(Math.random() * 400) - 200,
                },
                type: 'custom'
            };
            return currentNodes.concat(newNode);
        });
    }, [maxId]);

    useEffect(() => {
        if (editorMode && searchDuplicates()) {
            notify();
        } else {
            toast.dismiss();
        }
    }, [nodes.map(node => node.data.label).toString(), editorMode]);

    const searchDuplicates = () => {
        return nodes.some((node, index) => {
            return nodes.slice(index + 1).some(node2 => node.data.label === node2.data.label);
        });
    }

    const notify = () => toast.loading('Adding 2 nodes of the same manager will result in duplicate e-mail notifications.', {
        position: "bottom-left",
        id: 'duplicate-notification',
        icon: '⚠️',
        style: {
            background: '#FFF5CF'
        }
    })


    return (
        <>
            <Toaster/>
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
                {editorMode ? (
                    <Panel position="top-right">
                        <button onClick={onAdd}><h1 className="text-3xl text-green-500">+</h1></button>
                    </Panel>
                ) : <></>
                }
            </ReactFlow>
        </>
    );
}

export default Flow;
