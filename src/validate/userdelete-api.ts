import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserDeleteType, UserJwtPayload, ErrorsType } from '@/lib/types';

export default async function validateUserDeleteAPI(inputObj: UserDeleteType, authUser: UserJwtPayload){
    const { password } = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    const user = await prisma.user.findUnique({
        where: {
            id: authUser.userId,
        }
    });

    if (user){
        valid = await bcrypt.compare(password, user.password);
        user.password = '';
    }

    if (valid){
        return {
            valid,
            user
        };
    }
 
    errorMsg.password = ['The password is incorrect.'];
    return {
        valid,
        errorMsg
    };
}
