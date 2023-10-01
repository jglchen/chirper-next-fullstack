import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from '@/validate/authentication';
import { COUNT_PER_PAGE } from '@/lib/envariables';

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
        let { p } = req.query;
        const page = typeof p === 'undefined' ? 0: parseInt(p as string);
        const chirps = await prisma.chirp.findMany({
            skip: page * COUNT_PER_PAGE,
            take: COUNT_PER_PAGE,
            select: {
                id: true,
                message: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        //followeds: {
                            //select: {
                                //followerId: true
                            //}
                        //}
                    }
                }
            },            
            orderBy: {
                created_at: "desc",
            }
        });

        if (page > 0){
            res.status(200).json({
                page,
                chirps,
            });
        }
        
        const chirpNum = await prisma.chirp.aggregate({
            _count: {
              id: true,
            },
        });
        const count = chirpNum._count.id;
        const pageCount = Math.ceil(count / COUNT_PER_PAGE);

        res.status(200).json({
            page,
            pageCount,
            chirps,
        });
    
    } catch (e) {
        res.status(400).end();
    }
}    
