import { PostBody, PostResponse } from "@/types";
import { authAxios, authNodeAxios } from "../config";
import { getErrorMessage } from "../utils";

const createNewPost = async (body: PostBody, accessToken: string | undefined): Promise<PostResponse> => {
    if (!accessToken) {
        throw new Error("Access token not provided");
    }
    try {
        authAxios.accessToken = accessToken
        const result = await authAxios.post("/posts", body)
        return {
            isError: false,
            data: result.data,
            message: "Post created successfully"
        }
    } catch (error) {
        return {
            isError: true,
            data: null,
            message: getErrorMessage(error)
                ? getErrorMessage(error)
                : "An unknown error occurred"
        }
    }
}

const getAllNodeAPIPosts = async (accessToken: string | undefined) => {
    if (!accessToken) {
        throw new Error("Access token not provided");
    }
    try {
        authNodeAxios.accessToken = accessToken;

        const result = await authNodeAxios.get("/posts")
        return result.data;
    } catch (error) {
        throw new Error (error instanceof Error ? error.message : "An unknown error occurred")
    }
}

const PostRequest = { createNewPost, getAllNodeAPIPosts };

export { PostRequest };