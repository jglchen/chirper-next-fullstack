import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UpdatePasswordType, UserJwtPayload, ErrorsType } from '@/lib/types';

export default async function validateUpdatePasswordAPI(inputObj: UpdatePasswordType, authUser: UserJwtPayload){
    const {current_password} = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    const user = await prisma.user.findUnique({
        where: {
            id: authUser.userId,
        }
    });

    if (user){
        valid = await bcrypt.compare(current_password, user.password);
        user.password = '';
    }

    if (valid){
        return {
            valid,
            user
        };
    }
 
    errorMsg.current_password = ['The password is incorrect.'];
    return {
        valid,
        errorMsg
    };
}
