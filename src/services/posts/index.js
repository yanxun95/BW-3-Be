import express from "express"
import createHttpError from "http-errors"
import PostModel from "./schema.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

// - GET https://yourapi.herokuapp.com/api/posts/
// Retrieve posts
// - POST https://yourapi.herokuapp.com/api/posts/
// Creates a new post
// - GET https://yourapi.herokuapp.com/api/posts/{postId}
// Retrieves the specified post
// - PUT https://yourapi.herokuapp.com/api/posts/{postId}
// Edit a given post
// - DELETE https://yourapi.herokuapp.com/api/posts/{postId}
// Removes a post
// - POST https://yourapi.herokuapp.com/api/posts/{postId}
// Add an image to the post under the name of "post"

const postRoutes = express.Router()

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "postPicture",
    },
})

postRoutes.get("/", async (req, res, next) => {
    try {
        const posts = await PostModel.find()

        res.send(posts)
    } catch (error) {
        next(error)
    }
})
postRoutes.post("/", async (req, res, next) => {
    try {
        const newPost = new PostModel(req.body) // it will validate the req.body, if the response is not ok Mongoose will throw a ValidationError
        const { _id } = await newPost.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})
postRoutes.get("/:postId", async (req, res, next) => {
    try {
        const postId = req.params.postId

        const post = await PostModel.findById(postId)

        if (post) {
            res.send(post)
        } else {
            next(createHttpError(404, `Post with id ${postId} is not found`))
        }
    } catch (error) {
        next(error)
    }
})
postRoutes.put("/:postId", async (req, res, next) => {
    try {
        const postId = req.params.postId
        const modifiedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
            new: true
        })

        if (modifiedPost) {
            res.send(modifiedPost)
        } else {
            next(createHttpError(404), `Post with id ${postId} is not found`)
        }
    } catch (error) {
        next(error)
    }
})
postRoutes.delete("/:postId", async (req, res, next) => {
    try {
        const postId = req.params.postId

        const deletedPost = await PostModel.findByIdAndDelete(postId)

        if (deletedPost) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Post with id ${postId} is not found `))
        }
    } catch (error) {
        next(error)
    }
})
postRoutes.post("/:postId/picture", multer({ storage: cloudStorage }).single("post"), async (req, res, next) => {
    try {
        console.log(req.file)
        const postImage = await PostModel.findByIdAndUpdate(req.params.id, { $set: { image: req.file.path } }, { new: true })
        res.send(postImage)
    } catch (error) {
        next(error)
    }
})

export default postRoutes