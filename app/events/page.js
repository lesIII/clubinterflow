'use client'

import Flow from "./Flowchart";
import {subtitle, title} from "../../components/primitives"
import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";

export default function EventPage() {

	const [eventName, setEventName] = useState('')
	const [event, setEvent] = useState()

	useEffect(() => {
		fetch('/api/events?eventId=1', {
			method: 'POST'
		})
			.then(response => response.json())
			.then(event => {
				setEvent(event);
			})
			.catch(error => console.error('Error fetching graph data:', error));
	}, []);

	return (
		<div className="flex flex-col space-y-4 items-center custom-div"  >
			<h1 className={`${title()} `}>Workflow</h1><br></br>
			<h2 className={subtitle({class: "mt-4"})}>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				Upcoming events
			</h2>
			<div className="w-1/5">

				<Button
					radius="lg"
					color="success"
					variant="ghost"
					size="lg"
					fullWidth
					className="mb-4"
					onPress={() => router.push('/login')}
				>
					{event && event.name ? event.name : 'o0o'}
				</Button>
			</div>
			<Flow/>
		</div>
	);
}