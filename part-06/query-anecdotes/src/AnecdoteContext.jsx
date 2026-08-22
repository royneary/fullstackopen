import { createContext, useState } from "react";

const AnecdoteContext = createContext();

export default AnecdoteContext;

export const AnecdoteContextProvider = (props) => {
  const [notification, setNotification] = useState(null);

  const notify = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <AnecdoteContext.Provider value={{ notification, notify }}>
      {props.children}
    </AnecdoteContext.Provider>
  );
};
