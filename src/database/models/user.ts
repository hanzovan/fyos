import mongoose, { Model } from "mongoose";
import { IUser } from "@/types";

const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_URI ?? "MONGODB_URI not found");

mongoose.Promise = global.Promise;

const UserSchema = new Schema(
    {
        id: { type: Schema.ObjectId },
        name: String,
        email: String,
        password: String,
        role: String,
        avatar: {type: String, default: "/avatar3.png"},
        isVerifiedEmail: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export { UserModel };

