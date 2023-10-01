import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import validateChirpSubmitAPI from '@/validate/chirp-submit-api';

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
        const { message } = req.body;
        const validateResult = await validateChirpSubmitAPI({ message });
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }
        const {userId} = authUser;
        
        const chirp = await prisma.chirp.create({ data: {
            userId,
            message,
            created_at: new Date(),
            updated_at: new Date()
        }});
 
        const result = {
            message: 'Chirp successfully created',
            chirp,
        }
        res.status(200).json(result);
    
    } catch (e) {
        res.status(400).end();
    }
}    