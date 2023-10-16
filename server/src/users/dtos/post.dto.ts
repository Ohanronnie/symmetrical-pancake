import { IsNotEmpty } from "class-validator";
export class CreatePostDto {
  @IsNotEmpty()
  type: "image" | "video" | "text";
  @IsNotEmpty()
  content: string;
  url: string;
}
