import { useCallback, useRef, useEffect, useState } from 'react';
import {useStore, getBezierPath, useReactFlow} from 'reactflow';
import React from 'react';
import { getEdgeParams } from './utils';
import {Button, ButtonGroup, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {Textarea} from "@nextui-org/input";

// @ts-ignore
function FloatingEdge({ id, source, target, markerEnd, style, label, selected }) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
    const [isOpen, setIsOpen] = useState(false);
    const { getEdge, setEdges } = useReactFlow();
    const [databaseEdge, setDatabaseEdge] = useState(null);
    const [weeks, setWeeks] = useState(0);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [edgeLabel, setEdgeLabel] = useState("");

    const fetchEdge = async () => {
        try {
            const response = await fetch(`/api/edges?edgeId=${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const edgeData = await response.json();
            setDatabaseEdge(edgeData);
            setWeeks(Math.floor(edgeData.due / 10080));
            setDays(Math.floor((edgeData.due % 10080) / 1440));
            setHours( Math.floor((edgeData.due % 1440) / 60));
            setMinutes(Math.floor(edgeData.due % 60));
            setEdgeLabel(edgeData.label)
        } catch (error) {
            console.error('Failed to fetch edge:', error);
        }
    };

    useEffect(() => {
        fetchEdge();
    }, []);

    const handleOpenModal = () => {
        setIsOpen(true);
        if (document.activeElement) {
            document.activeElement.blur();
        }
    };

    const setEdge = useCallback(() => {
        const edge = getEdge(id);
        const dueInMinutes = weeks * 10080 + days * 1440 + hours * 60 + minutes;
        const updatedEdge = { ...edge, label: edgeLabel, due: dueInMinutes };
        setDatabaseEdge(updatedEdge);

        setEdges(edges =>
            edges.map(n => (n.id === id ? updatedEdge : n))
        );

    }, [id, getEdge, setEdges, edgeLabel, weeks, days, hours, minutes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'weeks':
                setWeeks(parseInt(value));
                break;
            case 'days':
                setDays(parseInt(value));
                break;
            case 'hours':
                setHours(parseInt(value));
                break;
            case 'minutes':
                setMinutes(parseInt(value));
                break;
            case 'label':
                setEdgeLabel(value)
                break;
        }
    };

    const handleSave = () => {
        setEdge();
        setIsOpen(false);
        console.log(databaseEdge)
    };

    const deleteEdge = useCallback(() => {
        setEdges(edges => edges.filter(edge => edge.id !== id));
    }, [id, setEdges]);

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

    const midPointX = (sx + tx) / 2;
    const midPointY = (sy + ty) / 2;

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
            {!label && (
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
            {selected && (
                <>
                    <foreignObject x={midPointX - 55} y={midPointY - 50} width={40} height={40} overflow="visible">
                        <button className="my-button" onClick={handleOpenModal}>Edit</button>
                    </foreignObject>
                    <foreignObject x={midPointX - 8} y={midPointY - 50} width={40} height={40} overflow="visible">
                        <button className="my-button" onClick={deleteEdge}>Delete</button>
                    </foreignObject>
                </>
            )}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Task</ModalHeader>
                    <ModalBody>
                        <Textarea
                            name="label"
                            variant="underlined"
                            minRows={2}
                            color="success"
                            label="Explain the task"
                            labelPlacement="outside"
                            value={edgeLabel}
                            onChange={handleInputChange}
                        />
                        <span className="font-thin">Deadline</span>
                        <div className="flex w-3/4 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input
                                name="weeks"
                                variant="underlined"
                                type="number"
                                color="success"
                                placeholder="0"
                                endContent={<span className="text-default-400 text-small">w</span>}
                                size="sm"
                                onChange={handleInputChange}
                                defaultValue={weeks}
                            />
                            <Input
                                name="days"
                                variant="underlined"
                                type="number"
                                color="success"
                                placeholder="0"
                                endContent={<span className="text-default-400 text-small">d</span>}
                                size="sm"
                                onChange={handleInputChange}
                                defaultValue={days}
                            />
                            <Input
                                name="hours"
                                variant="underlined"
                                type="number"
                                color="success"
                                placeholder="0"
                                endContent={<span className="text-default-400 text-small">h</span>}
                                size="sm"
                                onChange={handleInputChange}
                                defaultValue={hours}
                            />
                            <Input
                                name="minutes"
                                variant="underlined"
                                type="number"
                                color="success"
                                placeholder="0"
                                endContent={<span className="text-default-400 text-small">m</span>}
                                size="sm"
                                onChange={handleInputChange}
                                defaultValue={minutes}
                            />
                        </div>
                        <span className="text-default-400 text-small">before the event</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onClick={() => setIsOpen(false)}>Close</Button>
                        <Button color="success" onClick={handleSave}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {label ? (
                <foreignObject x={labelX} y={labelY} width={labelDimensions.width} height={labelDimensions.height}>
                    <div
                        ref={labelRef}
                        style={{
                            position: 'absolute',
                            background: 'white',
                            padding: '1px 4px 2px 4px',
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