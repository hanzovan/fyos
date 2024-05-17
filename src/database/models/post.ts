import { IPost } from "@/types";
import mongoose, { Model } from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    id: { type: Schema.ObjectId },
    title: String,
    slug: String,
    description: String,
    content: String,
    photo: String,
    user: { type: Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PostModel: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export { PostModel };
