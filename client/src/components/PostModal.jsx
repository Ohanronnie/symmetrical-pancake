import {
  UserMinusIcon,
  FaceFrownIcon,
  ClipboardDocumentIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { useRef, useEffect } from "react";
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
export default function PostModal() {
  const elem = useRef(null);
  /*  useEffect(() => {
    if (opened) {*/
  document.body.style.position = "fixed";
  document.body.style.overflow = "hidden";
  /*  }
  }, [opened]);*/
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
  const CLOSE = () => {
    action();
    document.body.style.overflow = "scroll";
    document.body.style.position = "static";
    elem.current?.close();
  };
  return (
    <>
      {
        <>
          <Overlay />
          <div className="bg-gray-800 bottom-0 left-0 w-full z-[999] rounded-tr-lg rounded-tl-lg px-2 py-4">
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
      }
    </>
  );
}
