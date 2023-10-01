import prisma from '@/lib/prisma';
import { UpdateProfileType, UserJwtPayload, ErrorsType } from '@/lib/types';

export default async function validateUpdateProfileAPI(inputObj: UpdateProfileType, authUser: UserJwtPayload){
    const {name, email} = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    if (email !== authUser.email){
        const duplicateEmailUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (duplicateEmailUser?.email){
            errorMsg.email = ['The email has already been taken.'];
            valid = false;
        }
    }

    if (valid){
        return {
         valid
        };
    }
     
    return {
        valid,
        errorMsg
    };
}
