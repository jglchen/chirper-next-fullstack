import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';

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
        const { followedId } = req.body;
        const {userId} = authUser;

        const userfollow = await prisma.userFollow.create({ data: {
            followerId: userId,
            followedId,
            created_at: new Date(),
        }});

        const result = {
            message: 'UserFollow successfully created',
            userfollow,
        }
        res.status(200).json(result);

    } catch (e) {
        res.status(400).end();
    }
}    
