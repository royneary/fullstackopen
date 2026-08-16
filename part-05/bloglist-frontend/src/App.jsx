import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [notification, setNotification] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const createBlogFormRef = useRef();

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
  };

  const handleCreate = async (blog) => {
    try {
      createBlogFormRef.current.toggleVisibility();
      const createdBlog = await blogService.create(blog);
      setBlogs(blogs.concat(createdBlog));
      showInfo(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      );
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={createBlogFormRef}>
        <h2>create new</h2>
        <CreateBlogForm onCreate={handleCreate} />
      </Togglable>

      {blogs
        .sort((b1, b2) => b2.likes - b1.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} onLike={() => handleLike(blog)} />
        ))}
    </div>
  );
};

export default App;
