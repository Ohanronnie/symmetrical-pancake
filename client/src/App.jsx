import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./routes/Home";
import Register from "./routes/Register";
import Login from "./routes/Login";
import NotFound from "./components/404";
import Profile from "./routes/Profile";
import Compose from "./routes/Compose";
import EditProfile from "./routes/EditProfile";
import Search from "./routes/Search";
import Post from "./routes/Post";
import Notification from "./routes/Notification";
import { Loading, useLoading } from "./components/Loading";
import { axios } from "./utils/axios.js";
import { useState, useEffect } from "react";
document.body.style.backgroundColor = "rgb(17, 24, 39)";
document.body.style.height = "100%";
document.querySelector("html").style.height = "100%";
function ProtectedRoute() {
  const [loading, setLoading] = useLoading(true);
  const [valid, setValid] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (!window.spa || !window.app_associate || window.req_id) {
      (async function () {
        const token = await axios.get("/token/get");
        window.spa = token.data.spa;
        window.app_associate = token.data.app_associate;
        window.req_id = token.data.req_id;
        setTimeout(apiCall, 10);
      })();
    } else {
      apiCall();
    }
  }, []);
  function apiCall() {
    axios
      .post("/auth", {
        spa: window.spa,
        app_associate: window.app_associate,
        req_id: window.req_id,
      })
      .then((e) => {
        setValid(true);
        setLoading(false);
        setDone(true);
      })
      .catch((e) => {
        setValid(false);
        setLoading(false);
        setDone(true);
      });
  }

  if (loading)
    return (
      <Loading
        svg={{ className: "h-10 w-10" }}
        div={"h-[100vh] flex justify-center items-center"}
      />
    );
  if (done) {
    if (loading)
      return (
        <Loading
          svg={{ className: "h-10 w-10" }}
          div={"h-[100vh] flex justify-center items-center"}
        />
      );
    else if (!loading && valid) return <Outlet />;
    else if (!loading && !valid)
      return <Navigate to={"/register/login"} replace />;
  }
}
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="" element={<Navigate to="/home" replace />} />
          </Route>
          <Route path="/home" element={<ProtectedRoute />}>
            <Route path="" element={<Home />} />
          </Route>
          <Route path="/register">
            <Route path="signup" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/profile/:id" element={<ProtectedRoute />}>
            <Route path="" element={<Profile />} />
          </Route>
          <Route path="/compose" element={<ProtectedRoute />}>
            <Route path="" element={<Compose />} />
          </Route>
          <Route path="/edit/profile" element={<ProtectedRoute />}>
            <Route path="" element={<EditProfile />} />
          </Route>
          <Route path="/search" element={<ProtectedRoute />}>
            <Route path="" element={<Search />} />
          </Route>
          {/*          <Route path="/post/:id" element={<Post />} />*/}
          <Route path="/notifications" element={<ProtectedRoute />}>
            <Route path="" element={<Notification />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
