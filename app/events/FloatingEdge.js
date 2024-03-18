import { useCallback, useRef, useEffect, useState } from 'react';
import { useStore, getBezierPath } from 'reactflow';

import { getEdgeParams } from './utils';

// @ts-ignore
function FloatingEdge({ id, source, target, markerEnd, style, label }) {
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
    const labelX = midPointX - (labelDimensions.width / 2);
    const labelY = midPointY - (labelDimensions.height / 2);

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                style={style}
            />
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
                        {label}
                    </div>
                </foreignObject>
            ) : (
                <foreignObject x={midPointX - 20} y={midPointY - 20} width={40} height={40}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <button
                            className="button edgebutton text-neutral-800"
                            style={{paddingBottom: '0.1rem', lineHeight: '1'}}
                        >
                            +
                        </button>
                    </div>
                </foreignObject>
            )}
        </>
    );
}

export default FloatingEdge;
