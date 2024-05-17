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

const PostService = { createNewPost };

export { PostService };