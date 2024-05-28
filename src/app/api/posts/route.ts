import { PostZodSchema } from "@/database/schema";
import { PostService } from "@/lib/services";
import { checkUserRole } from "@/lib/utils";
import { validateZodInput } from "@/lib/validators";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const requestHeaders = new Headers(req.headers);
    const userHeader = requestHeaders.get("user");

    // Decode user info from the header (encoded in middleware)
    const user = userHeader ? JSON.parse(Buffer.from(userHeader, "base64").toString()) : null;

    if (!user || (!checkUserRole(user?.role).isUserRole && !checkUserRole(user?.role).isAdminRole)) {
        return Response.json("You are not authorized to access this resource", { status: 403 });
    }

    const parsedResult = validateZodInput(body, PostZodSchema);
    if (parsedResult.isError) {
        return Response.json(parsedResult.message, { status: 400 });
    }

    // after checking, create new post
    const result = await PostService.createNewPost({
        ...parsedResult.data,
        user: user?.id
    });

    if (result.isError) {
        return Response.json(result.message, { status: 400 })
    }
    return Response.json(result.data);
}