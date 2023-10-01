import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { JWT_APP_SECRET } from "@/lib/envariables";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST'){
        // Handle any other HTTP method
        res.status(405).json({ status: 'fail', message: `Method '${req.method}' Not Allowed` });
        return;
    }
    try {
        const { id, hash, expires, signature} = req.body;
        const {email} = jwt.verify(hash, JWT_APP_SECRET) as {email: string};
        const signatureObj = jwt.verify(signature, JWT_APP_SECRET) as {email: string; current: string};
        if (email !== signatureObj.email){
            res.status(403).json({ status: 'fail', message: 'Invalid signature'});
        }
        const expireSignature =  Math.round(new Date(signatureObj.current).getTime()/1000) + 24 * 60 * 60; 
        if (+expires !== expireSignature) {
            res.status(403).json({ status: 'fail', message: 'Invalid signature'});
        } 
        if ((new Date().getTime()/1000) > +expires){
            res.status(403).json({ status: 'fail', message: 'Invalid signature'});
        }

        const updateUser = await prisma.user.update({
            where: {
              id: +id,
            },
            data: {
              email_verified_at: new Date()
            },
        });
        updateUser.password = '';

        res.status(200).json({status: 'Email successfully verified', user: updateUser});
    } catch (e) {
        res.status(400).end();
    }    
}
