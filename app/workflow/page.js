'use client'

import Flow from "../workflow/ReactFlow";
import { title } from "../../components/primitives"


export default function WorkflowPage() {
	return (


		<div className="flex flex-col space-y-4" style={{width: '1200px', height: '900px'}}>
			<h1 className={`${title()} `}>Workflow</h1><br></br>
			<Flow/>
		</div>
	);
}