import { useState } from "react";

const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false);

  const buttonLabel = visible ? "hide" : "view";

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      {visible ? (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={() => onLike()}>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
