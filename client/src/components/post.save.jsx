import avatar from "../assets/images/avatar.jpg";
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
import PostModal from "./PostModal";
import { useState, useEffect } from "react";
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
export function Overlay() {
  return <div style={css}></div>;
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

export default function Post({ name, username, content }) {
  const [opened, setOpened] = useState(false);
  const action = () => {
    setOpened(false);
  };
  const openModal = () => {
    setOpened(true);
  };
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
      document.body.style.position = "static";
    }
  }, [opened]);
  const CLOSE = () => {
    action();
  };
  return (
    <>
      <div className="flex px-2 py-2 border-b-[1px] border-t-[1px] border-solid border-gray-700">
        <img className="h-12 w-12 rounded-full mr-2" src={avatar} alt="" />
        <div className="w-full">
          <div className="w-full flex justify-between">
            <div className="join join-vertical">
              <span className="text-gray-400 font-bold text-md join-item">
                {name}
              </span>
              <span className="join-item text-md text-gray-400">
                @{username}
              </span>
            </div>
            <button className="text-gray-400" onClick={openModal}>
              <EllipsisVIcon className="h-8 w-8" />
            </button>
          </div>
          <div className="mt-2">
            <p className="text-slate-300">{content}</p>
            <div className="mt-2 ">
              {Math.random() < 0.5 && (
                <img src={avatar} className="h-72 w-auto rounded-xl" alt="" />
              )}
            </div>
            <div className="flex my-2 justify-between text-slate-400">
              <div className="inline-flex justify-center items-center">
                <button>
                  <CommentIcon className="h-6 w-6" />
                </button>
                <span className="text-sm">1.2k</span>
              </div>
              <div className="inline-flex justify-center items-center">
                <button className="text-pink-600">
                  <SHeartIcon className="h-6 w-6" />
                </button>
                <span className="text-sm text-pink-600">1.2k</span>
              </div>
              <div className="inline-flex justify-center items-center">
                <button>
                  <AdjustIcon className="h-6 w-6" />
                </button>
                <span className="text-sm">1.2k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {opened && (
        <>
          <Overlay />
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
                onClick={CLOSE}
                className="w-full border-[1px] border-solid border-gray-700 text-white h-10 mt-10 rounded-lg hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
