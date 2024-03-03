import React from "react";

export default function EventLayout(props) {
	const { children } = props;
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-0 md:py-0">
			<div className="inline-block max-w-max text-center justify-center">
				{children}
			</div>
		</section>
	);
}
