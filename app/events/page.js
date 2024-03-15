'use client'

import React, {useState, useEffect} from "react"
import Flow from "./Flowchart";
import {title} from "../../components/primitives";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function EventPage() {
    const [showTable, setShowTable] = useState(true);
    const [event, setEvent] = useState([]);
    const [events, setEvents] = useState([]);

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

    return (
        <div className="flex flex-col space-y-4 items-center custom-div">
            <h1 className={`${title()} `}>Workflow</h1><br></br>

            {showTable ? (
                <Table>
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
                    <div className="flex justify-start w-full mb-4">
                        <a href="#" onClick={() => setShowTable(true)}
                           className="font-medium text-green-700 dark:text-green-500 hover:underline">
                            Back to calendar
                        </a>
                    </div>
                    <Flow event={event}/>
                </React.Fragment>
            )
            }
        </div>
    )
        ;
}
