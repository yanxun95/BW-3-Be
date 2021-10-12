import mongoose from "mongoose"

const { Schema, model } = mongoose

const postSchema = new Schema(
    {
        text: { type: String, required: true },
        username: { type: String, required: true },
        user: {
            name: { type: String, required: true },
            surname: { type: String, required: true },
            email: { type: String, required: true },
            bio: { type: String },
            title: { type: String, required: true },
            area: { type: String, required: true },
            image: { type: String, default: 'https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' },
            username: { type: String, required: true },
        },
    },
    {
        timestamps: true,
        image: { type: String, default: 'https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' }
    }
)

export default model("post", postSchema)