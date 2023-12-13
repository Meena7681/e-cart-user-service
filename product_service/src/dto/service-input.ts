import { Length } from "class-validator";

export class ServiceInput {
  action: string; // optional // GET_PRODUCT // GET_CATEGORY etc
  @Length(12, 24)
  productId: string;
}
