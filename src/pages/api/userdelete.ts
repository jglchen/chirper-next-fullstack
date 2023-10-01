import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import validateUserDeleteAPI from '@/validate/userdelete-api';
import { UserJwtPayload } from '@/lib/types';

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
        const { password } = req.body;
        const validateResult = await validateUserDeleteAPI({password}, authUser as UserJwtPayload);
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }

        const {userId} = authUser;
        const deleteUser = await prisma.user.delete({
            where: {
              id: userId,
            },
        })

        const result = {
            message: 'Account already deleted.',
        }
        res.status(200).json(result);

    } catch (e) {
        res.status(400).end();
    }
}
