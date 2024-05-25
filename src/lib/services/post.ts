import { PostModel } from "@/database/models";
import { PostBody, PostResponse } from "@/types";
import { nanoid } from "nanoid";
import slugify from "slugify";

const createNewPost = async (body: PostBody): Promise<PostResponse> => {
    try {
        const title = `${body.title}-${nanoid(5)}`;
        const slug = slugify(title, { replacement: "-" });
        const result = await PostModel.create({ ...body, slug });
        return {
            isError: false,
            data: result,
            message: "Created new post successfully"
        }
    } catch (error: any) {
        return {
            isError: true,
            data: null,
            message: error.message
        }
    }
}

const updatePost = async (id: string, body: PostBody): Promise<PostResponse> => {
    try {
        const post = await PostModel.findById(id);

        if (!post) {
            return {
                isError: true,
                data: null,
                message: "Post not found"
            }
        }
        post.title = body.title || post.title;
        post.description = body.description || post.description;
        post.content = body.content || post.content;
        post.photo = body.photo || post.photo;

        // update slug if title changed
        if (body.title) {
            const title = `${body.title}-${nanoid(5)}`;
            post.slug = slugify(title, { replacement: "-" });
        }

        const updatedPost = await post.save();

        return {
            isError: false,
            data: updatedPost,
            message: "Post updated successfully"
        }
        
    } catch (error: any) {
        return {
            isError: true,
            data: null,
            message: error.message
        }
    }
}

const PostService = { createNewPost, updatePost };

export { PostService };