import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";
import { Like } from "./entities/like.entity";
import { Follower } from "./entities/followers.entity";
import { Comment } from "./entities/comment.entity";
import { Seen } from "./entities/seen.entity";
import { ICreateUser, IUpdateUser } from "./interfaces/user.interface";
import { IPost } from "./interfaces/post.interface";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Seen) private readonly seenRepository: Repository<Seen>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    private readonly jwtService: JwtService,
  ) {}
  async create(details: ICreateUser) {
    const emailExists = await this.userRepository.findOneBy({
      email: details.email,
    });
    const userExists = await this.userRepository.findOneBy({
      username: details.username,
    });
    let errors = [];
    if (userExists) errors.push("Username already exist");
    if (emailExists) errors.push("Email already exist");
    if (errors.length > 0) return new BadRequestException(errors);
    const user = this.userRepository.create(details);
    await this.userRepository.save(user);
    return true;
  }
  async login(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user)
      return new UnauthorizedException(["Username/account does not exist"]);
    const passValid = bcrypt.compareSync(password, user.password);
    if (!passValid) return new UnauthorizedException(["Incorrect password"]);
    return {
      email: user.email,
      id: user.id,
    };
  }
  formatPost(post: any, userId: number) {
    return {
      postId: post.id,
      fullname: post.user.fullname,
      username: post.user.username,
      verified: post.user.verified,
      userID: userId,
      type: post.type,
      likes: post.likes.map((e) => e.user.id),
      comments: post.comments.map((e) => e.user.id),
      content: post.content,
      createdAt: post.createdAt,
      url: post.url,
      avatar: post.user.avatar,
      seen: post.seen.length,
    };
  }
  createJwt(email: string, id: number) {
    return this.jwtService.sign({ email, id });
  }
  async createPost(details: IPost, userID: number) {
    const user = await this.userRepository.findOneBy({ id: userID });
    let post = this.postRepository.create({
      ...details,
      createdAt: new Date(),
      user: user!,
    });
    await this.postRepository.save(post);
  }
  async getPost(userId: number, id: number, skip: number, take: number) {
    const posts = await this.postRepository.find({
      relations: [
        "likes",
        "comments",
        "user",
        "likes.user",
        "comments.user",
        "seen",
      ],
      where: id
        ? {
            user: {
              id,
            },
          }
        : {},
      skip,
      take,
    });
    const user = await this.userRepository.findOneBy({ id: userId });
    const POST_TO_BE_SENT = [];
    for (let post of posts) {
      POST_TO_BE_SENT.push({
        postId: post.id,
        fullname: post.user.fullname,
        username: post.user.username,
        verified: post.user.verified,
        userID: userId,
        type: post.type,
        likes: post.likes.map((e) => e.user.id),
        comments: post.comments.map((e) => e.user.id),
        content: post.content,
        createdAt: post.createdAt,
        url: post.url,
        avatar: post.user.avatar,
        seen: post.seen.length,
        posterId: post.user.id,
      });
    }
    return {
      user: {
        fullname: user.fullname,
        avatar: user.avatar,
      },
      posts: POST_TO_BE_SENT.sort((a, b) => Math.random() - 0.5),
    };
  }

  async getPostById(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: [
        "likes",
        "comments",
        "user",
        "likes.user",
        "comments.user",
        "seen",
      ],
    });
    if (!post) return;
    return {
      postId: post.id,
      fullname: post.user.fullname,
      username: post.user.username,
      verified: post.user.verified,
      userID: userId,
      type: post.type,
      likes: post.likes.map((e) => e.user.id),
      comments: post.comments.map((e) => void 0),
      url: post.url,
      content: post.content,
      createdAt: post.createdAt,
      avatar: post.user.avatar,
      seen: post.seen.length,
      posterId: post.user.id,
    };
  }
  async getComments(postId: number, skip: number, take: number) {
    const comments = await this.commentRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
      skip: skip,
      take: take,
      relations: ["user"],
      // loadRelationIds: true
    });
    return comments
      .sort((comment) => Math.random() - 0.5)
      .map((e) => ({
        id: e.id,
        content: e.content,
        createdAt: e.createdAt,
        user: {
          fullname: e.user.fullname,
          username: e.user.username,
          id: e.user.id,
          avatar: e.user.avatar,
          verified: e.user.verified,
        },
      }));
  }
  async handleLikes(postId: number, userId: number) {
    const post = await this.postRepository.findOneBy({ id: postId });
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !post) return;
    const likeExist = await this.likeRepository.findOne({
      where: {
        post: {
          id: postId,
        },
        user: {
          id: userId,
        },
      },
      loadRelationIds: true,
    });
    if (!likeExist) {
      const newLike = this.likeRepository.create({
        post,
        user,
      });
      await this.likeRepository.save(newLike);
    } else {
      await this.likeRepository.remove(likeExist);
    }
  }
  async handleSeen(postId: number, userId: number) {
    const post = await this.postRepository.findOneBy({ id: postId });
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !post) return;
    const seenExist = await this.seenRepository.findOne({
      where: {
        post: {
          id: postId,
        },
        user: {
          id: userId,
        },
      },
      loadRelationIds: true,
    });
    if (!seenExist) {
      const newSeen = this.seenRepository.create({
        post,
        user,
      });
      await this.seenRepository.save(newSeen);
    } else {
    }
  }
  async createComment(content: string, userId: number, postId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    const post = await this.postRepository.findOneBy({
      id: postId,
    });
    const comment = await this.commentRepository.create({
      user,
      post,
      content,
    });
    await this.commentRepository.save(comment);
    return {
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        avatar: user.avatar,
        verified: user.verified,
      },
      content,
    };
  }
  async getPostByUserId(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    const posts = await this.postRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ["likes", "comments", "user", "likes.user", "comments.user"],
      loadRelationIds: true,
    });
    return posts;
  }
  async follow(userId: number, followerId: number) {
    const following = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["following", "following.followers"],
    });
    const followers = await this.userRepository.findOne({
      where: {
        id: followerId,
      },
      relations: ["followers"],
    });
    if (!following.following.find((e) => e.followers.id == followerId)) {
      const done = this.followerRepository.create({
        following,
        followers,
      });
      await this.followerRepository.save(done);
    } else {
      const __user = await this.followerRepository.findOne({
        where: {
          following: {
            id: following.id,
          },
          followers: {
            id: followers.id,
          },
        },
        loadRelationIds: true,
      });
      await this.followerRepository.delete(__user.id);
    }
    return true;
  }
  async getFriendsSuggestion() {}
  async getUserDetailsById(userId: number, myId: number) {
    const _user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: [
        "posts",
        "posts.likes",
        "posts.comments",
        "posts.likes.user",
        "posts.comments.user",
        "posts.user",
        "posts.seen",
        "followers",
        "following",
        "followers.followers",
        "following.following",
        "following.followers",
        "followers.following",
        "comments",
        "comments.post.likes",
        "comments.post.comments",
        "comments.post.likes.user",
        "comments.post.comments.user",
        "comments.post.user",
        "comments.post.seen",
      ],
    });
    const comments = await this.commentRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        "post.likes",
        "post.comments",
        "post.likes.user",
        "post.comments.user",
        "post.user",
        "post.seen",
        "user",
      ],
    });
    let _iFollow = _user.followers.find((e) => e.following.id == myId);

    const user = {
      fullname: _user.fullname,
      username: _user.username,
      avatar: _user.avatar,
      bio: _user.bio,
      url: _user.url,
      verified: _user.verified,
      cover: _user.avatar,
      followers: _user.followers.length,
      following: _user.following.length,
      comments: comments.map((comment) => ({
        fullname: comment.user.fullname,
        username: comment.user.username,
        verified: comment.user.verified,
        avatar: comment.user.avatar,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
      posts: _user.posts.map((post) => this.formatPost(post, myId)),
      createdAt: _user.createdAt,
      isMe: _user.id === myId,
      iFollow: !!_iFollow,
      can_edit: _user.id === myId,
    };
    return user;
  }
  async getProfileDetails(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return {
      username: user.username,
      fullname: user.fullname,
      avatar: user.avatar,
      url: user.url,
      bio: user.bio,
    };
  }
  async checkUsername(id: number, username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      if (user.id == id) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  async updateProfile(details: IUpdateUser, id: number) {
    const user = await this.userRepository.findOneBy({ id });
    user.fullname = details.fullname;
    user.username = details.username;
    user.avatar = details.avatar;
    if (details.url) user.url = details.url;
    if (details.bio) user.bio = details.bio;
    await this.userRepository.save(user);
    return true;
  }
  async searchPost(value: string, userId: number) {
    const posts = await this.postRepository.find({
      relations: [
        "likes",
        "comments",
        "user",
        "likes.user",
        "comments.user",
        "seen",
      ],
    });
    const user = await this.userRepository.findOneBy({ id: userId });
    const POST_TO_BE_SENT = [];
    for (let post of posts) {
      if (post.content.match(new RegExp(value, "ig"))) {
        POST_TO_BE_SENT.push({
          postId: post.id,
          fullname: post.user.fullname,
          username: post.user.username,
          verified: post.user.verified,
          userID: userId,
          type: post.type,
          likes: post.likes.map((e) => e.user.id),
          comments: post.comments.map((e) => e.user.id),
          content: post.content,
          createdAt: post.createdAt,
          url: post.url,
          avatar: post.user.avatar,
          seen: post.seen.length,
          posterId: post.user.id,
        });
      }
    }
    return {
      posts: POST_TO_BE_SENT.sort((a, b) => Math.random() - 0.5),
    };
  }
  async searchProfile(value: string) {
    const users = await this.userRepository.find();
    const result = [];
    for (let user of users) {
      if (
        user.username.match(new RegExp(value, "i")) ||
        user.fullname.match(new RegExp(value, "i"))
      ) {
        result.push({
          username: user.username,
          fullname: user.fullname,
          verified: user.verified,
          avatar: user.avatar,
          id: user.id,
        });
      }
    }
    return result;
  }
  async search(value: string, tab: string, userId: number) {
    if (!value || !tab) return [];
    switch (tab) {
      case "post":
        return await this.searchPost(value, userId);
        break;
      case "profile":
        return await this.searchProfile(value);
        break;
      default:
        return await this.searchPost(value, userId);
    }
  }
}
