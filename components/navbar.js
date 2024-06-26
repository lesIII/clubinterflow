'use client'

import {UserButton} from "@clerk/nextjs";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Link,
} from "@nextui-org/react";

import {link as linkStyles} from "@nextui-org/theme";

import {siteConfig} from "../config/site";
import NextLink from "next/link";
import clsx from "clsx";

import React from "react";
import { usePathname } from "next/navigation";

import {ThemeSwitch} from "./theme-switch";
import {
    InstagramIcon,
    FacebookIcon,
    DriveIcon,
    Logo
} from "./icons"

export default function NavbarComponent() {

	const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = React.useReducer((current) => !current, false);

	return (
        <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="xl" position="sticky" className="bg-background/0" >
            <NavbarBrand as="li" className="gap-3 max-w-fit">
                <NextLink className="flex justify-start items-center gap-1" href="/">
                    <Logo/>
                </NextLink>
            </NavbarBrand>
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">

                <ul className="hidden sm:flex gap-4 justify-start ml-2">
                    {siteConfig.navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <NextLink
                                className={clsx(
                                    linkStyles({color:
                                            item.href === pathname
                                                ? "success" // Set color to success if it matches the current page path
                                                : "foreground" // Otherwise, set color to foreground
                                        }),
                                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                                )}
                                color="foreground"
                                href={item.href}
                            >
                                {item.label}
                            </NextLink>
                        </NavbarItem>
                    ))}
                </ul>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex gap-2">
                    <Link isExternal href={siteConfig.links.instagram} aria-label="Instagram">
                        <InstagramIcon className="text-default-500"/>
                    </Link>
                    <Link isExternal href={siteConfig.links.facebook} aria-label="Facebook">
                        <FacebookIcon className="text-default-500"/>
                    </Link>
                    <Link isExternal href={siteConfig.links.drive} aria-label="Google Drive">
                        <DriveIcon className="text-default-500"/>
                    </Link>
                    <ThemeSwitch/>
                </NavbarItem>
                <NavbarItem className="hidden sm:flex">
                    <UserButton/>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
                <UserButton/>
                <ThemeSwitch/>
                <NavbarMenuToggle/>
            </NavbarContent>

            <NavbarMenu>
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                color={
                                    item.href === pathname
                                        ? "success"
                                        : "foreground"
                                }
                                href={item.href}
                                size="lg"
                                onPress={() => setIsMenuOpen()}
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
                <div className="mx-4 mt-2 flex gap-4 items-center">
                    <Link isExternal href={siteConfig.links.instagram} aria-label="Instagram">
                        <InstagramIcon className="text-default-500"/>
                    </Link>
                    <Link isExternal href={siteConfig.links.facebook} aria-label="Facebook">
                        <FacebookIcon className="text-default-500"/>
                    </Link>
                    <Link isExternal href={siteConfig.links.drive} aria-label="Google Drive">
                        <DriveIcon className="text-default-500"/>
                    </Link>
                </div>
            </NavbarMenu>

        </Navbar>

);
};
