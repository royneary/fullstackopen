import { useState } from "react";

const Blog = ({ blog, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false);

  const buttonLabel = visible ? "hide" : "view";

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const removeButtonStyle = {
    backgroundColor: "#4286f6",
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
          {onDelete ? (
            <button style={removeButtonStyle} onClick={() => onDelete()}>
              remove
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
