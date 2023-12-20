import { IFunction } from "aws-cdk-lib/aws-lambda";

export interface ServiceInterface {
  // products
  readonly createProduct: IFunction;
  readonly editProduct: IFunction;
  readonly getProduct: IFunction; // customer
  readonly getProducts: IFunction; // customer / seller
  readonly getSellerProducts: IFunction;
  readonly deleteProduct: IFunction;

  // categories
  readonly createCategory: IFunction;
  readonly editCategory: IFunction;
  readonly getCategory: IFunction;
  readonly getCategories: IFunction;
  readonly deleteCategory: IFunction;

  //deals
  readonly createDeals: IFunction;

  //others
  readonly imageUploader: IFunction;
  readonly messageQueueHandler: IFunction;
}
