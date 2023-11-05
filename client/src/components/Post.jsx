import { PaperAirplaneIcon as SendIcon } from "@heroicons/react/20/solid";
import {
  EllipsisHorizontalIcon as EllipsisVIcon,
  ChatBubbleOvalLeftIcon as CommentIcon,
  HeartIcon,
  AdjustmentsVerticalIcon as AdjustIcon,
  UserMinusIcon,
  FaceFrownIcon,
  ClipboardDocumentIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SHeartIcon } from "@heroicons/react/20/solid";
import { Loading, useLoading } from "./Loading.jsx";
import { useState, useEffect, useRef } from "react";
import { Cookie } from "../utils/cookie.js";
import { axios } from "../utils/axios.js";
import { sortAndFormatDate } from "../utils/formatDate.js";
import { useNavigate } from "react-router-dom";
import Verify from "./Verify";
export const css = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  /* Semi-transparent black background */
  zIndex: 101,
  /* Ensure the overlay is on top of everything */
  touchEvents: "auto",
  pointerEvents: "auto" /* Enable pointer events to block interaction */,
};
export function Overlay({ action }) {
  return (
    <div
      onClick={() => {
        history.back();
        action();
      }}
      style={css}
    ></div>
  );
}
const items = [
  {
    text: "Not interested in this post",
    icon: FaceFrownIcon,
  },
  {
    text: "Unfollow @ronnie",
    icon: UserMinusIcon,
  },
  {
    text: "Copy post",
    icon: ClipboardDocumentIcon,
  },
  {
    text: "Report Post",
    icon: FlagIcon,
  },
];
const CLOSE = (action) => {
  action();
};

function PostModal({ action }) {
  return (
    <>
      <Overlay action={CLOSE.bind({}, action)} />
      <div className="bg-gray-800 fixed bottom-0 left-0 w-full z-[999] rounded-tr-lg rounded-tl-lg px-2 py-4">
        {items.map((item, id) => (
          <div
            key={id}
            className="h-6 py-6 px-2 rounded-lg flex items-center hover:bg-gray-700"
          >
            <item.icon className="h-6 w-6 text-white mr-2" />
            <h4 className="text-white text-lg font-md">{item.text}</h4>
          </div>
        ))}
        <div className="">
          <button
            onClick={CLOSE.bind({}, action)}
            className="w-full border-[1px] border-solid border-gray-700 text-white h-10 mt-10 rounded-lg hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>{" "}
    </>
  );
}

function Comment({ name, username, content, avatar, verified, createdAt }) {
  return (
    <>
      <div className="border-solid py-2 border-b-[1px] border-gray-700">
        <div className="flex items-center">
          <img src={avatar} className="w-10 h-10 rounded-full" />
          <div className="join join-vertical ml-2">
            <h4 className="join-item text-sm text-gray-300 mr-2">
              {name} <Verify verified={verified} />
            </h4>
            <h5 className="join-item text-sm text-gray-400">
              @{username} • {sortAndFormatDate(createdAt)}
            </h5>
          </div>
        </div>
        <div className="mt-2">
          <h4 className="text-gray-300 text-md">{content}</h4>
        </div>
      </div>
    </>
  );
}

function PostComments({ action, postId }) {
  const [comment, setComment] = useState("");
  const [comments, setCommentData] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim().length > 1) {
      axios
        .post(`/post/comment/${postId}`, {
          content: comment,
        })
        .then(({ data }) => {
          setCommentData((curr) => [...curr, data]);
        });
      setComment("");
    }
  };
  const handleChange = (e) => {
    setComment(e.target.value);
  };
  useEffect(function () {
    axios
      .get("/post/comments", {
        params: {
          postId,
        },
      })
      .then(({ data }) => {
        setCommentData(data);
      });
  }, []);
  return (
    <>
      <Overlay action={CLOSE.bind({}, action)} />
      <div className="bg-gray-800 max-h-[90%] fixed overflow-auto bottom-0 left-0 w-full z-[999] rounded-tr-lg rounded-tl-lg px-2">
        <div className="sticky h-[15%] top-0 bg-gray-800 w-full pt-4">
          <div className="flex justify-center w-full">
            <button className="h-2 w-14 bg-gray-600 rounded-full"></button>
          </div>
          <h4 className="text-gray-200 text-lg font-medium text-center mb-2 border-solid py-2 border-b-[1px] border-gray-700">
            Comments
          </h4>
        </div>
        <div className="overflow-scroll h-full pb-4">
          {comments ? (
            comments.map(({ content, user, createdAt }) => (
              <Comment
                key={Math.random()}
                name={user.fullname}
                username={user.username}
                content={content}
                avatar={user.avatar}
                verified={user.verified}
                createdAt={createdAt}
              />
            ))
          ) : (
            <Loading
              svg={{ className: "h-10 w-10" }}
              div={"h-[100%] flex justify-center items-center"}
            />
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="sticky flex w-full bottom-0 px-2 bg-gray-800 w-full pb-2 flex justify-between border-solid border-t-[1px] pt-2 border-gray-700"
        >
          <textarea
            placeholder="Type Something?"
            className="rounded-md text-sm text-white outline-none mr-2 p-2 w-full h-10 bg-gray-600"
            onChange={handleChange}
            value={comment}
          />
          <button type="submit" className=" h-10 w-[2rem] rounded-md">
            <SendIcon className="text-white" />
          </button>
        </form>
      </div>
    </>
  );
}
export default function Post({
  name,
  username,
  content,
  avatar,
  likes,
  comments,
  seen,
  url,
  postId,
  posterId,
  verified,
  createdAt,
}) {
  const [opened, setOpened] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const [_likes, setLikes] = useState(0);
  const [likesArr, setLikesArr] = useState(null);
  const elem = useRef(null);
  const seenRef = useRef(null);
  const navigate = useNavigate();
  const action = () => {
    setOpened(false);
  };
  const openModal = () => {
    setOpened(true);
  };
  const commentAction = () => {
    setEnlarged(false);
  };
  const push = () => {
    window.history.pushState(null, document.title, window.location.href);
  };
  const remove = () => {
    //  history.back()
    setEnlarged(false);
    setOpened(false);
  };
  useEffect(() => {
    if (opened || enlarged) {
      document.body.style.overflow = "hidden";
      push();
      window.addEventListener("popstate", remove);
    } else {
      document.body.style.overflow = "scroll";
      remove();
      window.removeEventListener("popstate", remove);
    }
  }, [opened, enlarged]);
  useEffect(function () {
    setLikesArr(likes);
    setLikes(likes.length);
    const observer = new IntersectionObserver(
      ([entry, elem]) => {
        let seenInterval;
        if (entry.isIntersecting) {
          seenInterval = setTimeout(handleSeen, 2000);
        } else {
          if (seenInterval) clearTimeout(seenInterval);
        }
      },
      {
        rootMargin: "-100px",
      },
    );
    observer.observe(seenRef.current);
    return () => observer.disconnect();
  }, []);
  const handleLikeChange = () => {
    const c_user = Cookie.get("c_user");
    if (likesArr.find((user) => c_user == user)) {
      setLikesArr((curr) =>
        curr.splice(
          likesArr.findIndex((e) => e == c_user),
          1,
        ),
      );
      setLikes((curr) => --curr);
    } else {
      setLikesArr((curr) => [...curr, c_user]);
      setLikes((curr) => ++curr);
    }
    axios.post(`/post/like/${postId}`);
  };

  function handleSeen() {
    axios.post(`/post/seen/${postId}`);
  }
  return (
    <>
      <div className="flex px-2 py-2 border-b-[1px] border-t-[1px] border-solid border-gray-700">
        <img className="h-12 w-12 rounded-full mr-2" src={avatar} alt="" />
        <div className="w-full">
          <div className="w-full flex justify-between">
            <div
              className="join join-vertical"
              onClick={posterId && navigate.bind(null, `/profile/${posterId}`)}
            >
              <span className="text-gray-400 font-bold text-sm join-item">
                {name} <Verify verified={verified} />
              </span>
              <span className="join-item text-sm text-gray-400">
                @{username} • {sortAndFormatDate(createdAt)}
              </span>
            </div>
            {/*<button className="text-gray-400" onClick={openModal}>
              <EllipsisVIcon className="h-8 w-8" />
            </button>*/}
          </div>
          <div className="mt-2">
            <p
              ref={seenRef}
              className="text-slate-300 text-sm"
              onClick={setEnlarged.bind({}, true)}
            >
              {content}
            </p>
            <div className="mt-2 ">
              {url && (
                <img src={url} className="h-72 w-auto rounded-xl" alt="" />
              )}
            </div>
            <div className="flex my-2 justify-between text-slate-400">
              <div className="inline-flex justify-center items-center">
                <button>
                  <CommentIcon className="h-4 w-4" />
                </button>
                <span className="text-xs" onClick={setEnlarged.bind({}, true)}>
                  {comments.length}
                </span>
              </div>
              <div className="inline-flex justify-center items-center">
                <button className="" onClick={handleLikeChange}>
                  {likesArr?.find((r) => r == Cookie.get("c_user")) ? (
                    <SHeartIcon className="h-4 w-4 text-pink-600" />
                  ) : (
                    <HeartIcon className="h-4 w-4" />
                  )}
                </button>
                <span className="text-xs">{_likes}</span>
              </div>
              <div className="inline-flex justify-center items-center">
                <button>
                  <AdjustIcon className="h-4 w-4" />
                </button>
                <span className="text-xs">{seen}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {opened && <PostModal action={action} />}
      {enlarged && <PostComments action={commentAction} postId={postId} />}
    </>
  );
}
