import { APIGatewayEvent, APIGatewayProxyEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { ProductInput } from "../dto/product-input";
import { CategoryRepository } from "../repository/category-repository";
import { ServiceInput } from "../dto/service-input";
import { AuthUser } from "../utility/auth";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("method not allowed!"));
  }

  async authorisedUser(user_id: number, productId: string) {
    const product = await this._repository.getProductById(productId);
    if (!product) return false;
    return Number(user_id) === Number(product.seller_id);
  }

  async createProduct(event: APIGatewayEvent) {
    //
    const token = event.headers.Authorization;
    const user = await AuthUser(token);
    if (!user) return ErrorResponse(403, "authorization failed");

    if (user.user_type.toUpperCase() !== "SELLER") {
      return ErrorResponse(403, "jou need to join as seller to create product");
    }

    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct({
      ...input,
      seller_id: user.user_id,
    });
    await new CategoryRepository().addItem({
      id: input.category_id,
      products: [data._id],
    });
    return SuccessResponse(data);
  }

  async getProducts(event: APIGatewayEvent) {
    const data = await this._repository.getAllProducts();
    return SuccessResponse(data);
  }

  async getProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const data = await this._repository.getProductById(productId);
    return SuccessResponse(data);
  }

  async getSellerProducts(event: APIGatewayEvent) {
    const token = event.headers.Authorization;
    const user = await AuthUser(token);
    if (!user) return ErrorResponse(403, "authorization failed");

    if (user.user_type.toUpperCase() !== "SELLER") {
      return ErrorResponse(403, "you need to join as seller to manage product");
    }
    const data = await this._repository.getAllSellerProducts(user.user_id);

    return SuccessResponse(data);
  }
  async editProduct(event: APIGatewayEvent) {
    const token = event.headers.Authorization;
    const user = await AuthUser(token);
    if (!user) return ErrorResponse(403, "authorization failed");

    if (user.user_type.toUpperCase() !== "SELLER") {
      return ErrorResponse(403, "you need to join as seller to manage product");
    }

    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const input = plainToClass(ProductInput, JSON.parse(event.body!));
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    const isAuthorised = await this.authorisedUser(user.user_id, productId);
    if (!isAuthorised)
      return ErrorResponse(403, "you need to join as seller to manage product");

    input.id = productId;
    const data = await this._repository.updateProduct(input);
    return SuccessResponse(data);
  }

  async deleteProduct(event: APIGatewayEvent) {
    const token = event.headers.Authorization;
    const user = await AuthUser(token);
    if (!user) return ErrorResponse(403, "authorization failed");

    if (user.user_type.toUpperCase() !== "SELLER") {
      return ErrorResponse(403, "you need to join as seller to manage product");
    }

    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const isAuthorised = await this.authorisedUser(user.user_id, productId);
    if (!isAuthorised)
      return ErrorResponse(
        403,
        "you are not authorised to delete this product"
      );

    const { category_id, DeleteResult } = await this._repository.deleteProduct(
      productId
    );
    await new CategoryRepository().removeItem({
      id: category_id,
      products: [productId],
    });
    return SuccessResponse(DeleteResult);
  }

  // https calls // later stage we will convert thing to RPC & Queue

  async handleQueueOperation(event: APIGatewayProxyEvent) {
    const input = plainToClass(ServiceInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    //Get product from product repo
    const { _id, name, price, image_url } =
      await this._repository.getProductById(input.productId);

    return SuccessResponse({
      product_id: _id,
      name,
      price,
      image_url,
    });
  }
}
