import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import { outlookTransporter } from '@/lib/mailapi';
import { getHostURL } from '@/lib/hosturl';
import { emailVerifyHTML } from '@/lib/smtpmailhttml';
import { JWT_APP_SECRET, SENDER_MAIL_USER } from '@/lib/envariables';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST'){
        // Handle any other HTTP method
        res.status(405).json({ status: 'fail', message: `Method '${req.method}' Not Allowed` });
        return;
    }
    try {
        const { hosturl } = req.body;
        const authUser = getAuthUser(req);
        if (!authUser){
            // Handle any other HTTP method
            res.status(401).json({ status: 'fail', message: `The user is not authorized to access this resource` });
            return;
        }
        const hash = jwt.sign({ email: authUser.email }, JWT_APP_SECRET);
        const signature = jwt.sign({ email: authUser.email, current: new Date() }, JWT_APP_SECRET);
        const expires = Math.round(new Date().getTime() /1000) + 24 * 60 * 60;

        const emailTransporter = outlookTransporter;
        const senderMail = SENDER_MAIL_USER;
        const host = hosturl ? hosturl: getHostURL();

        // setup e-mail data, even with unicode symbols
        const mailOptions = {
            from: `"No Reply - Next.js User Managenent " <${senderMail}>`, // sender address (who sends)
            to: authUser.email, // list of receivers (who receives)
            subject: "Verify Email Address", // Subject line
            html: emailVerifyHTML({host, id: authUser.userId, hash, signature, expires})
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
    
        res.status(200).json({status: 'verification-link-sent'});
    } catch (e) {
        res.status(400).end();
    }    
}
