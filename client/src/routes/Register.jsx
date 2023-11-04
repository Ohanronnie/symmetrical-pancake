import GoogleIcon from "../assets/images/google.svg";
import { useState, useEffect } from "react";
import { axios } from "../utils/axios.js";
import { Link, useNavigate } from "react-router-dom";
import { useLoading, Loading } from "../components/Loading";
export default function Register() {
  const [formValues, setFormValues] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useLoading(false);
  const handleErrors = (name, value) => {
    switch (name) {
      case "username":
        if (!/^([a-zA-Z])[0-9a-zA-Z_ ]{3,}$/.test(value.trim()))
          setErrors((e) => ({
            ...e,
            username: "Username cannot contain special characters",
          }));
        else setErrors((e) => ({ ...e, username: null }));
        break;
      case "email":
        if (
          !/^([a-zA-Z0-9._-]{2,})+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
        )
          setErrors((e) => ({ ...e, email: "Invalid email format" }));
        else setErrors((e) => ({ ...e, [name]: null }));
        break;

      case "fullname":
        if (/[^a-zA-Z ]/.test(value))
          setErrors((e) => ({
            ...e,
            [name]: "Fullname cannot contain special characters",
          }));
        else if (value.length < 4)
          setErrors((e) => ({ ...e, [name]: "Fullname too short" }));
        else setErrors((e) => ({ ...e, [name]: null }));
        break;
      case "password":
        if (value.length < 6)
          setErrors((e) => ({ ...e, [name]: "Password too short" }));
        else setErrors((e) => ({ ...e, [name]: null }));
        break;
      default:
        null;
    }
  };
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormValues((e) => ({ ...e, [name]: value }));
    handleErrors(name, value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i of Object.keys(formValues)) handleErrors(i, formValues[i]);
    if (Object.values(errors).every((e) => !e)) {
      console.log(formValues, errors);
      setLoading(true);
      try {
        let response = await axios.post("/register/signup", formValues);
        if (response) {
          setLoading(false);
          navigate("/register/login");
        }
      } catch (err) {
        setLoading(false);
        let error = err.response.data.message;
        error = error.map((e) => ({
          name: e.toLowerCase().split(" ")[0],
          message: e,
        }));
        for (let i of error) {
          setErrors((e) => ({ ...e, [i.name]: i.message }));
        }
      }
    }
  };
  return (
    <>
      {loading && (
        <Loading
          svg={{ className: "h-10 w-10" }}
          div={"h-[100vh] flex justify-center items-center"}
        />
      )}
      <nav className="flex sticky top-0 z-30 justify-center bg-gray-900 py-2">
        <img
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=200"
          className="w-8 h-8"
          alt=""
        />
      </nav>
      <section className="mx-4 pb-8">
        <h2 className="text-3xl font-medium text-white py-4">
          Create your account
        </h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="my-4">
            <div className="relative">
              <input
                id="floating_input"
                className={`text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-${
                  errors.fullname ? "gray-600" : "gray-600"
                } w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer`}
                type={"text"}
                onChange={handleChange}
                value={formValues.fullname || ""}
                name="fullname"
                placeholder=""
              />
              <label
                htmlFor="floating_input"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Full Name
              </label>
            </div>
            <p className="text-red-900 font-medium mt-2 text-sm">
              {errors.fullname}
            </p>
          </div>
          <div className="my-4">
            <div className="relative">
              <input
                id="floating_input"
                className="text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-gray-600 w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                type={"text"}
                onChange={handleChange}
                value={formValues.username || ""}
                name="username"
                placeholder=""
              />
              <label
                htmlFor="floating_input"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Username
              </label>
            </div>
            <p className="text-red-900 font-medium mt-2 text-sm">
              {errors.username}
            </p>
          </div>
          <div className="my-4">
            <div className="relative">
              <input
                id="floating_input"
                className="text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-gray-600 w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                type={"email"}
                onChange={handleChange}
                value={formValues.email || ""}
                name="email"
                placeholder=""
              />
              <label
                htmlFor="floating_input"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Email
              </label>
            </div>
            <p className="text-red-900 font-medium mt-2 text-sm">
              {errors.email}
            </p>
          </div>
          <div className="my-4">
            <div className="relative">
              <input
                id="floating_input"
                className="text-gray-400 bg-gray-900 border-[1px] hover:border-[#008fff] input input-bordered border-gray-600 w-full w-full text-sm text-gray-400 bg-transparent rounded-xl border-1 appearance-none dark:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                type={"password"}
                onChange={handleChange}
                value={formValues.password || ""}
                name="password"
                placeholder=""
              />
              <label
                htmlFor="floating_input"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Password
              </label>
            </div>
            <p className="text-red-900 font-medium mt-2 text-sm">
              {errors.password}
            </p>
          </div>

          <button
            type="submit"
            className="my-4 h-10 text-md text-white w-full border-[1px] border-solid border-[#008fff] hover:text-[#008fff] hover:bg-transparent bg-[#008fff] rounded-xl"
          >
            Sign Up
          </button>
          <div className="w-full flex items-center justify-center">
            <hr className="border-white bg-white w-[45%]" />{" "}
            <span className="text-white text-sm mx-2 px-2">Or</span>{" "}
            <hr className="border-white bg-white w-[45%]" />
          </div>
          <button className="mb-8 my-4 text-md h-10 text-black w-full border-[1px] border-solid border-white hover:text-white hover:bg-transparent bg-white rounded-xl flex items-center justify-center">
            <img src={GoogleIcon} className="h-4 w-4 mx-2" alt="" />
            Continue with Google
          </button>
          <div className="">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/register/login">
                {" "}
                <span className="font-medium text-sm text-[#008fff] underline">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
