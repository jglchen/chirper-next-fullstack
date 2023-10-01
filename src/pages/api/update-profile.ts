import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import validateUpdateProfileAPI from '@/validate/update-profile-api';
import { UserJwtPayload } from '@/lib/types';
import { JWT_APP_SECRET } from '@/lib/envariables';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH' && req.method !== 'PUT'){
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
        const {name, email} = req.body;
        const validateResult = await validateUpdateProfileAPI({name, email}, authUser as UserJwtPayload);
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }
        const {userId} = authUser;
        const updateUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              name: name,
              email: email,
              updated_at: new Date()
            },
        });
        updateUser.password = '';
        const token = jwt.sign({ userId, email, current: new Date() }, JWT_APP_SECRET);

        const result = {
            message: 'Profile successfully updated',
            user: updateUser,
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