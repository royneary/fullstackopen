const Notification = ({ notification }) =>
  notification ? (
    <div className={notification.className}>{notification.message}</div>
  ) : null;

export default Notification;
