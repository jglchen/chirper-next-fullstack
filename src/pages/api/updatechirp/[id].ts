import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import validateChirpSubmitAPI from '@/validate/chirp-submit-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT' && req.method !== 'PATCH'){
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
        
        const {id} = req.query;
        const chirpId = parseInt(id as string);
        const chirp = await prisma.chirp.findUnique({
            where: {
                id: chirpId,
            },
        });
        if (chirp?.userId !== userId){
            res.status(422).json({message: ['You are not allowed to update this chirp message.']});
            return; 
        }

        const updateChirp = await prisma.chirp.update({
            where: {
              id: chirpId,
              userId,
            },
            data: {
              message,
              updated_at: new Date(),
            },
        });
   
        res.status(200).json(updateChirp);

    } catch (e) {
        res.status(400).end();
    }
}    
