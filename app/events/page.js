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
    Spinner,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import Image from 'next/image'
import { Managers } from '../roles';

import { DateTimePicker, MobileDateTimePicker, LocalizationProvider  } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs"
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { useUser } from '@clerk/clerk-react';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', date: dayjs(), roles: '' });
    const [roleKeys, setRoleKeys] = React.useState(new Set(["president"]));
    const [isLoadingFlow, setIsLoadingFlow] = useState(false);
    const { user } = useUser();
    const [editor, setEditor] = useState(false);

    const roleValue = React.useMemo(
        () => Array.from(roleKeys).join(", ").replaceAll("_", " "),
        [roleKeys]
    );

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
        setIsLoadingFlow(true);
        setShowTable(false)
        setEvent([]);
        setNodes([]);
        setEdges([]);

        await fetch(`/api/events?eventId=${eventId}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(event => {
                console.log('Fetched event:', event); // Add logging here
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
                    target: edge.target.toString(),
                    style: edge.style
                })))
                setEditor(event.editorRoles.includes(user.publicMetadata.role))
                setIsLoadingFlow(false);
            })
            .catch(error => {
                console.error('Error fetching graph data:', error)
                setIsLoadingFlow(false);
            })
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
                    id: parseInt(edge.id),
                    due: parseInt(edge.due),
                    source: parseInt(edge.source),
                    target: parseInt(edge.target),
                    style: edge.style,
                    ...edge,
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

    const handleFormSubmit = async () => {
        await fetch(`/api/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newEvent.name,
                date: newEvent.date,
                editorRoles: [...roleKeys]
            })
        })
            .then(response => {
                if (response.ok) {
                } else {
                    throw new Error('Failed to create event');
                }
            })
            .catch(error => console.error('Error creating event:', error));
        await fetchEvents();
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
        console.log([...roleKeys])
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

    const deleteEvent = async () => {
        await fetch(`/api/events?eventId=${event.id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    throw new Error('Failed to delete event');
                }
            })
            .catch(error => console.error('Error deleting event:', error));
    };

    return (
        <div className="flex flex-col space-y-4 items-center custom-div">
            <h1 className={`${title()} mb-5`}>Workflow</h1>
            {showTable ? (
                <>
                    <Button color="success"variant="ghost" size="md" onClick={() => setIsModalOpen(true)}>Create Event</Button>
                    <Modal isOpen={isModalOpen} isDismissable={false} onClose={() => setIsModalOpen(false)}>
                        <ModalContent>
                            <ModalHeader>Create Event</ModalHeader>
                            <ModalBody>
                                <Input
                                    name="name"
                                    placeholder="Event Name"
                                    onChange={handleInputChange}
                                />
                                <ThemeProvider theme={darkTheme}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileDateTimePicker
                                            defaultValue={dayjs()}
                                            name="date"
                                            value={newEvent.date}
                                            onChange={(newValue) => setNewEvent({ ...newEvent, date: newValue })}
                                        />
                                    </LocalizationProvider>
                                </ThemeProvider>
                                <p className="text-sm">Who can edit the event?</p>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            className="capitalize"
                                        >
                                            {roleValue}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Multiple selection example"
                                        variant="flat"
                                        closeOnSelect={false}
                                        disallowEmptySelection
                                        selectionMode="multiple"
                                        selectedKeys={roleKeys}
                                        onSelectionChange={setRoleKeys}
                                    >
                                        {Object.entries(Managers).map(([key, value]) => (
                                            <DropdownItem key={key}>{value}</DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onClick={() => setIsModalOpen(false)}>Close</Button>
                                <Button color="success" onClick={handleFormSubmit}>Save</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Table className="ml-5 mr-5">
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
                </>
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
                           className="font-medium text-green-500 hover:underline hover:text-green-700 cursor-pointer">
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
                                            alt="Save event"
                                            className="filter-green"
                                        />
                                    </Button>
                                    <Button className="items-center text-center justify-center" size="sm" isIconOnly
                                            color="success" variant="faded" aria-label="Delete" onClick={deleteEvent}>
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
                                            alt="Cancel"
                                            className="filter-green"
                                        />
                                    </Button>
                                </React.Fragment>
                            ) : (
                                <>
                                { editor && (
                                    <Button className="items-center text-center justify-center" size="sm" isIconOnly
                                            color="success" variant="faded" aria-label="Edit" onClick={editEvent}>
                                        <Image
                                            src="/edit.svg"
                                            width={18}
                                            height={18}
                                            alt="Edit event"
                                            className="filter-green"
                                        />
                                    </Button>
                                ) }</>
                            )}
                        </div>
                    </div>
                    {isLoadingFlow ? (
                        <Spinner color="success" />
                    ) : (
                        <Flow event={event} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}
                              editorMode={editorMode}/>
                    )}
                </React.Fragment>
            )}
        </div>
    )}
