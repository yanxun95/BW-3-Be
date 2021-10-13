import mongoose from "mongoose";

const { Schema, model } = mongoose;

const likeschema = new Schema(
    {
        userId: { type: Schema.ObjectId, ref: "profiles" },
        postId: { type: Schema.ObjectId, ref: "post" }
    },
    { timestamps: true }
)

export default model("likes", likeschema)