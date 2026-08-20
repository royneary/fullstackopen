import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";
import BlogList from "./components/BlogList";

const App = () => {
  const [notification, setNotification] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("user");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, className) => {
    setNotification({ message, className });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  const showError = (message) => showNotification(message, "error");
  const showInfo = (message) => showNotification(message, "info");

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      blogService.setToken(user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch {
      showError("wrong username or password");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleCreate = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog);
      setBlogs(blogs.concat(createdBlog));
      showInfo(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      );
      navigate("/");
    } catch {
      showError("failed to create a new blog");
    }
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update({
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      });
      setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
    } catch {
      showError("failed to update blog");
    }
  };

  const handleDelete = async (blog) => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        return;
      }
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      showInfo(`blog ${blog.title} by ${blog.author} deleted`);
      navigate("/");
    } catch {
      showError("failed to delete blog");
    }
  };

  const padding = {
    padding: 5,
  };

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {user !== null ? (
          <Link style={padding} to="/create">
            new blog
          </Link>
        ) : null}
        {user === null ? (
          <Link style={padding} to="/login">
            login
          </Link>
        ) : (
          <button onClick={handleLogout}>logout</button>
        )}
      </div>
      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/create"
          element={<CreateBlogForm onCreate={handleCreate} />}
        />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route
          path={"/blogs/:id"}
          element={
            <Blog
              blog={blog}
              user={user}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
