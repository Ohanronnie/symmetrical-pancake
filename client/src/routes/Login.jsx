import GoogleIcon from "../assets/images/google.svg";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axios } from "../utils/axios.js";
import { useLoading, Loading } from "../components/Loading";

export default function Login() {
  const [details, setDetails] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useLoading(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      const token = await axios.get("/token/get");
      window.spa = token.data.spa;
      window.app_associate = token.data.app_associate;
      window.req_id = token.data.req_id;
    })();
  }, []);
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setDetails((e) => ({ ...e, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (details.username !== "" && details.password !== "") {
        setLoading(true);
        const user = await axios.post("/register/login", {
          ...details,
          req_id: window.req_id,
          app_associate: window.app_associate,
          spa: window.spa,
        });
        setLoading(false);
        setErrors(null);
        localStorage.setItem("id", user.data.id);
        localStorage.setItem("access_token", user.data.access_token);
        navigate("/home");
      } else {
        setErrors("Please fill all fields");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      let error = err.response?.data?.message;
      setErrors(error);
    }
  };
  const formInput = [
    {
      name: "username",
      text: "Username",
      type: "text",
    },
    {
      name: "password",
      text: "Password",
      type: "password",
    },
  ];
  return (
    <>
      {loading ? (
        <Loading
          svg={{ className: "h-10 w-10" }}
          div={"h-[100vh] flex justify-center items-center"}
        />
      ) : (
        <>
          <nav className="flex sticky top-0 z-30 justify-center bg-gray-900 py-2">
            <img
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=200"
              className="w-8 h-8"
              alt=""
            />
          </nav>
          <section className="mx-4 pb-8">
            <h2 className="text-3xl font-medium text-white py-4">
              Welcome Back
            </h2>
            <form onSubmit={handleSubmit} className="mt-4">
              {formInput.map(({ name, text, type }) => (
                <div className="mt-4">
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
                </div>
              ))}
              <p className="text-red-900 mb-2 mt-1 text-sm">{errors}</p>
              <button
                type={"submit"}
                className="my-4 h-10 text-white w-full border-[1px] border-solid border-[#008fff] hover:text-[#008fff] hover:bg-transparent bg-[#008fff] rounded-xl"
              >
                Sign In
              </button>
              <div className="w-full flex items-center justify-center">
                <hr className="border-white bg-white w-[45%]" />{" "}
                <span className="text-white mx-2 px-2">Or</span>{" "}
                <hr className="border-white bg-white w-[45%]" />
              </div>
              <button className="mb-8 my-4 h-10 text-black w-full border-[1px] border-solid border-white hover:text-white hover:bg-transparent bg-white rounded-xl flex items-center justify-center">
                <img src={GoogleIcon} className="h-4 w-4 mx-2" alt="" />
                Continue with Google
              </button>
              <div className="">
                <p className="text-md text-gray-500">
                  Not yet on SocialSphere?{" "}
                  <Link to="/register/signup">
                    {" "}
                    <span className="font-medium text-[#008fff] underline">
                      Register now
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </section>
        </>
      )}
    </>
  );
}
