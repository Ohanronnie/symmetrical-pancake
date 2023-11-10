import Post from "../components/Post";
import { postProps } from "../utils/postProps.js";
export default function _Post() {
  return (
    <Post
      {...postProps({
        likes: [],
        content: "Lorem ipsun dolor sit amet",
        comments: [],
      })}
    />
  );
}
