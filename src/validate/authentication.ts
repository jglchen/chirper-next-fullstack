import jwt from 'jsonwebtoken';
const APP_SECRET = process.env.NEXT_PUBLIC_JWT_APP_SECRET as string;
import type { NextApiRequest } from 'next';
import { UserJwtPayload } from '@/lib/types';


export default function getAuthUser(req: NextApiRequest): UserJwtPayload | null{
    const {authorization} = req.headers;
    if (!authorization){
        return null;
    }
    const token = authorization.replace('Bearer ', '');
    if (!token){
        return null;
    }

    const authUser = jwt.verify(token, APP_SECRET) as UserJwtPayload;
    return authUser;
}
