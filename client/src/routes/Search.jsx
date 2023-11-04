import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axios } from "../utils/axios.js";
import Header from "../components/Header";
import Post from "../components/Post";
import Verify from "../components/Verify";
export default function Search() {
  const location = useLocation();
  const [query, setQuery] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search);
    setQuery({
      value: searchParam.get("value"),
      tab: searchParam.get("tab"),
    });
  }, []);
  useEffect(() => {
    axios.get("/search", { params: query }).then(({ data }) => {
      if (query.tab == "profile") {
        setProfile(data);
      } else {
        setPosts(data.posts);
      }
    });
  }, [query]);
  const postProps = (curr) => ({
    name: curr.fullname,
    username: curr.username,
    verified: curr.verified,
    content: curr.content,
    likes: curr.likes,
    comments: curr.comments,
    seen: curr.seen,
    avatar: curr.avatar,
    url: curr.url,
    postId: curr.postId,
  });
  const Profile = ({ userId, name, avatar, username, verified }) => {
    return (
      <>
        <div className="flex px-2 py-2 border-b-[1px] border-t-[1px] border-solid border-gray-700">
          <img className="h-12 w-12 rounded-full mr-2" src={avatar} alt="" />
          <div className="w-full">
            <div className="w-full flex justify-between">
              <div
                className="join join-vertical"
                onClick={userId && navigate.bind(null, `/profile/${userId}`)}
              >
                <span className="text-gray-400 font-bold text-sm join-item">
                  {name} <Verify verified={verified} />
                </span>
                <span className="join-item text-sm text-gray-400">
                  @{username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  const Content = () => {
    return (
      <>
        {query.tab == "profile"
          ? profile &&
            profile.map((curr) => (
              <Profile
                username={curr.username}
                avatar={curr.avatar}
                name={curr.fullname}
                userId={curr.id}
                key={curr.id}
                verified={curr.verified}
              />
            ))
          : posts &&
            posts.map((curr) => (
              <Post {...postProps(curr)} key={Math.random()} />
            ))}
      </>
    );
  };
  return (
    <>
      <header className="mx-2">
        <Header value={query.value} />
        <div className="flex justify-between w-full mt-2 pb-1 border-b-solid border-b-[1px] border-b-gray-700">
          <div
            className="w-full"
            onClick={() => {
              setQuery({ ...query, tab: "post" });
              navigate(
                "/search?" +
                  new URLSearchParams({ ...query, tab: "post" }).toString(),
              );
            }}
          >
            <h3 className="text-white text-center text-sm w-full">Post</h3>
            {query.tab?.toLowerCase() === "post" && (
              <div className="w-full rounded-lg bg-[#008fff] h-1"></div>
            )}
          </div>
          <div
            className="w-full ml-2"
            onClick={() => {
              setQuery({ ...query, tab: "profile" });
              navigate(
                "/search?" +
                  new URLSearchParams({ ...query, tab: "profile" }).toString(),
              );
            }}
          >
            <h3 className="text-white text-center text-sm">Profile</h3>
            {query.tab?.toLowerCase() === "profile" && (
              <div className="w-full rounded-lg bg-[#008fff] h-1"></div>
            )}
          </div>
        </div>
      </header>
      <section>{posts ? <Content /> : profile && <Content />}</section>
    </>
  );
}
