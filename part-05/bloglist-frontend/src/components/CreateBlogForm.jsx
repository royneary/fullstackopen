const CreateBlogForm = ({
  title,
  author,
  url,
  onTitleChange,
  onAuthorChange,
  onUrlChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <label>
        title:
        <input
          type="text"
          value={title}
          onChange={({ target }) => onTitleChange(target.value)}
        />
      </label>
    </div>
    <div>
      <label>
        author:
        <input
          type="text"
          value={author}
          onChange={({ target }) => onAuthorChange(target.value)}
        />
      </label>
    </div>
    <div>
      <label>
        url:
        <input
          type="url"
          value={url}
          onChange={({ target }) => onUrlChange(target.value)}
        />
      </label>
    </div>
    <button type="submit">create</button>
  </form>
);

export default CreateBlogForm;
