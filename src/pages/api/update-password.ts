import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import validateUpdatePasswordAPI from '@/validate/update-password-api';
import { UserJwtPayload } from '@/lib/types';

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
        const {current_password, password, password_confirmation} = req.body;
        const validateResult = await validateUpdatePasswordAPI({current_password, password, password_confirmation}, authUser as UserJwtPayload);
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }
       
        const bcrytPassword = await bcrypt.hash(password, 10);
        const {userId} = authUser;
        const updateUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
                password: bcrytPassword,
                updated_at: new Date()
            },
        });

        const result = {
            message: 'Password successfully updated',
        }
        res.status(200).json(result);
    } catch (e) {
        res.status(400).end();
    }
}          