import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

const Blog = ({ blog, user, onLike, onDelete }) => {
  if (!blog) {
    return null;
  }

  const isCreator = user && user.username === blog.user.username;

  const likeButton = (
    <Button variant="outlined" onClick={() => onLike(blog)}>
      like
    </Button>
  );

  const deleteButton = (
    <Button variant="outlined" color="error" onClick={() => onDelete(blog)}>
      remove
    </Button>
  );

  const styles = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5em",
  };

  return (
    <Card>
      <CardContent sx={styles}>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          by {blog.author}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Added by {blog.author}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: "1em" }}>
        <Typography>{blog.likes} likes</Typography>
        {user ? likeButton : null}
        {isCreator ? deleteButton : null}
      </CardActions>
    </Card>
  );
};

export default Blog;
