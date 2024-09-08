import { PostBody, PostResponse } from "@/types";
import { authAxios, authNodeAxios, axiosPublic, axiosPublicNodeServer } from "../config";
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

// get posts from 1st server, not the node server
const getPublicPosts = async() => {
    try {
        const result = await axiosPublic.get("/posts?type=public")
        return result.data
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while trying lib.getPublicPosts');
    }
}

const getSinglePublicPost = async(slug: string) => {
    try {
        const result = await axiosPublicNodeServer.get(`/posts/${slug}?type=public`);
        return result.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred while trying postrequest getSinglePublicPost");
    }
}

// get single post from local server
const getSinglePost = async(slug: string) => {
    try {
        const result = await axiosPublic.get(`/posts/${slug}?type=public`);
        
        return result.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

const updatePost = async(slug: string, body: any, accessToken: string | undefined): Promise<PostResponse> => {
    if (!accessToken) {
        throw new Error("AccessToken not provided");
    }
    try {
        authAxios.accessToken = accessToken
        const result = await authAxios.put(`/posts/${slug}`, body);
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

const deletePost = async(slug: string, accessToken: string | undefined): Promise<PostResponse> => {
    if (!accessToken) {
        throw new Error("AccessToken not provided");
    }
    try {
        authAxios.accessToken = accessToken
        const result = await authAxios.delete(`/posts/${slug}`);
        return {
            isError: false,
            data: result.data,
            message: "Post deleted successfully"
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

const PostRequest = { createNewPost, getAllNodeAPIPosts, getAllNodePublicPosts, getSinglePublicPost, updatePost, deletePost, getPublicPosts, getSinglePost };

export { PostRequest };