import mongoose from "mongoose"

const { Schema, model } = mongoose

const postSchema = new Schema(
    {
        text: { type: String, required: true },
        user: { type: Schema.ObjectId, ref: "profiles" },
        image: { type: String, default: 'https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' },
        likes: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
)

export default model("post", postSchema)