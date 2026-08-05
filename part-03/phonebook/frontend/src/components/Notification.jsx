const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return <div className={notification.className}>{notification.message}</div>;
};

export default Notification;
