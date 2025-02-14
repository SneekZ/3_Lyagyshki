import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MessageProvider } from "./components/Utils/MessageContext.jsx";
import Login from "./components/login/Login.jsx";
import Cookies from "js-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));

const checkUser = () => {
  console.log(Cookies.get("user"));
  return Cookies.get("user") == undefined;
};

root.render(
  <MessageProvider>
    {checkUser() && <Login />}
    <App />
  </MessageProvider>
);
