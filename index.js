const express = require("express");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

app.set("view engine", "ejs");
app.use(methodOverride('_method')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
    {
        id: uuidv4(),
        username: "soham",
        title: "First Post",
        content: "This is the first post on my blog.",
        createdAt: new Date()
    },
    {
        id: uuidv4(),
        username: "jane",
        title: "Second Post",
        content: "This is the second post on my blog.",
        createdAt: new Date()
    },
    {
        id: uuidv4(),
        username: "john",
        title: "Third Post",
        content: "This is the third post on my blog.",
        createdAt: new Date()
    }
];

// Route to render the 'posts' EJS template
app.get("/", (req, res) => {
    res.render("posts", { posts });
});

// Route to render the 'new' EJS template for creating a new post
app.get("/posts/new", (req, res) => {
    res.render("new");
});

// Route to handle creating a new post
app.post("/posts", (req, res) => {
    const { title, username, content } = req.body;
    posts.push({ id: uuidv4(), title, username, content, createdAt: new Date() });
    res.redirect("/");
});

// Route to view a specific post
app.get("/posts/view/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render("view", { post });
});

// Route to render the 'edit' EJS template for editing a post
app.get("/posts/edit/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render("edit", { post });
});

// Route to handle updating a post
app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find the index of the post to update
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return res.status(404).send('Post not found');
    }

    // Update the post
    posts[postIndex] = { ...posts[postIndex], title, content, createdAt: new Date() };

    // Redirect to home page
    res.redirect('/');
});
app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;

    // Find the index of the post to delete
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return res.status(404).send('Post not found');
    }

    // Remove the post from the array
    posts.splice(postIndex, 1);

    // Redirect to home page
    res.redirect('/');
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
