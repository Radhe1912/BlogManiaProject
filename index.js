require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user_router');
const blogRoutes = require('./routes/blog_routes');

const Blog = require('./models/blog');

const { checkForAuthenticationCookie } = require('./middlewares/authentication');

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));  // check if token available
app.use(express.static(path.resolve('./public')));    // make every data static in public as image can be rendered on the webpage
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
        .then(()=>{console.log("MongoDB connected")});

const PORT = process.env.PORT || 8000;

app.get("/", async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);

app.listen(PORT, ()=>{
    console.log(`Server started on PORT: ${PORT}`);
});