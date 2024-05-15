import { clientPromise } from "@/database/db";
import { UserZodSchema } from "@/database/schema";
import { UserService } from "@/lib/services";
import { encryptString, signJwtToken, standardizeProfile, verifyJwtToken } from "@/lib/utils";
import { validateZodInput } from "@/lib/validators";
import { CustomSession } from "@/types";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { nanoid } from "nanoid";
import { NextAuthOptions, Session } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

interface GenerateAccessTokenProps {
    accessToken: string;
    user: {
        [key: string]: any;
    };
    isRefresh: boolean;
}

const generateAccessToken = async ({
    accessToken,
    user,
    isRefresh
}: GenerateAccessTokenProps): Promise<string> => {
    try {
        const verifyAccessToken = await verifyJwtToken(accessToken);
        if (!isRefresh && !accessToken) {
            const encryptData = encryptString(JSON.stringify(user));
            const signToken = await signJwtToken({ user: encryptData });

            return signToken;
        }
        if (isRefresh && verifyAccessToken.isError) {
            // make a db call
            const result = await UserService.getCurrentUser(user.id);
            if (result.isError) {
                throw new Error(result.message);
            }
            const encryptData = encryptString(JSON.stringify(result.data));
            const signToken = await signJwtToken({ user: encryptData });

            return signToken;
        }

        return accessToken;
    } catch (error) {
        throw new Error( error instanceof Error ? error.message : "An unknown error occurred")
    }
}

const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise) as Adapter,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60,
        generateSessionToken: () => {
            return nanoid(32);
        }
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email e.g. me@example.com"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password"
                }
            },
            async authorize(credentials) {
                try {
                    // validate inputs
                    const parsedResult = validateZodInput(credentials, UserZodSchema);
                    if (parsedResult.isError) throw new Error(parsedResult.message);

                    // make a db call
                    const result = await UserService.findOrCreateUser(parsedResult.data);
                    if (result.isError) throw new Error(result.message);

                    return result.data;
                } catch (error) {
                    throw new Error( error instanceof Error ? error.message : "An unknown error occurred")
                }
            }
        }),
        Github({
            clientId: process.env.GITHUB_ID ?? "Github client ID not found",
            clientSecret: process.env.GITHUB_SECRET ?? "Github clientSecret not found",

            // Get the profile from github, save it to database via Adapter
            profile: (user, tokens) => standardizeProfile(user, tokens)
        }),
        Google({
            clientId: process.env.GOOGLE_ID ?? "Google client ID not found",
            clientSecret: process.env.GOOGLE_SECRET ?? "Google clientSecret not found",
            profile: (user, tokens) => standardizeProfile(user, tokens)
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            if (url.startsWith("/")) return url;
            return baseUrl;
        },
        async session({
            session,
            token
        }: {
            session: Session;
            token: JWT;
        }): Promise<Session> {
            const customSession = session as CustomSession;
            if (token) {
                customSession.user = token?.user as any;
                customSession.accessToken = token?.accessToken as string;
            }
            return customSession;
        },
        async jwt({
            token,
            user
        }: {
            token: { [key: string]: any };
            user: { [key: string]: any } | null;
        }) {
            if (token && user) {
                const _user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    avatar: user.avatar
                };
                // create a fn generate access token
                const accessToken = await generateAccessToken({
                    accessToken: token?.accessToken,
                    user: _user,
                    isRefresh: false
                });
                token.user = _user;
                token.accessToken = accessToken;
            }
            if (token && !user) {
                const _user = token?.user;

                const accessToken = await generateAccessToken({
                    accessToken: token?.accessToken,
                    user: _user,
                    isRefresh: true
                });
                token.user = _user;
                token.accessToken = accessToken;
            }
            return token;
        }
    },
    pages: {
        error: "/auth/error"
    }
}

export { authOptions };