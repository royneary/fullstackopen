import { Button, TextField } from "@mui/material";
import { useState } from "react";

const CreateBlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onCreate({ title, author, url });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6em",
    maxWidth: "500px",
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit} style={formStyles}>
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          variant="outlined"
        />
        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          variant="outlined"
        />
        <TextField
          label="url"
          value={url}
          type="url"
          onChange={({ target }) => setUrl(target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained">
          create
        </Button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
