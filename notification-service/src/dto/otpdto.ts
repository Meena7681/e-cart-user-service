import { IsString } from "class-validator";

export class OTPInput {
  @IsString()
  phone: string;

  @IsString()
  code: string;
}
