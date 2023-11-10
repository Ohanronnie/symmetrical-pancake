export const postProps = (curr) => ({
  name: curr.fullname,
  username: curr.username,
  verified: curr.verified,
  content: curr.content,
  likes: curr.likes,
  comments: curr.comments,
  seen: curr.seen,
  avatar: curr.avatar,
  url: curr.url,
  postId: curr.postId,
  createdAt: curr.createdAt,
});
