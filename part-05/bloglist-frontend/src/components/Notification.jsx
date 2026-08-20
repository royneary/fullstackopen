import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const alertStyles = {
    marginTop: 10,
    marginBottom: 10,
  };

  return (
    <Alert style={alertStyles} severity={notification.severity}>
      {notification.message}
    </Alert>
  );
};

export default Notification;
