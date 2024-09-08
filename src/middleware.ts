import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decryptString, verifyJwtToken } from "./lib/utils";

export const config = {
    matcher: [
        "/api/users",
        "/api/users/:path*",
        "/api/posts",
        "/api/posts/:path*"
    ]
}

// const publicPostsRegexPattern = /^\/api\/posts\?type=public$/;

// now make exception for both /api/posts?type=public and /api/posts/slug?type=public
const publicPostsRegexPattern = /^\/api\/posts(?:\/[\w-]+)?\?type=public$/;

export async function middleware(request: NextRequest): Promise<NextResponse> {
    try {
        const nextUrl = request.nextUrl;
        const pathname = nextUrl.pathname;
        const search = nextUrl?.search;
        const path = `${pathname}${search}`;
        const httpMethod = request.method

        if(publicPostsRegexPattern.test(path) && httpMethod === "GET") {
            request.headers.set("user", "")
            return NextResponse.next({request})
        }

        // authenticate the request
        const headerList = headers();
        const authorization = headerList.get("Authorization");

        if (!authorization) {
            return new NextResponse("middleware > authorization fail!", { status: 401 });
        }

        const accessToken = authorization.split("Bearer ")[1];

        if (!accessToken) {
            return new NextResponse("Can not get accessToken", { status: 401 });
        }

        const result = await verifyJwtToken(accessToken);

        if (result.isError) {
            return new NextResponse("verifyJwtToken not success", { status: 403 });
        }

        const decrypted = decryptString(result?.data?.user as any);

        if (!decrypted) {
            return new NextResponse("decryptString not success", { status: 403 });
        }

        const encodedUser = Buffer.from(JSON.stringify(decrypted)).toString("base64");
        request.headers.set("user", encodedUser);

        return NextResponse.next({ request });
    } catch (error) {
        return new NextResponse(error instanceof Error ? error.message : "Middleware failed due to unknown error", {status: 500})
    }
}