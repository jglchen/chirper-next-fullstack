import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import validateForgotPasswordAPI from '@/validate/forgot-password-api';
import { outlookTransporter } from '@/lib/mailapi';
import { getHostURL } from '@/lib/hosturl';
import { passwdResetHTML } from '@/lib/smtpmailhttml';
import { JWT_APP_SECRET, SENDER_MAIL_USER } from '@/lib/envariables';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST'){
        // Handle any other HTTP method
        res.status(405).json({ status: 'fail', message: `Method '${req.method}' Not Allowed` });
        return;
    }
    try {
        const {email, hosturl} = req.body;
        const validateResult = await validateForgotPasswordAPI({email});
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }
        const user = validateResult.user;
        const token = jwt.sign({ userId: user?.id, email, current: new Date() }, JWT_APP_SECRET);
        
        const emailTransporter = outlookTransporter;
        const senderMail = SENDER_MAIL_USER;
        const host = hosturl ? hosturl: getHostURL();

        // setup e-mail data, even with unicode symbols
        const mailOptions = {
            from: `"No Reply - Next.js User Managenent " <${senderMail}>`, // sender address (who sends)
            to: email, // list of receivers (who receives)
            subject: "Reset Password Notification", // Subject line
            html: passwdResetHTML({host, email, token})
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

        res.status(200).json({status: 'We have emailed your password reset link.'});
    } catch (e) {
        res.status(400).end();
    }
}    