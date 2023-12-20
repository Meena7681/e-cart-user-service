import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic, SubscriptionFilter } from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { create } from "domain";
import { join } from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface ServiceProps {}
export class ServiceStack extends Construct {
  public readonly createOrder: NodejsFunction;
  public readonly getOrder: NodejsFunction;
  public readonly getOrders: NodejsFunction;
  public readonly getTransaction: NodejsFunction;

  constructor(scope: Construct, id: string, props?: ServiceProps) {
    super(scope, id);
    const functionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(180),
    };
    this.createOrder = this.createHandlers(functionProps, "createOrderHandler");
    this.getOrder = this.createHandlers(functionProps, "getOrderHandler");
    this.getOrders = this.createHandlers(functionProps, "getOrdersHandler");
    this.getTransaction = this.createHandlers(
      functionProps,
      "getTransactionHandler"
    );
  }
  createHandlers(props: NodejsFunctionProps, handler: string): NodejsFunction {
    return new NodejsFunction(this, handler, {
      entry: join(__dirname, "/../src/handlers/index.ts"),
      handler: handler,
      ...props,
    });
  }
}
