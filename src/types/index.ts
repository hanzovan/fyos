import mongoose, { Document } from "mongoose";
import { Session } from "next-auth";

// use to define session
export interface SiteSessionProps {
    session?: Session | null;
}


// Define an interface for User document that extends mongoose Document
export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
    emailIsVerified: boolean;
    isBlocked: boolean;
}

export interface PostBody {
    title: string;
    description: string;
    content: string;
    photo: string;
    user: mongoose.Types.ObjectId;
}

export interface PostResponse {
    isError: boolean;
    data: any;
    message: string;
}

// Define an interface for Post 
export interface IPost extends Document {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    photo: string;
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
}

// Error props for error page
export interface ErrorPageProps {
    error: any;
    reset: any;
}

// UserDocument for creating user
export interface UserDocument extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
    emailIsVerified: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}