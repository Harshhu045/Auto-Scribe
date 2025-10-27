import express from "express"
import { addBlog, addComent, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from "../controllers/blogController"
import upload from "../middleware/multer";
import auth from "../middleware/auth";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth,  addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/add-comment', addComent);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', auth, generateContent);


export default blogRouter;