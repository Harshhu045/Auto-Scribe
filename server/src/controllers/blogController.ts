import { Request, Response } from "express";
import imagekit from "../configs/imageKit";
import Blog from "../models/blog";
import Comment from "../models/comment";
import main from "../configs/gemini";

export const addBlog = async (req: Request, res: Response) => {
    try {
        const { title, subTitle, description, category, isPublished } = req.body;
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // ✅ If using multer.memoryStorage, just use buffer directly
        const fileBuffer = imageFile.buffer;

        // upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs",
        });

        // optimize the image with URL transformation
        const optimizedUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: "auto" },   // auto compress
                { format: "webp" },    // convert to modern format
                { width: "1280" },     // width resizing
            ],
        });

        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: optimizedUrl,
            isPublished,
        });

        res.status(201).json({ success: true, message: "Blog added successfully" });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ success: false, message });
    }
};


export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.status(200).json({ success: true, blogs })
    }
    catch (error: any) {
        res.status(500).json({ sucess: false, message: error.message })
    }
}

export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({
                success: false, message: "Blog not found"
            });
        }
        res.status(200).json({ success: true, blog })
    } catch (error: any) {
        res.status(400).json({ sucess: false, message: error.message })
    }
}


export const deleteBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);
        // Delete all comments also associated with blog
        await Comment.deleteMany({blog:id})
        res.status(201).json({ success: true, message: "Blog deleted Succesfully" })
    } catch (error: any) {
        res.status(400).json({ sucess: false, message: error.message })
    }
}

export const togglePublish = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({ success: true, message: "Blog status updated" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComent = async(req: Request, res: Response)=>{
    try {
        const {blog, name, content} = req.body
        await Comment.create({blog, name, content});
        res.status(200).json({success: true, message: 'comment added for review'})
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getBlogComments = async(req: Request, res: Response)=>{
    try {
        const {blogId} = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1})
        res.status(200).json({success: true, comments})
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// blogController.ts (AI route)

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const content = await main(prompt);

    res.json({ success: true, content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
