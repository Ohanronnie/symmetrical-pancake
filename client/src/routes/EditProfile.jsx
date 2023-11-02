import { useState, useEffect } from "react";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import { axios } from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
const formInput = [
  {
    name: "username",
    text: "Username",
    type: "text",
  },
  {
    name: "fullname",
    text: "Full name",
    type: "text",
  },
];

export default function EditProfile() {
  const [details, setDetails] = useState({});
  const [_details, _setDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  useEffect(function () {
    axios.get("/personal/profile/details").then(({ data }) => {
      setDetails(data);
      _setDetails(data);
    });
  }, []);
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
  const handleErrors = async ({ target }) => {
    if (target.name === "username") {
      const usernameExist = await axios.get("/username/exist/" + target.value);
      if (!/^([a-zA-Z])[0-9a-zA-Z_]{3,}$/.test(target.value)) {
        setErrors((e) => ({ ...e, username: "Unsupported Username" }));
      } else if (usernameExist.data) {
        setErrors((e) => ({ ...e, username: "Username already exist" }));
      } else setErrors((e) => ({ ...e, username: null }));
    } else if (target.name === "fullname") {
      if (target.value.length < 4) {
        setErrors((e) => ({ ...e, fullname: "Name too short" }));
      } else if (/[^a-zA-Z ]/g.test(target.value)) {
        setErrors((e) => ({ ...e, fullname: "Name contain special chars" }));
      } else setErrors((e) => ({ ...e, fullname: null }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    let imageUpload;
    if (image) {
      imageUpload = await axios.post("/image/upload", formData);
    }
    const detailsUploaded = await axios.post(
      "/personal/profile/update",
      Object.assign(
        {},
        {
          fullname: details.fullname,
          username: details.username,
        },
        image
          ? {
              avatar: imageUpload.data.path,
            }
          : {
              avatar: details.avatar,
            },
      ),
    );
    navigate("/home");
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
          <h4 className="text-white font-bold text-md text-center">
            Edit Profile
          </h4>
        </div>
      </nav>
      <section className="mx-4 pb-8">
        <h2 className="text-lg font-medium text-white py-4">
          Edit Your Personal Details
        </h2>
        <div className="flex justify-center">
          <div
            style={{
              backgroundImage: `url(${imageUrl || details.avatar})`,
              backgroundSize: "5rem",
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
          <div className="my-4">
            <div className="relative">
              <input
                id="floating_input"
                className="text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-gray-600 w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                type={"text"}
                value={details["username"] || ""}
                onChange={handleChange}
                onInput={handleErrors}
                name="username"
                placeholder=""
              />
              <label
                for="floating_input"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                {" "}
                {"Username"}{" "}
              </label>
            </div>
            <p className="text-red-900 mt-2 text-sm">{errors["username"]}</p>
          </div>
          <div className="my-4">
            <div className="relative">
              <input
                id="floating_input"
                className="text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-gray-600 w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                type={"text"}
                value={details["fullname"] || ""}
                onChange={handleChange}
                onInput={handleErrors}
                name="fullname"
                placeholder=""
              />
              <label
                for="floating_input"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                {" "}
                {"Full name"}{" "}
              </label>
            </div>
            <p className="text-red-900 mt-2 text-sm">{errors["fullname"]}</p>
          </div>

          <button
            type={"submit"}
            className="my-4 h-10 text-white w-full border-[1px] border-solid border-[#008fff] hover:text-[#008fff] hover:bg-transparent bg-[#008fff] rounded-full"
          >
            Save
          </button>
        </form>
      </section>
    </>
  );
}
