const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();

const Blog = require('../models/blog');
const Comment = require("../models/comment");

// when we insert image in form for the blog it goes like file_name and we want to show image so use multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    }
  })
  
const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    res.render("addBlogs",{
        user: req.user,
    })
});

router.get("/:id", async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    return res.render("view_blog",{
      user: req.user,               // add this we are rendering image and other things also on /view_blog
      blog,
      comments
    })
});

router.post("/comment/:blogId", async (req,res)=>{
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/", upload.single("coverImage"), async (req,res)=>{
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;