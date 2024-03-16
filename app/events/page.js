'use client'

import React, {useState, useEffect} from "react"
import Flow from "./Flowchart";
import {subtitle, title} from "../../components/primitives";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button} from "@nextui-org/react";
import {EditIcon, SaveIcon} from "../../components/icons";

export default function EventPage() {
    const [showTable, setShowTable] = useState(true)
    const [event, setEvent] = useState([])
    const [events, setEvents] = useState([])
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])

    useEffect(() => {
        fetch('/api/events', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(events => {
                setEvents(events);
            })
            .catch(error => console.error('Error fetching events data:', error));
    }, []);

    const handleButtonClick = (eventId) => {
        setShowTable(false)
        fetch(`/api/events?eventId=${eventId}`, { // Update the URL with the eventId
            method: 'POST'
        })
            .then(response => response.json())
            .then(event => {
                setEvent(event)
                setNodes(event.nodes)
                setEdges(event.edges)
            })
            .catch(error => console.error('Error fetching graph data:', error))
    };

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
                                <a href="#"
                                   onClick={() => handleButtonClick(event.id)} // Pass event ID to handleButtonClick
                                   className="font-medium text-green-700 dark:text-green-500 hover:underline">
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

    const saveEvent = () => {
        fetch(`/api/events`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventId: event.id,
                name: event.name, // Pass current event name
                nodes: nodes, // Pass current nodes array
                edges: edges // Pass current edges array
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Event updated successfully')
                } else {
                    // Handle HTTP errors
                    throw new Error('Failed to update event');
                }
            })
            .catch(error => console.error('Error updating event:', error));
    };

    return (
        <div className="flex flex-col space-y-4 items-center custom-div">
            <h1 className={`${title()} `}>Workflow</h1>

            {showTable ? (
                <Table className="pt-7 ml-7">
                    <TableHeader>
                        <TableColumn className="text-center justify-center items-center">Year</TableColumn>
                        {[...Array(12)].map((_, index) => (
                            <TableColumn key={`Month-${index + 1}`} className="text-center justify-center items-center">
                                {new Date(new Date().getFullYear(), index, 1).toLocaleString('default', {month: 'long'})}
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{new Date().getFullYear()}</TableCell>
                            {renderTableCells()}
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <React.Fragment>
                    <h2 className={subtitle()}>
                        {event.name}
                    </h2>
                    <div className="flex gap-4 items-center">
                        <Button className="items-center text-center justify-center" size="sm" isIconOnly color="success"
                                variant="faded" aria-label="Edit">
                            <EditIcon/>
                        </Button>
                        <Button className="items-center text-center justify-center" size="sm" isIconOnly color="success"
                                variant="faded" aria-label="Save" onClick={saveEvent}>
                            <SaveIcon/>
                        </Button>
                    </div>
                    <div className="flex justify-start w-full ml-4 mb-4">
                        <a href="#" onClick={() => setShowTable(true)}
                           className="font-medium text-green-500 hover:underline hover:text-green-700">
                            Back to calendar
                        </a>
                    </div>
                    <Flow event={event} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
                </React.Fragment>
            )}
        </div>
    )
        ;
}
