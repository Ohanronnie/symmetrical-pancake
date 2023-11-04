import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Query,
  HttpException,
  BadRequestException,
  UseGuards,
  Param,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
  Session,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response, Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../user.service";
import { User, IUser } from "../user.decorator";
import { CreatePostDto } from "../dtos/post.dto";
import { UpdateUserDto } from "../dtos/user.dto";

import { join } from "path";
import { createReadStream } from "fs";
import { multerOptions } from "../utils/multer";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { ProtectGuard } from "../../auth/protect.guard";
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("register/login")
  @UseGuards(AuthGuard("local"))
  async loginUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Session() session: any,
  ) {
    const user = req.user as any;
    session.jwt = this.userService.createJwt(user.email, user.id);
    const date = new Date();
    res.cookie("c_user", user.id, {
      maxAge: date.setFullYear(date.getFullYear() + 1),
      path: "/",
      sameSite: "none",
      httpOnly: false,
      secure: false,
    });
    return { id: user.id };
  }

  @Post("post")
  @UseGuards(JwtAuthGuard)
  createPost(@Body() body: CreatePostDto, @User() user: IUser) {
    console.log(body);
    this.userService.createPost(body, user.id);
    return {};
  }
  @Get("posts")
  @UseGuards(JwtAuthGuard)
  getPost(@User() user: IUser, @Query() body: any) {
    return this.userService.getPost(user.id, body.id, body.skip, body.take);
  }
  @Get("token/get")
  @UseGuards(ProtectGuard)
  getToken(@Req() req: Request, @Session() session: any) {
    req.session["ses_spa"] = session.ses_spa;
    req.session["ses_req_id"] = session.ses_req_id;
    req.session["ses_app_associate"] = session.ses_app_associate;
    return {
      spa: req["spa"],
      req_id: req["req_id"],
      app_associate: req["app_associate"],
    };
  }
  @Get("post")
  @UseGuards(JwtAuthGuard)
  getPostById(@Query() query: any, @User() user: IUser) {
    return this.userService.getPostById(query.id, user.id);
  }
  @Post("post/like/:postId")
  @UseGuards(JwtAuthGuard)
  async handleLike(@User() user: IUser, @Param("postId") postId: number) {
    const like = await this.userService.handleLikes(postId, user.id);
    return {};
  }
  @Post("post/seen/:postId")
  @UseGuards(JwtAuthGuard)
  async handleSeen(@User() user: IUser, @Param("postId") postId: number) {
    const seen = await this.userService.handleSeen(postId, user.id);
    return {};
  }
  @Post("post/comment/:postId")
  @UseGuards(JwtAuthGuard)
  async handleComment(
    @User() user: IUser,
    @Body() body: any,
    @Param("postId") postId: number,
  ) {
    console.log(body);
    return await this.userService.createComment(body.content, user.id, postId);
  }
  @Get("post/comments")
  async getComment(@Query() query: any) {
    console.log(query);
    return this.userService.getComments(query.postId, query.skip, query.take);
  }
  @Get("post/user/:userId")
  @UseGuards(JwtAuthGuard)
  async getPostByUserId(@User() user: IUser, @Param("userId") userId: number) {
    const post = await this.userService.getPostByUserId(userId);
    console.log(post);
    return post;
  }
  @Post("follow/:id")
  @UseGuards(JwtAuthGuard)
  async follow(@User() user: IUser, @Param("id") id: number) {
    return await this.userService.follow(user.id, id);
  }
  @Get("/profile/:id")
  @UseGuards(JwtAuthGuard)
  async getPostByProfileId(@Param("id") id: number, @User() user: IUser) {
    console.log(id);
    return this.userService.getUserDetailsById(id, user.id);
  }
  /* @Post("image/upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image", multerOptions))
  async uploadImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(req);
    return {
      path: `${process.env.BACKEND_URL}/file/${file.filename}`,
    };
  }*/
  @Get("personal/profile/details")
  @UseGuards(JwtAuthGuard)
  getPersonalDetails(@User() user: IUser) {
    return this.userService.getProfileDetails(user.id);
  }
  @Post("personal/profile/update")
  @UseGuards(JwtAuthGuard)
  updateProfile(@User() user: IUser, @Body() body: UpdateUserDto) {
    return this.userService.updateProfile(body, user.id);
  }
  @Get("username/exist/:username")
  @UseGuards(JwtAuthGuard)
  checkUsername(@User() user: IUser, @Param("username") username: string) {
    return this.userService.checkUsername(user.id, username);
  }
  @Get("search")
  @UseGuards(JwtAuthGuard)
  search(@Query("value") value: string, @Query("tab") tab: string) {
    if (!value || !tab) return [];
    return this.userService.search(value, tab.toLowerCase(), 1);
  }
  @Get("file/:name")
  getFile(@Param("name") name: string) {
    return new StreamableFile(createReadStream(join("assets", name)));
  }
}
