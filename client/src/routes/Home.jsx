import Header from "../components/Header";
import Footer from "../components/Footer";
import CreatePostBox from "../components/CreatePostBox";
import Post from "../components/Post";
import PostModal from "../components/PostModal";
import { axios } from "../utils/axios.js";
import { useState, useEffect } from "react";
import { Loading, useLoading } from "../components/Loading";
export default function Home() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useLoading(false);
  useEffect(function () {
    axios
      .get("/posts", {
        params: {},
      })
      .then(({ data }) => {
        setResponse(data);
      });
  }, []);
  const postProps = (curr) => ({
    name: curr.fullname,
    username: curr.username,
    content: curr.content,
    likes: curr.likes,
    comments: curr.comments,
    seen: curr.seen,
    avatar: curr.avatar,
    url: curr.url,
    postId: curr.postId,
    posterId: curr.posterId,
    verified: curr.verified,
  });
  return (
    <div className="">
      <Header />
      <section className="mb-6">
        <div className="mb-4">
          <CreatePostBox avatar={response?.user?.avatar} />
          <div className="">
            {response ? (
              response.posts.map((curr) => {
                return <Post key={Math.random()} {...postProps(curr)} />;
              })
            ) : (
              <Loading
                svg={{ className: "h-10 w-10" }}
                div={"h-[100%] flex justify-center items-center"}
              />
            )}
            <div className="w-full h-36"></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
