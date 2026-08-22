import { useContext } from "react";
import AnecdoteContext from "../AnecdoteContext";

const useNotify = () => useContext(AnecdoteContext);

export default useNotify;
