import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {clerkClient} from "@clerk/clerk-sdk-node";
import nodemailer from "nodemailer";
import * as changeCase from 'change-case';
import { Resend } from 'resend';
import {MarkerType} from "reactflow";

const prisma = new PrismaClient();
const userList = await clerkClient.users.getUserList();
const resend = new Resend(process.env.RESEND_API_KEY);

/*
let transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: 'c4fic7@inf.elte.hu',
        pass: process.env.EMAIL_PASSWORD
    }
});*/

export async function GET(request, res) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
        });
    }

    const searchParams = request.nextUrl.searchParams
    const edgeId = searchParams.get('edgeId')
    const acceptance = searchParams.get('acceptance')
    const token = searchParams.get('token');

    try {
        const edge = await prisma.edge.findFirst({
            where: {
                token: token,
            },
        });
        if (edge) {
            const manager_node = await prisma.node.findUnique({ where: { id: edge.source } });
            const manager_role = changeCase.snakeCase(manager_node.data.label)
            const subordinate_node = await prisma.node.findUnique({ where: { id: edge.target } });
            const subordinate = subordinate_node.data.label
            const users = userList.data;
            const userWithRole = users.find(user => user.publicMetadata.role === manager_role);
            const event = await prisma.event.findUnique({ where: { id: parseInt(edge.eventId) } });
            let date = new Date(event.date);
            let formattedDate = date.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

            if (acceptance === 'accepted') {
                await prisma.edge.update({
                    where: { id: parseInt(edgeId) },
                    data: {
                        style: { stroke: 'LawnGreen' },
                        /*markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20,
                            color: '#FF0072',
                        },*/
                    },
                });
            } else {
                await prisma.edge.update({
                    where: { id: parseInt(edgeId) },
                    data: { style: { stroke: 'red' } },
                });
            }

            /*
            let mailOptions = {
                from: 'c4fic7@inf.elte.hu',
                to: userWithRole.emailAddresses[0].emailAddress,
                subject: 'A subordinate has responded to a task | ClubInterFlow',
                html: `
            <!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; } #MessageViewBody a { color: inherit; text-decoration: none; } p { line-height: inherit } .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; } .image_block img+div { display: none; } @media (max-width:520px) { .desktop_hide table.icons-inner { display: inline-block !important; } .icons-inner { text-align: center; } .icons-inner td { margin: 0 auto; } .mobile_hide { display: none; } .row-content { width: 100% !important; } .stack .column { width: 100%; display: block; } .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; } .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; } } </style> </head> <body class="body" style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;" width="500"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h1 style="margin: 0; color: #174a0e; direction: ltr; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">A subordinate has responded to a task</span></h1> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> <p style="margin: 0; margin-bottom: 16px;">The following task has been ${acceptance} by the ${subordinate}:</p> <p style="margin: 0;">${event.name}</p> <p style="margin: 0;">${formattedDate}</p> ${edge.label ? `<p style="margin: 0;">${edge.label}</p>` : ''} </div> </td> </tr> </table> <table class="image_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"> <div style="max-width: 150px;"><img src="https://clubinterflow.vercel.app/clubinterflowlogogreencentered.svg" style="display: block; height: auto; border: 0; width: 100%;" width="150" alt="clubinterflow icon" title="clubinterflow icon" height="auto"></div> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;"> <tbody> <tr> <td> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>
            `,
            };

            let emailError = null;

            try {
                let info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            } catch (error) {
                console.log(error);
                emailError = error;
            }
            */

            try {
                const { data, error } = await resend.emails.send({
                    from: 'ClubInterFlow <info@clubinterflow.hu>',
                    to: [userWithRole.emailAddresses[0].emailAddress],
                    subject: 'A subordinate has responded to a task | ClubInterFlow',
                    //react: EmailTemplate({ firstName: 'John' }),
                    html: `
                    <!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; } #MessageViewBody a { color: inherit; text-decoration: none; } p { line-height: inherit } .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; } .image_block img+div { display: none; } @media (max-width:520px) { .desktop_hide table.icons-inner { display: inline-block !important; } .icons-inner { text-align: center; } .icons-inner td { margin: 0 auto; } .mobile_hide { display: none; } .row-content { width: 100% !important; } .stack .column { width: 100%; display: block; } .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; } .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; } } </style> </head> <body class="body" style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;" width="500"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h1 style="margin: 0; color: #174a0e; direction: ltr; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">A subordinate has responded to a task</span></h1> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> <p style="margin: 0; margin-bottom: 16px;">The following task has been ${acceptance} by the ${subordinate}:</p> <p style="margin: 0;">${event.name}</p> <p style="margin: 0;">${formattedDate}</p> ${edge.label ? `<p style="margin: 0;">${edge.label}</p>` : ''} </div> </td> </tr> </table> <table class="image_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"> <div style="max-width: 150px;"><img src="https://clubinterflow.vercel.app/clubinterflowlogogreencentered.svg" style="display: block; height: auto; border: 0; width: 100%;" width="150" alt="clubinterflow icon" title="clubinterflow icon" height="auto"></div> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;"> <tbody> <tr> <td> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>
                    `,
                });

                if (error) {
                    console.log(error)
                    return new Response(`<!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; } #MessageViewBody a { color: inherit; text-decoration: none; } p { line-height: inherit } .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; } .image_block img+div { display: none; } @media (max-width:520px) { .desktop_hide table.icons-inner { display: inline-block !important; } .icons-inner { text-align: center; } .icons-inner td { margin: 0 auto; } .mobile_hide { display: none; } .row-content { width: 100% !important; } .stack .column { width: 100%; display: block; } .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; } .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; } } </style> </head> <body class="body" style="background-color: #1f1f1f; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1f1f1f;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;" width="500"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h1 style="margin: 0; color: #8cd768; direction: ltr; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">An error occured.</span></h1> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#9d9d9d;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> <p style="margin: 0;">We are sorry. 💔</p> </div> </td> </tr> </table> <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"> <div style="max-width: 150px;"><img src="https://clubinterflow.vercel.app/clubinterflowlogogreencentered.svg" style="display: block; height: auto; border: 0; width: 100%;" width="150" alt="clubinterflow icon" title="clubinterflow icon" height="auto"></div> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;"> <tbody> <tr> <td> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`, {
                        status: 500,
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    });
                } else {
                    return new Response(`<!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; } #MessageViewBody a { color: inherit; text-decoration: none; } p { line-height: inherit } .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; } .image_block img+div { display: none; } @media (max-width:520px) { .desktop_hide table.icons-inner { display: inline-block !important; } .icons-inner { text-align: center; } .icons-inner td { margin: 0 auto; } .mobile_hide { display: none; } .row-content { width: 100% !important; } .stack .column { width: 100%; display: block; } .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; } .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; } } </style> </head> <body class="body" style="background-color: #1f1f1f; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1f1f1f;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;" width="500"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h1 style="margin: 0; color: #8cd768; direction: ltr; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">Your response has been submitted.</span></h1> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#9d9d9d;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> <p style="margin: 0;">Thank you for the feedback! ❤️</p> </div> </td> </tr> </table> <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"> <div style="max-width: 150px;"><img src="https://clubinterflow.vercel.app/clubinterflowlogogreencentered.svg" style="display: block; height: auto; border: 0; width: 100%;" width="150" alt="clubinterflow icon" title="clubinterflow icon" height="auto"></div> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;"> <tbody> <tr> <td> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`, {
                        status: 200,
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    });
                }

            } catch (error) {
                return Response.json({ error }, { status: 500 });
            }

        } else {
            return new Response()
        }

    } catch (error) {
        console.error('Error fetching graph data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}

