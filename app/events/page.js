'use client'

import React, {useState, useEffect} from "react"
import Flow from "./Flowchart"
import {title} from "../../components/primitives"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Spinner
} from "@nextui-org/react";
import Image from 'next/image'

import { DateTimePicker, LocalizationProvider  } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs"
import { ThemeProvider, createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function EventPage() {
    const [showTable, setShowTable] = useState(true)
    const [editorMode, setEditorMode] = useState(false)
    const [event, setEvent] = useState([])
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [dateTime, setDateTime] = React.useState(null);

    const fetchEvents = async () => {
        await fetch('/api/events', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(events => {
                setEvents(events);
                setIsLoading(false)
            })
            .catch(error => console.error('Error fetching events data:', error));
    }

    useEffect(() => {
        fetchEvents()
    }, []);

    const fetchEvent = async (eventId) => {
        setShowTable(false)
        await fetch(`/api/events?eventId=${eventId}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(event => {
                setEvent(event)
                setDateTime(dayjs(event.date))
                setNodes(event.nodes.map(node => ({
                    ...node,
                    id: node.id.toString(),
                })))
                setEdges(event.edges.map(edge => ({
                    ...edge,
                    id: edge.id.toString(),
                    due: edge.due,
                    source: edge.source.toString(),
                    target: edge.target.toString()
                })))
            })
            .catch(error => console.error('Error fetching graph data:', error))
        setEditorMode(false)
    };

    const saveEvent = async () => {
        await fetch(`/api/events`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventId: event.id,
                eventName: event.name,
                date: dateTime,
                name: event.name,
                nodes: nodes.map(node => ({
                    ...node,
                    id: parseInt(node.id),
                })),
                edges: edges.map(edge => ({
                    ...edge,
                    id: parseInt(edge.id),
                    due: parseInt(edge.due),
                    source: parseInt(edge.source),
                    target: parseInt(edge.target),
                }))
            })
        })
            .then(response => {
                if (response.ok) {
                } else {
                    throw new Error('Failed to update event');
                }
            })
            .catch(error => console.error('Error updating event:', error));
        fetchEvent(event.id)
        fetchEvents()
    };

    const editEvent = () => {
        setEditorMode(true)
    }

    const renderTableCells = () => {
        const cells = [];
        const currentYear = new Date().getFullYear();

        for (let i = 1; i <= 12; i++) {
            const eventsInMonth = events.filter(event => new Date(event.date).getMonth() === i - 1);

            if (eventsInMonth.length > 0) {
                cells.push(
                    <TableCell key={`${currentYear}-${i}`}>
                        {eventsInMonth.map(event => (
                            <React.Fragment key={event.id}>
                                <a
                                   onClick={() => fetchEvent(event.id)}
                                   className="font-medium text-green-700 dark:text-green-500 hover:underline"
                                   style={{ cursor: 'pointer' }}>
                                    {event.name}
                                </a>
                                <br/>
                            </React.Fragment>
                        ))}
                    </TableCell>
                );
            } else {
                cells.push(<TableCell key={`${currentYear}-${i}`}></TableCell>);
            }
        }
        return cells;
    };

    return (
        <div className="flex flex-col space-y-4 items-center custom-div">
            <h1 className={`${title()} `}>Workflow</h1>
            {showTable ? (
                <Table className="pt-7 ml-7">
                    <TableHeader>
                        <TableColumn className="text-center justify-center items-center">Year</TableColumn>
                        {[...Array(12)].map((_, index) => (
                            <TableColumn key={`Month-${index + 1}`}
                                         className="text-center justify-center items-center">
                                {new Date(new Date().getFullYear(), index, 1).toLocaleString('default', {month: 'long'})}
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody isLoading={isLoading}
                               loadingContent={<Spinner color="success" />}>
                        <TableRow>
                            <TableCell>{new Date().getFullYear()}</TableCell>
                            {renderTableCells()}
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <React.Fragment>
                    {editorMode ? (
                        <>
                            <Input
                                radius="none"
                                placeholder="Name your event"
                                defaultValue={event.name}
                                className="max-w-[220px]"
                                color="success"
                                variant="underlined"
                                onChange={(e) => setEvent({...event, name: e.target.value})}
                            />
                            <ThemeProvider theme={darkTheme}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker value={dateTime} onChange={(newValue) => setDateTime(newValue)}/>
                                </LocalizationProvider>
                            </ThemeProvider>


                        </>
                    ) : (
                        event.date &&
                        <>
                            <h2 className={`underline underline-offset-2 decoration-green-500 text-2xl`}>
                                {event.name}
                            </h2>
                            <h2 className="text-medium font-light">
                                {new Date(event.date).toLocaleString('hu-HU', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </h2>
                        </>
                    )}

                    <div className="flex justify-between w-full ml-4 mb-4">
                        <a onClick={() => setShowTable(true)}
                           className="font-medium text-green-500 hover:underline hover:text-green-700">
                            Back to calendar
                        </a>
                        <div className="flex gap-4 items-center mr-4">
                            {editorMode ? (
                                <React.Fragment>
                                    <Button className="items-center text-center justify-center" size="sm" isIconOnly
                                            color="success" variant="faded" aria-label="Save" onClick={saveEvent}>
                                        <Image
                                            src="/save.svg"
                                            width={18}
                                            height={18}
                                            alt="Delete event"
                                            className="filter-green"
                                        />
                                    </Button>
                                    <Button className="items-center text-center justify-center" size="sm" isIconOnly
                                            color="success" variant="faded" aria-label="Edit">
                                        <Image
                                            src="/delete.svg"
                                            width={18}
                                            height={18}
                                            alt="Delete event"
                                            className="filter-green"
                                        />
                                    </Button>
                                    <Button className="items-center text-center justify-center" size="sm" isIconOnly
                                            color="success" variant="faded" aria-label="Cancel"
                                            onClick={() => fetchEvent(event.id)}>
                                        <Image
                                            src="/cancel.svg"
                                            width={18}
                                            height={18}
                                            alt="Delete event"
                                            className="filter-green"
                                        />
                                    </Button>
                                </React.Fragment>
                            ) : (
                                <Button className="items-center text-center justify-center" size="sm" isIconOnly
                                        color="success" variant="faded" aria-label="Edit" onClick={editEvent}>
                                    <Image
                                        src="/edit.svg"
                                        width={18}
                                        height={18}
                                        alt="Delete event"
                                        className="filter-green"
                                    />
                                </Button>
                            )}
                        </div>
                    </div>
                    <Flow event={event} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}
                          editorMode={editorMode}/>
                </React.Fragment>
            )}
        </div>
    )}
