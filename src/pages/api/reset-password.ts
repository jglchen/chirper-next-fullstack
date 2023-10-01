import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import validatePasswordResetAPI from '@/validate/password-reset-api';
import { UserJwtPasswdReset } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST'){
        // Handle any other HTTP method
        res.status(405).json({ status: 'fail', message: `Method '${req.method}' Not Allowed` });
        return;
    }
    try {
        const {token, email, password, password_confirmation} = req.body;
        const validateResult = await validatePasswordResetAPI({token, email, password, password_confirmation});
        if (!validateResult.valid){
            res.status(422).json(validateResult.errorMsg);
            return; 
        }
        const {userId} = validateResult.tokenUser as UserJwtPasswdReset;
        const bcrytPassword = await bcrypt.hash(password, 10);
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
            status: 'Your password has been reset.',
        }
        res.status(200).json(result);
    
    } catch (e) {
        res.status(400).end();
    }
}    