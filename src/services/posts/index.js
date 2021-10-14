import express from "express"
import createHttpError from "http-errors"
import PostModel from "./schema.js"
import CommentModel from "../comments/schema.js"
import LikeModel from "../likes/schema.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import mongoose from "mongoose"

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
        const posts = await PostModel.find().populate({ path: "user", select: '-experiences -__v' })
        // likes

        res.send(posts)
    } catch (error) {
        next(error)
    }
})

postRoutes.post("/:profileId", async (req, res, next) => {
    try {
        const newPost = new PostModel({ ...req.body, user: mongoose.Types.ObjectId(req.params.profileId) })
        const { _id } = await newPost.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

postRoutes.get("/:postId", async (req, res, next) => {
    try {
        const postId = req.params.postId

        const post = await PostModel.findById(postId).populate({ path: "user", select: '-experiences -__v' })

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
            next(createHttpError(404, `Post with id ${postId} is not found`))
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

postRoutes.post("/:postId/comment", async (req, res, next) => {
    try {
        const newComment = new CommentModel({ ...req.body, postId: mongoose.Types.ObjectId(req.params.postId) })
        const { _id } = await newComment.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

postRoutes.get("/:postId/comment", async (req, res, next) => {
    try {
        const post = await CommentModel.find({ postId: req.params.postId }).populate("userId")

        res.status(201).send(post)
    } catch (error) {
        next(error)
    }
})

postRoutes.delete("/comment/:commentId", async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const deletedComment = await CommentModel.findByIdAndDelete(commentId)

        if (deletedComment) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Comment with id ${commentId} is not found `))
        }
    } catch (error) {
        next(error)
    }
})

postRoutes.put("/comment/:commentId/:userId", async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const checkId = await CommentModel.findById(commentId)
        if (checkId.userId.toString() === req.params.userId) {
            const modifiedComment = await CommentModel.findByIdAndUpdate(commentId, req.body, {
                new: true
            })
            if (modifiedComment) {
                res.send(modifiedComment)
            } else {
                next(createHttpError(404, `Comment with id ${commentId} is not found`))
            }
        } else {
            next(createHttpError(404, `Only user who create the comment can edit the comment`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

postRoutes.post("/:postId/like", async (req, res, next) => {
    try {
        const postId = req.params.postId
        const userId = req.body.userId

        const hasLiked = await LikeModel.find({ postId: postId, userId: userId })
        if (hasLiked.length === 0) {
            const newLike = new LikeModel({ ...req.body, postId: mongoose.Types.ObjectId(req.params.postId) })
            newLike.save()
            await PostModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true })
        } else {
            await LikeModel.deleteOne({ postid: postId, userId: userId })
            await PostModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true })
        }

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})


export default postRoutes