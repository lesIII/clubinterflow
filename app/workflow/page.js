'use client'

import Flow from "../workflow/ReactFlow";
import {subtitle, title} from "../../components/primitives"
import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";

export default function WorkflowPage() {

	const [eventName, setEventName] = useState('');

	useEffect(() => {
		// Fetch event data from the API when the component mounts
		fetch('/api')
			.then(response => response.json())
			.then(event => {
				setEventName(event.name); // Update eventName state with the fetched event name
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
				{eventName || 'Loading...'}
			</Button>
			</div>
			<Flow/>
		</div>
	);
}
