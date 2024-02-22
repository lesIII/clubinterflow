'use client'

import { title } from "@/components/primitives";

import Flow from "@/app/workflow/ReactFlow";

export default function WorkflowPage() {
	return (


		<div className="flex flex-col space-y-4" style={{width: '1200px', height: '900px'}}>
			<h1 className={`${title()} `}>Workflow</h1><br></br>
			<Flow/>
		</div>
	);
}
