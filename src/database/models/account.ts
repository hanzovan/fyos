import mongoose from "mongoose";

const { Schema } = mongoose;

const AccountSchema = new Schema({
    id: { type: Schema.ObjectId },
    provider: { type: String, default: "nextApp" },
    type: { type: String, default: "credentials" },
    providerAccountId: { type: String, default: "N/A" },
    access_token: { type: String, default: "ekjadjflfcxvz" },
    scope: { type: String, default: "all" },
    userId: { type: Schema.ObjectId, ref: "User" }
})

const AccountModel = mongoose.models.Account || mongoose.model("Account", AccountSchema);

export { AccountModel };