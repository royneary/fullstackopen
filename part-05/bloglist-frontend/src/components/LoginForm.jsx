const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <label>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => onUsernameChange(target.value)}
        />
      </label>
    </div>
    <div>
      <label>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => onPasswordChange(target.value)}
        />
      </label>
    </div>
    <button type="submit">login</button>
  </form>
);

export default LoginForm;
