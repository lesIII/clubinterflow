'use client'


import {Button} from "@nextui-org/button";
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

import React, { useEffect, useState } from "react"; // Add React import
import { useRouter, usePathname } from "next/navigation"; // Correct import statement for useRouter

import {ThemeSwitch} from "./theme-switch";
import {
    InstagramIcon,
    FacebookIcon,
    HeartFilledIcon,
    DriveIcon,
    Logo
} from "./icons"

export default function NavbarComponent() {

	const router = useRouter();
	const pathname = usePathname()
	const [currentPath, setCurrentPath] = useState('');
    const [isMenuOpen, setIsMenuOpen] = React.useReducer((current) => !current, false);

	useEffect(() => {
		setCurrentPath(pathname);
	}, [pathname]);

	return (
        <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="xl" position="sticky">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
                <NextLink className="flex justify-start items-center gap-1" href="/">
                    <Logo/>
                    <p className="font-bold text-green-300">CIF</p>
                </NextLink>
            </NavbarBrand>
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">

                <ul className="hidden lg:flex gap-4 justify-start ml-2">
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
                    <Button
                        isExternal
                        as={Link}
                        className="text-sm font-normal text-default-600 bg-default-100"
                        href={siteConfig.links.sponsor}
                        startContent={<HeartFilledIcon className="text-danger"/>}
                        variant="flat"
                    >
                        Sponsor
                    </Button>
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
                                        ? "success" // Set color to success if it matches the current page path
                                        : "foreground" // Otherwise, set color to foreground
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
                <div className="mx-4 mt-2 flex gap-4 items-center">
                    <Button
                        isExternal
                        as={Link}
                        className="text-sm font-normal text-default-600 bg-default-100"
                        href={siteConfig.links.sponsor}
                        startContent={<HeartFilledIcon className="text-danger"/>}
                        variant="flat"
                    >
                        Sponsor
                    </Button>
                </div>
            </NavbarMenu>

        </Navbar>

);
};
