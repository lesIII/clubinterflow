import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import { clerkClient } from '@clerk/clerk-sdk-node';
import nodemailer from 'nodemailer';
import * as changeCase from 'change-case';

const prisma = new PrismaClient();
const userList = await clerkClient.users.getUserList();

let transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: 'c4fic7@inf.elte.hu',
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function POST(request, res) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
            include: {
                nodes: true,
                edges: true
            }
        });

        return Response.json(event)
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request, res) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    try {
        const events = await prisma.event.findMany({
            include: {
                nodes: true,
                edges: true
            }
        });
        return Response.json(events)
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request) {
    if (request.method !== 'PUT') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const requestBody = await request.json();

    console.log(requestBody.edges)

    try {
        const currentEdges = await prisma.edge.findMany({
            where: {
                eventId: requestBody.eventId,
            },
        });

         await prisma.event.update({
            where: {
                id: requestBody.eventId
            },
            data: {
                name: requestBody.eventName,
                date: requestBody.date
            },
        });

        await prisma.$transaction([
            prisma.node.deleteMany({
                where: {
                    eventId: requestBody.eventId,
                },
            }),
        ]);

        await Promise.all(requestBody.nodes.map(async node => {
            await prisma.node.create({
                data: {
                    id: node.id,
                    position: node.position,
                    data: node.data,
                    eventId: requestBody.eventId,
                    type: 'custom'
                },
            });
        }));

        await prisma.$transaction([
            prisma.edge.deleteMany({
                where: {
                    eventId: requestBody.eventId,
                },
            }),
        ]);

        await Promise.all(requestBody.edges.map(async edge => {
            await prisma.edge.create({
                data: {
                    id: parseInt(edge.id),
                    source: parseInt(edge.source),
                    target: parseInt(edge.target),
                    due: edge.due,
                    label: edge.label,
                    animated: edge.animated,
                    type: edge.type,
                    markerEnd: edge.markerEnd,
                    eventId: requestBody.eventId,
                    style: edge.style
                },
            });
        }));



        for (const edge of requestBody.edges) {
            const isNewEdge = !currentEdges.some(currentEdge => currentEdge.id === edge.id);

            if (isNewEdge) {
                const subordinate_role = changeCase.snakeCase(requestBody.nodes.find(node => node.id === parseInt(edge.target)).data.label);
                const superior_manager = requestBody.nodes.find(node => node.id === parseInt(edge.source)).data.label;

                let date = new Date(requestBody.date);
                let formattedDate = date.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

                let weeks, days, hours, minutes
                if (edge.due) {
                    weeks = Math.floor(edge.due / 10080)
                    days = Math.floor((edge.due % 10080) / 1440)
                    hours = Math.floor((edge.due % 1440) / 60)
                    minutes = Math.floor(edge.due % 60)
                }

                const users = userList.data;
                const userWithRole = users.find(user => user.publicMetadata.role === subordinate_role);

                if (userWithRole) {
                    let mailOptions = {
                        from: 'c4fic7@inf.elte.hu',
                        to: userWithRole.emailAddresses[0].emailAddress,
                        subject: 'You have a new task | ClubInterFlow',
                        html: `
                        <!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; } #MessageViewBody a { color: inherit; text-decoration: none; } p { line-height: inherit } .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; } .image_block img+div { display: none; } @media (max-width:520px) { .desktop_hide table.icons-inner { display: inline-block !important; } .icons-inner { text-align: center; } .icons-inner td { margin: 0 auto; } .mobile_hide { display: none; } .row-content { width: 100% !important; } .stack .column { width: 100%; display: block; } .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; } .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; } } </style> </head> <body class="body" style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;" width="500"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h1 style="margin: 0; color: #174a0e; direction: ltr; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">You have a new task</span></h1> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> <p style="margin: 0; margin-bottom: 16px;">The following task has been assigned to you:</p> <p style="margin: 0;">${requestBody.eventName}</p> <p style="margin: 0;">${formattedDate}</p> ${edge.label ? `<p style="margin: 0;">${edge.label}</p>` : ''} ${edge.due ? `<p style="margin: 0;">Due in ${weeks} weeks, ${days} days, ${hours} hours, and ${minutes} minutes</p>` : ''} </div> </td> </tr> </table> <table class="paragraph_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> <p style="margin: 0;">Please respond to the ${superior_manager} if you accept the task or not:</p> </div> </td> </tr> </table> <table class="button_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <div class="alignment" align="center"><a href="http://clubinterflow.vercel.app/api/notification?edgeId=${edge.id}&acceptance=accepted" target="_blank" style="background-color:#8cd768;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:4px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Accept</span></span></a></div> </td> </tr> </table> <table class="button_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <div class="alignment" align="center"><a href="http://clubinterflow.vercel.app/api/notification?edgeId=${edge.id}&acceptance=declined" target="_blank" style="background-color:#ff4747;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:4px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Decline</span></span></a></div> </td> </tr> </table> <table class="image_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"> <div style="max-width: 150px;"><img src="https://clubinterflow.vercel.app/clubinterflowlogogreencentered.svg" style="display: block; height: auto; border: 0; width: 100%;" width="150" alt="clubinterflow icon" title="clubinterflow icon" height="auto"></div> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;"> <tbody> <tr> <td> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>
                        `
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            }
        }

        return new Response('Event update successful', {
            status: 200,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request) {
    if (request.method !== 'DELETE') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    try {
        await prisma.$transaction([
            prisma.node.deleteMany({
                where: {
                    eventId: parseInt(eventId),
                },
            }),
            prisma.edge.deleteMany({
                where: {
                    eventId: parseInt(eventId),
                },
            }),
            prisma.event.delete({
                where: {
                    id: parseInt(eventId),
                },
            }),
        ]);

        return new Response('Event deleted successfully.', {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}