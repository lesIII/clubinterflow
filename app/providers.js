"use client";

const React = require("react");
const { NextUIProvider } = require("@nextui-org/system");
const { useRouter } = require('next/navigation');
const { ThemeProvider: NextThemesProvider } = require("next-themes");

function Providers({ children, themeProps }) {
	const router = useRouter();

	return (
		React.createElement(NextUIProvider, { navigate: router.push },
			React.createElement(NextThemesProvider, themeProps, children)
		)
	);
}

module.exports = { Providers };
