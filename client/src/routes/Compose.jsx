import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import avatar from "../assets/images/avatar.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../utils/axios.js";
import { useLoading, Loading } from "../components/Loading";

export default function Compose() {
  const [post, setPost] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useLoading(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setPost(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (post.length >= 2) {
      setLoading(true);
      try {
        let url;
        if (image && imageUrl) {
          const formData = new FormData();
          formData.append("image", image);
          const path = await axios.post("/image/upload", formData);
          url = path.data.path;
        }
        const POST = await axios.post("/post", {
          content: post,
          type: url ? "image" : "text",
          url,
        });
        navigate("/home");
      } catch (err) {
        console.log(err?.response?.data?.message || err);
      }
    }
  };
  const handleImage = async (e) => {
    setImage(e.target.files[0]);
    const fileReader = new FileReader();
    fileReader.onloadend = (ev) => {
      setImageUrl(ev.target.result);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };
  return (
    <>
      <nav className="flex py-2 sticky top-0 z-10 bg-gray-900 border-b-[1px] border-solid border-gray-700">
        <button
          onClick={navigate.bind(null, -1)}
          className="text-white font-bold pl-2 pr-8"
        >
          <ArrowLeftIcon className="h-4 w-10" />
        </button>
        <div className="">
          <h4 className="text-white font-bold text-lg">Back</h4>
        </div>
      </nav>
      <section className="mx-2 mt-2">
        <div className="mx-2">
          <form onSubmit={handleSubmit}>
            <div className="border-gray-600 border-[1px] rounded-lg border-solid">
              <textarea
                className="w-full pb-4 outline-none border-none h-32 textarea hover:outline-none focus:oitline-none text-white bg-gray-900 input-bordered"
                placeholder={
                  Math.random() < 0.5
                    ? "Alaye talk wetin dey your mind no let depression kill you. "
                    : "What's on your mind?."
                }
                onChange={handleChange}
                disabled={loading}
              />
              <div className="border-solid border-t-gray-600 border-t-[1px] text-gray-600 w-full">
                <div className="p-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="file"
                    onChange={handleImage}
                    disabled={loading}
                  />
                  <label htmlFor="file">
                    <CameraIcon className="w-6 h-6 p-1 flex justify-center bg-gray-800 rounded-md" />
                  </label>
                </div>
                <div className="w-full border-solid border-t-gray-600 border-t-[1px] p-2">
                  {imageUrl && (
                    <img src={imageUrl} className="w-1/2 h-40 rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <button className="my-4 h-10 text-white w-full border-[1px] border-solid border-[#008fff] hover:text-[#008fff] hover:bg-transparent bg-[#008fff] rounded-full">{!loading ? "Post" : (<div className="flex justify-center"> <Loading svg={{className: "h-6 w-6"}}/> <p className="ml-2">Posting </p></div>)}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}