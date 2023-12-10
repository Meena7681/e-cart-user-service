import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import { AppValidationError } from "../utility/errors";
import { plainToClass } from "class-transformer";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGateway } from "aws-sdk";

export class CategoryService {
  _repository: CategoryRepository;
  constructor(repository: CategoryRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("method not allowed!"));
  }

  async createCategory(event: APIGatewayEvent) {
    // const input = plainToClass(CategoryInput, JSON.parse(event.body!));
    // const error = await AppValidationError(input);
    // if (error) return ErrorResponse(404, error);

    // const data = await this._repository.createCategory(input);

    return SuccessResponse({});
  }

  async getCategories(event: APIGatewayEvent) {
    // const data = await this._repository.getAllCategory();
    // return SuccessResponse(data);
  }

  async getCategory(event: APIGatewayEvent) {
    // const CategoryId = event.pathParameters?.id;
    // if (!CategoryId) return ErrorResponse(403, "please provide Category id");
    // const data = await this._repository.getCategoryById(CategoryId);
    // return SuccessResponse(data);
  }

  async editCategory(event: APIGatewayEvent) {
    // const CategoryId = event.pathParameters?.id;
    // if (!CategoryId) return ErrorResponse(403, "please provide Category id");
    // const input = plainToClass(CategoryInput, JSON.parse(event.body!));
    // const error = await AppValidationError(input);
    // if (error) return ErrorResponse(404, error);
    // input.id = CategoryId;
    // const data = await this._repository.updateCategory(input);
    // return SuccessResponse(data);
  }

  async deleteCategory(event: APIGatewayEvent) {
    // const CategoryId = event.pathParameters?.id;
    // if (!CategoryId) return ErrorResponse(403, "please provide Category id");
    // const data = await this._repository.deleteCategory(CategoryId);
    // return SuccessResponse(data);
  }
}
