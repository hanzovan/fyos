import { PostBody, PostResponse } from "@/types";
import { authAxios, authNodeAxios, axiosPublicNodeServer } from "../config";
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

const getAllNodePublicPosts = async() => {
    try {
        const result = await axiosPublicNodeServer.get("/posts?type=public");
        return result.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred while trying postrequest.getPublicPost");
    }
}

const getSinglePublicPost = async(id: string) => {
    try {
        const result = await axiosPublicNodeServer.get(`/posts/${id}?type=public`);
        return result.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred while trying postrequest getSinglePublicPost");
    }
}

const updatePost = async(id: string, body: any, accessToken: string | undefined): Promise<PostResponse> => {
    if (!accessToken) {
        throw new Error("AccessToken not provided");
    }
    try {
        authAxios.accessToken = accessToken
        const result = await authAxios.put(`/posts/${id}`, body);
        return {
            isError: false,
            data: result.data,
            message: "Post updated successfully"
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

const PostRequest = { createNewPost, getAllNodeAPIPosts, getAllNodePublicPosts, getSinglePublicPost, updatePost };

export { PostRequest };