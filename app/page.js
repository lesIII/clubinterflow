'use client'

import {subtitle, title} from "../components/primitives"
import React from "react";
import {Button} from "@nextui-org/react";
import {useRouter} from 'next/navigation';
import {useAuth} from "@clerk/nextjs";
import {Image} from "@nextui-org/react";

export default function Home() {
    const router = useRouter()
    const {isLoaded, userId} = useAuth();
    return (

        <section className="flex flex-col items-center justify-center gap-2 py-0 md:py-0">

            <div className="inline-block max-w-[44rem] text-center justify-center">
                <h1 className={title()}>
                    Manage community events and distribute tasks with the&nbsp;
                </h1>
                <h1 className={title({color: "green"})}>ClubInterFlow&nbsp;</h1>
                <h1 className={title()}>
                    web interface.
                </h1>
                <h2 className={subtitle({class: "mt-4"})}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Implemented for Club'89 of KCSSK.
                </h2>
                <br></br>
            </div>

            <div className="w-1/5 text-center">

                {(!isLoaded || !userId) && (
                    <>
                        <Button
                            radius="lg"
                            color="success"
                            variant="ghost"
                            size="lg"
                            fullWidth
                            className="mb-4"
                            onPress={() => router.push('/login')}
                        >
                            Login
                        </Button>
                        <br></br>
                        <Button
                            radius="lg"
                            color="success"
                            variant="ghost"
                            size="lg"
                            fullWidth
                            onPress={() => router.push('/sign-up')}
                        >
                            Sign Up
                        </Button>
                    </>
                )}

            </div>

            <Image
                isBlurred
                width={300}
                alt="ClubInterFlow logo"
                src="/clubinterflowlogogreencentered.svg"
                className="wiggle"
            />


        </section>

    );
}
