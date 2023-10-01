import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const authUser = getAuthUser(req);
        if (!authUser){
            // Handle any other HTTP method
            res.status(401).json({ status: 'fail', message: `The user is not authorized to access this resource` });
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
              id: authUser.userId,
            },
        });
        if (user?.id){
            user.password = '';
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(400).end();
    }
}
