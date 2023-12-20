import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent, Context, SQSEvent } from "aws-lambda";
import { DBOperation } from "./db-operation";
import { STATUS_CODES } from "http";

const dbOperation = new DBOperation();

export const getOrdersHandler = middy(
  async (event: APIGatewayEvent, context: Context) => {
    const queryString = "SELECT * FROM orders LIMIT 500";
    const result = await dbOperation.executeQuery(queryString, []);
    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "orders not found" }),
      };
    }
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: JSON.stringify({ orders: result.rows[0] }),
    };
  }
).use(jsonBodyParser());

export const getOrderHandler = middy(
  async (event: APIGatewayEvent, context: Context) => {
    const { id } = event.pathParameters as any;
    const queryString =
      "SELECT * FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE user_id=$1";
    const result = await dbOperation.executeQuery(queryString, [id]);
    if (result.rowCount === 0) {
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        statusCode: 404,
        body: JSON.stringify({ message: "order not found" }),
      };
    }

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: JSON.stringify({ order: result.rows }),
    };
  }
).use(jsonBodyParser());
