import { useState, useEffect } from "react";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import avatar from "../assets/images/avatar.jpg";
const formInput = [
  {
    name: "username",
    text: "Username",
    type: "text",
  },
  {
    name: "name",
    text: "Full name",
    type: "text",
  },
  {
    name: "password",
    text: "Password",
    type: "password",
  },
];

export default function EditProfile() {
  const [details, setDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setDetails((e) => ({ ...e, [name]: value }));
  };
  const handleImage = async (e) => {
    setImage(e.target.files[0]);
    const fileReader = new FileReader();
    fileReader.onloadend = (ev) => {
      setImageUrl(ev.target.result);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <nav className="flex py-2 sticky top-0 z-10 bg-gray-900 border-b-[1px] border-solid border-gray-700">
        <button className="text-white font-bold pl-2 pr-8">
          <ArrowLeftIcon className="h-4 w-10" />
        </button>
        <div className="">
          <h4 className="text-white font-bold text-lg text-center">
            Edit Profile
          </h4>
        </div>
      </nav>
      <section className="mx-4 pb-8">
        <h2 className="text-2xl font-medium text-white py-4">
          Edit Your Personal Details
        </h2>
        <div className="flex justify-center">
          <div
            style={{
              background: `url(${imageUrl || avatar})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
            className="flex object-cover justify-center h-20 w-20 items-center rounded-full"
          >
            <label className="h-6 w-6" htmlFor="image">
              {" "}
              <CameraIcon className="h-6 w-6" />{" "}
            </label>
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="hidden"
              id="image"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          {formInput.map(({ name, text, type }) => (
            <div className="my-4">
              <div className="relative">
                <input
                  id="floating_input"
                  className="text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-gray-600 w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  type={type}
                  value={details[name] || ""}
                  onChange={handleChange}
                  name={name}
                  placeholder=""
                />
                <label
                  for="floating_input"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  {" "}
                  {text}{" "}
                </label>
              </div>
              <p className="text-red-900 mt-2 text-sm">{errors[name]}</p>
            </div>
          ))}
          <button
            type={"submit"}
            className="my-4 h-10 text-white w-full border-[1px] border-solid border-[#008fff] hover:text-[#008fff] hover:bg-transparent bg-[#008fff] rounded-full"
          >
            Sign In
          </button>
        </form>
      </section>
    </>
  );
}
