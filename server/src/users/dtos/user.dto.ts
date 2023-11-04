import {
  IsEmail,
  Validate,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";
import { IsUsername } from "./name.validator";
export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(28)
  fullname: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @Validate(IsUsername)
  @IsNotEmpty()
  username: string;
}
export class LoginUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
export class UpdateUserDto {
  @IsNotEmpty()
  @MaxLength(28)
  fullname: string;
  @Validate(IsUsername)
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  avatar: string;
  bio: string;
  url: string;
}
