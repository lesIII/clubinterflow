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
		icon: "/logo.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }) {
	return (
		<ClerkProvider
		appearance={{
			baseTheme: dark,
			variables: {
				colorPrimary: "#B7D660",
			}
		}}
		publishableKey={clerk_pub_key}
		>
			<html lang="en">
			<head>
				<title>ClubInterFlow</title>
			</head>
			<body className={clsx("min-h-screen font-sans antialiased", fontSans.variable)}>
			<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
				<div className="flex flex-col min-h-screen">
					<NavbarComponent />
					<main className="container mx-auto max-w-7xl pt-6 px-6 flex-grow">
						{children}
					</main>
					<footer className="w-full flex items-center justify-center py-3 align-bottom">
						<Link
							isExternal
							className="flex items-center gap-1 text-current"
							href="https://www.linkedin.com/in/lászló-gulyás-630407246/"
							title="linkedin.com/in/lászló-gulyás-630407246"
						>
							<span className="text-default-600">Created by</span>
							<p className="text-success">László Gulyás</p>
						</Link>
					</footer>
				</div>
			</Providers>
			</body>
			</html>
		</ClerkProvider>
	);
}