import { axios } from "../utils/axios.js";
import {
  ArrowLeftIcon,
  LinkIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Verify from "../components/Verify";
export default function Profile() {
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [page, setPage] = useState("post");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(function () {
    axios.get(`/profile/${id}`).then(({ data }) => {
      setPosts(data.posts);
      setPersonalInfo(data);
      setComments(data.comments);
    });
  }, []);
  const back = () => {
    navigate(-1);
  };

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
  function Follow() {
    axios.post("/follow/" + id);
    setPersonalInfo((all) => ({
      ...all,
      iFollow: !all.iFollow,
      followers: all.iFollow ? all.followers - 1 : all.followers + 1,
    }));
  }
  function Posts() {
    return posts.map((curr) => (
      <Post key={Math.random()} {...postProps(curr)} />
    ));
  }
  function Comments() {
    return comments.map((data) => {
      return (
        <div
          key={Math.random()}
          className="flex px-2 py-2 border-b-[1px] border-t-[1px] border-solid border-gray-700"
        >
          <img
            className="h-12 w-12 rounded-full mr-2"
            src={data.avatar}
            alt=""
          />
          <div className="w-full">
            <div className="w-full flex justify-between">
              <div className="join join-vertical">
                <span className="text-gray-400 font-bold text-sm join-item">
                  {data.fullname} <Verify verified={data.verified} />
                </span>
                <span className="join-item text-sm text-gray-400">
                  @{data.username}
                </span>
              </div>
              <button className="text-gray-400"></button>
            </div>
            <div className="mt-2">
              <p className="text-slate-300 text-sm">{data.content}</p>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <>
      {personalInfo ? (
        <>
          <nav className="flex py-1 sticky top-0 z-10 bg-gray-900 border-b-[1px] border-solid border-gray-700">
            <button onClick={back} className="text-white font-bold pl-2 pr-8">
              <ArrowLeftIcon className="h-4 w-10" />
            </button>
            <div className="join join-vertical">
              <h4 className="join-item  text-white font-bold text-md">
                {personalInfo.fullname}{" "}
                <Verify verified={personalInfo.verified} />
              </h4>
              <h5 className="join-item text-slate-500 text-md">
                {personalInfo.posts.length} posts
              </h5>
            </div>
          </nav>
          <section className="pb-6">
            <div className="h-36 bg-gray-500 w-full border-none">
              <div alt="" className="w-full h-36 border-none"></div>
            </div>
            <div className="mx-2">
              <div className="flex justify-between">
                <img
                  src={personalInfo.avatar}
                  alt=""
                  className="h-20 w-20 rounded-full border-2 border-solid border-gray-900 -mt-10 "
                />
                {personalInfo.can_edit ? (
                  <button className="text-white text-sm border-[1.5px] border-solid rounded-2xl font-medium px-6 mt-4 h-8 border-gray-700">
                    <Link to="/edit/profile">Edit Profile</Link>
                  </button>
                ) : !personalInfo.iFollow ? (
                  <button
                    onClick={Follow}
                    className="text-white text-sm border-[1.5px] bg-[#008fff] border-solid rounded-2xl font-medium px-6 mt-4 h-8 border-gray-700"
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    onClick={Follow}
                    className="text-white text-sm border-[1.5px] border-solid rounded-2xl font-medium px-6 mt-4 h-8 border-gray-700"
                  >
                    Unfollow
                  </button>
                )}
              </div>
              <div className="join join-vertical ml-2">
                <h4 className="join-item text-white font-bold text-sm">
                  {personalInfo.fullname}{" "}
                  <Verify verified={personalInfo.verified} />
                </h4>
                <h5 className="join-item text-sm text-slate-500">
                  @{personalInfo.username}
                </h5>
              </div>
              {personalInfo.bio && (
                <div className="font-normal text-sm mt-4 ml-2 text-lg text-white">
                  <h5>{personalInfo.bio}</h5>
                </div>
              )}
              <div className="ml-2 mt-2">
                {personalInfo.url && (
                  <a
                    href={personalInfo.url}
                    className="text-blue-700 flex items-center"
                  >
                    <LinkIcon className="text-gray-700 text-sm h-4 w-4 mr-1" />{" "}
                    {personalInfo.url}
                  </a>
                )}
                <h5 className="text-gray-700 text-sm flex items-center">
                  <CalendarDaysIcon className="text-gray-600 h-4 w-4 mr-1" />{" "}
                  {new Date(personalInfo.createdAt).toLocaleDateString(
                    "en-GB",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                </h5>
              </div>
              <div className="flex mt-2 ml-2">
                <h5 className="text-sm font-normal text-gray-600">
                  <span className="text-white mr-1">
                    {personalInfo.following}
                  </span>
                  Following
                </h5>
                <h5 className="text-sm font-normal text-gray-600 ml-6">
                  <span className="text-white mr-1">
                    {personalInfo.followers}
                  </span>
                  Followers
                </h5>
              </div>
              {/*              <div className="w-full mt-6 font-medium text-gray-500 flex justify-between text-md ml-2 px-4">
              
                <span
                  onClick={() => setPage("post")}
                  className={
                    page === "post" &&
                    `text-white border-b-2 border-solid border-[#008fff]`
                  }
                >
                  Posts
                </span>
                <span
                  onClick={() => setPage("comment")}
                  className={
                    page === "comment" &&
                    `text-white border-b-2 border-solid border-[#008fff]`
                  }
                >
                  Comments
                </span>
                {/*               <span onClick={() => setPage("likes")} className="">
                  Likes
                </span>
              </div>*/}
              <div className="flex justify-between w-full mt-6 pb-1 border-b-solid border-b-[1px] border-b-gray-700">
                <div className="w-full" onClick={() => setPage("post")}>
                  <h3 className="text-white text-center text-sm w-full">
                    Post
                  </h3>
                  {page === "post" && (
                    <div className="w-full rounded-lg bg-[#008fff] h-1"></div>
                  )}
                </div>
                <div className="w-full ml-2" onClick={() => setPage("comment")}>
                  <h3 className="text-white text-center text-sm">Comment</h3>
                  {page === "comment" && (
                    <div className="w-full rounded-lg bg-[#008fff] h-1"></div>
                  )}
                </div>
              </div>
              <div className="mb-4 pb-8">
                {page === "comment" ? <Comments /> : page === "post" && Posts()}
              </div>
            </div>
          </section>
        </>
      ) : (
        <Loading
          svg={{ className: "h-10 w-10" }}
          div={"h-[100vh] flex justify-center items-center"}
        />
      )}
      <Footer />
    </>
  );
}
