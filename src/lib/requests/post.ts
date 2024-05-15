import { authNodeAxios } from "../config";

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

const PostRequest = { getAllNodeAPIPosts };

export { PostRequest };