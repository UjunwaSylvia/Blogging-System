import mongoose from "mongoose";
import CustomError from "../errors/custom.error.js";
import Blog from "../models/blog.model.js";
import { User } from "../models/user.model.js";

class BlogService {
  createBlogPost = async(title, content, author, author_email) => {
    try {
      const newPost = await Blog.create({title, content, author, author_email});
      return newPost;
    } catch (error) {
      if(error.name ==='Validation Error') {
        throw new CustomError('Validation Error', 400);
      }
      throw new CustomError(`Failed To Create Blog Post ${error.message}`, 500)
    }
    //Logic To Get A Blog Post
  }

  getBlogPost = async(id) => {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError('Invalid Blog Post ID', 400);
      }
      const blogPost = await Blog.findById(id).populate('author', 'username email');

      if(!blogPost) {
        throw new CustomError('Blog Post Not Found', 404);
      }
      return blogPost;
    } catch (error) {
      throw new CustomError(`Failed To Get Blog Post ${error.message}`, 500);
    }
    //Logic To Get A single Blog Post
  }

  getAuthorBlogPost = async(authorId) => {
    try {
      if(!mongoose.Types.ObjectId.isValid(authorId)) {
        throw new CustomError('Invalid Author ID', 400);
      }
      const authorBlogPost = await Blog.find({author: authorId}).populate('author', 'username email');

      if(!authorBlogPost || authorBlogPost.length === 0) {
        throw new CustomError('No Blog Posts Found For This Author', 404);
      }
      return authorBlogPost;

    } catch (error) {
      throw new CustomError(`Failed To Get Author Blog Posts ${error.message}`, 500)
    }
    //Logic To Get All Post By A Specific User
  }

  updateBlogPost = async(blogId, userId, data) => {
    try {
      const blog = await Blog.findById(blogId);

      if(!blog) {
        throw new CustomError('Blog Post Found', 404);
      }

      if (blog.author.toString() !== userId.toString()) {
        throw new CustomError('Blog Post Not Found or You are Not Authorized To Update This Blog Post', 403);
      }

      const updatedPost = await Blog.findByIdAndUpdate(blogId, data, {new: true});

      if(!updatedPost) {
        throw new CustomError('Blog Post Not Found Or You Are Not Authorized To Update This Blog Post', 404);
      }

      return updatedPost;
    } catch (error) {
      throw new CustomError(`Failed To Update Blog Post ${error.message}`, 500);
    }
    //Logic To Update A Blog Post
  }

  deleteBlogPost = async(blogId, userId) => {
      try {
        if(!mongoose.Types.ObjectId.isValid(blogId)){
          throw new CustomError('Invalid Blog Post ID', 400)
          }
        const blog = await Blog.findById(blogId);

        if(!blog){
          throw new CustomError("Blog Post Not Found", 404)
        }
        if (blog.author.toString()!== userId.toString()) {
          throw new CustomError('You Are Not Authorised To Delete This Blog Post',403)
        }
          
      } catch (error) { 
        throw new CustomError(`Failed To Update Blog post ${error.message}`, 500);
   }
    //Logic To Delete A Blog Post
  }

  getAllBlogPost = async() => {
    try {
      const blogPosts = await Blog.find().populate('author', 'username email');
      if(!blogPosts || blogPosts.length === 0) {
        throw new CustomError('No Blog Post Found', 404);
      }
      return blogPosts;
    } catch (error) {
      throw new CustomError(`Failed To Get All Blog Posts ${error.message}`, 500)
    }
    //Logic To Get All Post
  }
}

const blogService = new BlogService();

export default blogService;