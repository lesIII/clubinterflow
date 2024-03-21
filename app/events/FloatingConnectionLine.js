import React from 'react';
import {getBezierPath, getStraightPath} from 'reactflow';

import { getEdgeParams, getEdgePosition } from './utils';

// @ts-ignore
function FloatingConnectionLine({ toX, toY, fromPosition, toPosition, fromNode }) {
    if (!fromNode) {
        return null;
    }

    const targetNode = {
        id: 'connection-target',
        width: 1,
        height: 1,
        positionAbsolute: { x: toX, y: toY }
    };

    const { sx, sy } = getEdgeParams(fromNode, targetNode);
    const [edgePath] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: toX,
        targetY: toY
    });

    return (
        <g>
            <path
                fill="none"
                stroke="#30FF41"
                strokeWidth={1.5}
                className="animated"
                d={edgePath}
            />
            <circle
                cx={toX}
                cy={toY}
                fill="#fff"
                r={3}
                stroke="#222"
                strokeWidth={1.5}
            />
        </g>
    );
}

export default FloatingConnectionLine;
