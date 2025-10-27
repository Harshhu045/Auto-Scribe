import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import Blog from "../models/blog";
import Comment from "../models/comment";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = Jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "1d", // Optional: token expires in 1 day
    });

    res.status(200).json({ success: true, token });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllBlogsAdmin = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 })
    res.status(200).json({ success: true, blogs });
  }
  catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 })
    res.status(200).json({ success: true, comments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false })

    const dashboardData = {
      blogs, comments, drafts, recentBlogs
    }
    res.json({ success: true, dashboardData })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const approveCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.status(200).json({ success: true, message: "Comment approved successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}
