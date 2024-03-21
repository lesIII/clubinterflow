import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data }) {
    return (
        <>
            {data.label}
            <Handle type="source" position={Position.Right} id="a" />
        </>
    );
}

export default CustomNode