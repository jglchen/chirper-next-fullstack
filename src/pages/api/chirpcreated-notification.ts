import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { outlookTransporter } from '@/lib/mailapi';
import { getHostURL } from '@/lib/hosturl';
import { chirpCreatedNotifyHTML } from '@/lib/smtpmailhttml';
import getAuthUser from '@/validate/authentication';
import { SENDER_MAIL_USER } from '@/lib/envariables';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST'){
        // Handle any other HTTP method
        res.status(405).json({ status: 'fail', message: `Method '${req.method}' Not Allowed` });
        return;
    }
    try {
        const authUser = getAuthUser(req);
        if (!authUser){
            // Handle any other HTTP method
            res.status(401).json({ status: 'fail', message: `The user is not authorized to access this resource` });
            return;
        }
        const { chirp, userName, hosturl } = req.body;
        const { userId, message } = chirp;
        
        const emailTransporter = outlookTransporter;
        const senderMail = SENDER_MAIL_USER;
        const host = hosturl ? hosturl: getHostURL();
        
        const followers = await prisma.userFollow.findMany({
            where: {
                followedId: userId,
            },
            include: {
                follower: true,
            },
        });
        const emailList = followers.map(item => item.follower.email);
        
        // setup e-mail data, even with unicode symbols
        const mailOptions = {
            from: `"Laravel Chirper " <${senderMail}>`, // sender address (who sends)
            to: emailList, // list of receivers (who receives)
            subject: `New Chirp from ${userName}`, // Subject line
            html: chirpCreatedNotifyHTML({host, senderName: userName, message})
        };
        
        //Special code for Vercel
        await new Promise((resolve, reject) => {
            // verify connection configuration
            emailTransporter.verify(function (error: any, success: any) {
                if (error) {
                    //console.log(error);
                    reject(error);
                } else {
                    //console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        await new Promise((resolve, reject) => {
            // send mail
            emailTransporter.sendMail(mailOptions, (err: any, info: any) => {
                if (err) {
                    //console.error(err);
                    reject(err);
                } else {
                    //console.log(info);
                    resolve(info);
                }
            });
        });

        res.status(200).json({status: 'We have emailed your chirp created notification.'});

    } catch (e) {
        res.status(400).end();
    }
}    