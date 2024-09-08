import { PostModel, UserModel } from "@/database/models";
import { PostBody, PostResponse } from "@/types";
import { nanoid } from "nanoid";
import slugify from "slugify";

// Function to generate a unique slug
const generateUniqueSlug = async (title: string): Promise<string> => {
  let original_slug = slugify(title, { replacement: "-", lower: true });
  let slug = original_slug;
  let existingPost = await PostModel.findOne({ slug });
  let counter = 2; // if there the same slug, the next slug should start from 2

  // while post with same slug exist, doing this
  while (existingPost) {
    slug = `${original_slug}-${counter}`;
    existingPost = await PostModel.findOne({ slug });
    counter++;
  }

  return slug;
};

const createNewPost = async (body: PostBody): Promise<PostResponse> => {
  try {
    const slug = await generateUniqueSlug(body.title);
    const result = await PostModel.create({ ...body, slug });
    return {
      isError: false,
      data: result,
      message: "Created new post successfully",
    };
  } catch (error: any) {
    return {
      isError: true,
      data: null,
      message: error.message,
    };
  }
};

const updatePost = async (
  slug: string,
  body: PostBody
): Promise<PostResponse> => {
  try {
    const post = await PostModel.findOne({ slug });

    if (!post) {
      return {
        isError: true,
        data: null,
        message: "Post not found",
      };
    }
    post.title = body.title || post.title;
    post.description = body.description || post.description;
    post.content = body.content || post.content;
    post.photo = body.photo || post.photo;

    // update slug if title changed
    if (body.title) {
      post.slug = await generateUniqueSlug(body.title);
    }

    const updatedPost = await post.save();

    return {
      isError: false,
      data: updatedPost,
      message: "Post updated successfully",
    };
  } catch (error: any) {
    return {
      isError: true,
      data: null,
      message: error.message,
    };
  }
};

const deletePost = async (slug: string): Promise<PostResponse> => {
  try {
    const post = await PostModel.findOne({ slug });
    if (!post) {
      return {
        isError: true,
        data: null,
        message: "Post not found",
      };
    }
    await PostModel.deleteOne({ slug });

    return {
      isError: false,
      data: null,
      message: "Post deleted successfully",
    };
  } catch (error: any) {
    return {
      isError: true,
      data: null,
      message: error.message,
    };
  }
};

const getPostBySlug = async (slug: string) => {
  try {
    const post = await PostModel.findOne({ slug })
      .populate({
        path: "user",
        select: ["name", "email", "avatar", "_id"],
        model: UserModel,
      })
      .lean()
      .exec();

    if (!post) {
      return {
        isError: true,
        data: null,
        message: "Post not found",
        status: 404,
      };
    }

    let user;

    if (post.user && post.user._id) {
        user = {
            ...post.user,
            id: post.user._id.toString()
        };
    } else {
        user = "author not found";
    }
    
    const data = {
        ...post,
        id: post._id?.toString(),
        user: { ...post.user, id: post?.user?._id?.toString() }
    }

    return {
      isError: false,
      data,
      message: "Success",
      status: 200,
    };
  } catch (error) {
    return {
      isError: true,
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    };
  }
};

const getAllPosts = async () => {
  try {
    const result = await PostModel.find({}).populate({ path: "user", select: ["name", "email", "avatar", "_id"]}).lean().exec();
    const data = result?.map(post => ({
      ...post,
      id: post._id?.toString(),
      user: {...post.user, id: post?.user?._id?.toString()}
    }));
    return { isError: false, data, message: "Get all posts successfully"}
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
  }
} 

const PostService = { createNewPost, updatePost, getPostBySlug, deletePost, getAllPosts };

export { PostService };
