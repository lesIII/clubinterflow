
import React, {useCallback, useEffect, useState} from 'react';
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



const edgeTypes = {
    floating: FloatingEdge,
};

function Flow() {

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        // Fetch data from the updated API route when the component mounts
        fetch('/api')
            .then(response => response.json())
            .then(data => {
                const { nodes, edges } = data;
                setNodes(nodes);
                setEdges(edges);
            })
            .catch(error => console.error('Error fetching graph data:', error));
    }, []);

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
