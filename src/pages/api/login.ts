import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import validateLoginAPI from '@/validate/login-api';
import { JWT_APP_SECRET } from '@/lib/envariables';
import prisma from '@/lib/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST'){
        // Handle any other HTTP method
        res.status(405).json({ status: 'fail', message: `Method '${req.method}' Not Allowed` });
        return;
    }
    try {
        const {email, password} = req.body;
        const validateResult = await validateLoginAPI({email, password});
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }
        const user = validateResult.user;
        const token = jwt.sign({ userId: user?.id, email, issued_at: new Date() }, JWT_APP_SECRET);

        const result = {
            user,
            authorization: {
                token,
                type: 'bearer'
            }
        }
        res.status(200).json(result);
    
    } catch (e) {
        res.status(400).end();
    }

}    
