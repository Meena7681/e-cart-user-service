import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductService } from "../service/product-service";
import { ProductRepository } from "../repository/product-repository";
import bodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";

const service = new ProductService(new ProductRepository());

export const createProduct = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.createProduct(event);
  }
).use(bodyParser());
export const getProduct = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.getProduct(event);
  }
).use(bodyParser());

export const getSellerProducts = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.getSellerProducts(event);
  }
).use(bodyParser());

export const getProducts = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.getProducts(event);
  }
).use(bodyParser());

export const editProduct = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.editProduct(event);
  }
).use(bodyParser());

export const deleteProduct = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.deleteProduct(event);
  }
).use(bodyParser());
