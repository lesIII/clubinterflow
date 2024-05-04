import { useCallback, useRef, useEffect, useState } from 'react';
import { useStore, getBezierPath } from 'reactflow';
import React from 'react';
import { getEdgeParams } from './utils';
import {Button, ButtonGroup} from "@nextui-org/react";

// @ts-ignore
function FloatingEdge({ id, source, target, markerEnd, style, label, selected }) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    const labelRef = useRef(null);
    const [labelDimensions, setLabelDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (labelRef.current) {
            const currentLabelRef = labelRef.current;
            setLabelDimensions({
                width: currentLabelRef.offsetWidth,
                height: currentLabelRef.offsetHeight,
            });
        }
    }, [label]);

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
    });

    // Calculate label position (middle of the edge)
    const midPointX = (sx + tx) / 2;
    const midPointY = (sy + ty) / 2;

    // Adjust label position based on midpoint and label dimensions
    const labelX = midPointX - (labelDimensions.width /2);
    const labelY = midPointY - (labelDimensions.height /2);

    const formattedLabel = label && label.split('\n').map((line, index) => <div key={index}>{line}</div>);

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                style={style}
            />
            {selected && (
                <foreignObject x={midPointX - 25} y={midPointY - 55} width={40} height={40} overflow="visible">
                        <button className="my-button">Edit</button>
                </foreignObject>
            )}
            {label ? (
                <foreignObject x={labelX} y={labelY} width={labelDimensions.width} height={labelDimensions.height}>
                    <div
                        ref={labelRef}
                        style={{
                            position: 'absolute',
                            background: 'white',
                            padding: '2px 4px',
                            borderRadius: '2px',
                            fontSize: '9px',
                            fontWeight: '400',
                            textAlign: 'center',
                            color: 'black',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {formattedLabel}
                    </div>
                </foreignObject>
            ) : null}
        </>
    );
}

export default FloatingEdge;