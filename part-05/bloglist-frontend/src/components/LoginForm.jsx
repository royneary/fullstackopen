import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    onLogin({ username, password });

    setUsername("");
    setPassword("");

    navigate("/");
  };

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6em",
    maxWidth: "500px",
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit} style={formStyles}>
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          variant="standard"
        />
        <TextField
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
          variant="standard"
        />
        <Button type="submit" variant="contained">
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
