import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        comment: { type: String, required: true },
        userId: { type: Schema.ObjectId, ref: "profiles" },
        postId: { type: Schema.ObjectId, ref: "post" },
    },
    { timestamps: true }
)

export default model("comments", commentSchema)