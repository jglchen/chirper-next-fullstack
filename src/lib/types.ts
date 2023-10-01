export interface ErrorsType {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    current_password?: string[];
}

export interface MsgErrorsType {
    message?: string[];
}

export interface UserJwtPayload {
    userId: number;
    email: string;
    issued_at?: string;
}

export interface UserJwtPasswdReset {
    userId: number;
    email: string;
    current: string;
}

export interface UserType {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    email_verified_at?: string | null;
    followers?: UserFollowType[];
    followeds?: UserFollowType[];
    created_at?: string;
    updated_at?: string;
}

export interface ChirpType {
    id: number;
    message: string;
    user: UserType;
    created_at: string;
    updated_at: string;
}

export interface UserFollowType {
    id?: number;
    followerId?: number;
    followedId?: number;
    created_at?: string;
}

export interface FollowingType {
    followedId: number;
}

export interface AuthorizationType {
    token: string;
    type: string;
}

export interface User {
    user: UserType;
}

export interface UserResponseType {
    message?: string;
    user: UserType;
    authorization: AuthorizationType;
}

export interface UserContextType {
    user: UserType;
    authToken: string;
    userlLogin: (userResponse?: UserResponseType) => void,
    userlLogout: () => void,
}

export interface RegisterInputType {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginInputType {
    email: string;
    password: string;
    remember?: boolean;
}

export interface UpdateProfileType {
    name: string;
    email: string;
}

export interface UpdatePasswordType {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface UserDeleteType {
    password: string;
}

export interface ForgotPasswordType {
    email: string;
}

export interface ResetPasswordHTMLType {
    host: string;
    email: string;
    token: string;
}

export interface PasswordResetType {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface VerifyEmailHTMLType {
    host: string;
    id: number;
    hash: string;
    signature: string;
    expires: number;
}

export interface ChirpCreatedNotifyHTMLType {
    host: string;
    senderName: string; 
    message: string;
}

export interface ChirpSubmitType {
    message: string;
}
