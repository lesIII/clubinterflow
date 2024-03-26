import React from 'react';
import { Handle, Position } from 'reactflow';
import './handle.css';

function CustomNode({ data }) {
    return (
        <>
            {data.label}
            <Handle type="source" position={Position.Right} id="a" className="react-flow__handle .react-flow__handle-right" />
        </>
    );
}

export default CustomNode