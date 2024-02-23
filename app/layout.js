import "@/styles/globals.css";
import { siteConfig } from "../config/site";
import { fontSans } from "../config/fonts";
import { Providers } from "./providers";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import NavbarComponent from "../components/navbar";
import React from "react";

export const metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/asd.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
									   children,
								   }) {
	return (
		React.createElement(ClerkProvider, {
				appearance: {
					baseTheme: dark,
					variables: {
						colorPrimary: "#B7D660",
					}
				},
				publishableKey: clerk_pub_key
			},
			React.createElement("html", { lang: "en", suppressHydrationWarning: true },
				React.createElement("head", null, React.createElement("title", null, "ClubInterFlow")),
				React.createElement("body", { className: clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable), style: { backgroundColor: "#1e1e1e" } },
					React.createElement(Providers, { themeProps: { attribute: "class", defaultTheme: "dark" } },
						React.createElement("div", { className: "flex flex-col min-h-screen" },
							React.createElement(NavbarComponent, null),
							React.createElement("main", { className: "container mx-auto max-w-7xl pt-6 px-6 flex-grow" }, children),
							React.createElement("footer", { className: "w-full flex items-center justify-center py-3 align-bottom" },
								React.createElement(Link, { isExternal: true, className: "flex items-center gap-1 text-current", href: "https://www.linkedin.com/in/lászló-gulyás-630407246/", title: "linkedin.com/in/lászló-gulyás-630407246" },
									React.createElement("span", { className: "text-default-600" }, "Created by"),
									React.createElement("p", { className: "text-success" }, "László Gulyás")
								)
							)
						)
					)
				)
			)
		)
	);
}
