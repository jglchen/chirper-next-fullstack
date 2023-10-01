import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET'){
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
        const {userId} = authUser;

        const followings = await prisma.userFollow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followedId: true,
            },
        });
        
        res.status(200).json(followings.map(item => item.followedId));

    } catch (e) {
        res.status(400).end();
    }
}    