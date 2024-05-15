import { AccountModel, UserModel } from "@/database/models";
import { UserDocument } from "@/types";
import bcrypt from "bcrypt";

// Define interface for the request body
interface CustomRequestBody {
    email: string;
    password: string;
}

const findOrCreateUser = async (body: CustomRequestBody) => {
    try {
        // look for user's info in the database
        const result = await UserModel.findOne({ email: body.email }).lean().exec() as UserDocument | null;

        // get the name from email
        const name = body?.email?.split("@")[0];

        // if user not found, create new user
        if (!result) {
            const hashPassword = await bcrypt.hash(body.password, 10);
            const newUser = await UserModel.create({
                ...body,
                name,
                role: "user",
                password: hashPassword
            });

            // create new account based on user
            await AccountModel.create({ userId: newUser._id });

            return {
                isError: false,
                data: {
                    id: newUser?._id?.toString(),
                    name: newUser.name,
                    role: newUser.role,
                    email: newUser.email,
                    avatar: newUser.avatar
                },
                message: "Created user in database successfully"
            }
        }
        // if user exist but was blocked
        if (result?.isBlocked) {
            return {
                isError: true,
                data: null,
                message: "This account was suspended, please contact support"
            }
        }

        // if user is not blocked, check for password
        const passwordMatched = await bcrypt.compare(body.password, result?.password);

        // if password not correct, inform that credential is not valid
        if (!passwordMatched) {
            return {
                isError: true,
                data: null,
                message: "Invalid credentials"
            }
        }

        // if password matched, return user info
        return {
            isError: false,
            data: {
                id: result?._id?.toString(),
                name: result.name,
                role: result.role,
                email: result.email,
                avatar: result.avatar
            },
            message: "Sign in successfully"
        }
    } catch (error) {
        return {
            isError: true,
            data: null,
            message: error instanceof Error ? error.message : "An unknown error occurred while sign in"
        }
    }
}

const getCurrentUser = async (id: any) => {
    try {
        const result = await UserModel.findOne({ _id: id}).lean().exec();
        if (!result) {
            return {
                isError: true,
                data: null,
                message: "User does not exist"
            }
        }

        // If account is blocked
        if (result?.isBlocked) {
            return {
                isError: true,
                data: null,
                message: "This account was suspended, please contact the support"
            }
        }

        return {
            isError: false,
            data: {
                id: result?._id?.toString(),
                name: result.name,
                role: result.role,
                email: result.email,
                avatar: result.avatar
            },
            message: "get current user successfully"
        }
    } catch (error) {
        return {
            isError: true,
            data: null,
            message: error instanceof Error
                ? error.message
                : "An unknown error occurred"
        }
    }
}

const UserService = { findOrCreateUser, getCurrentUser };

export { UserService };