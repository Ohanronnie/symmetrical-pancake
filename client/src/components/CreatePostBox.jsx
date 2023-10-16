import { useNavigate } from "react-router-dom";
export default function CreatePostBox({ avatar }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={navigate.bind({}, "/compose")}
      className="flex my-2 mt-4 h-12 justify-center border-b-[1px] border-gray-800 border-double"
    >
      <img src={avatar} className="rounded-full mr-2 h-8 w-8" alt="" />
      <input
        type="text"
        placeholder="Type something"
        className="input border-gray-700 bg-gray-900 input-bordered w-10/12 h-8"
      />
    </div>
  );
}
