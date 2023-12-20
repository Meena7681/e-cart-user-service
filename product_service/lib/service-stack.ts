import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ServiceInterface } from "./serviceInterface";

interface ServiceProps {
  bucket: string;
}

export class ServiceStack extends Construct {
  public readonly services: ServiceInterface;

  constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);

    const funProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        BUCKET_NAME: props.bucket,
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(10),
    };

    this.services = {
      createProduct: this.createHandler(funProps, "createProduct"),
      editProduct: this.createHandler(funProps, "editProduct"),
      deleteProduct: this.createHandler(funProps, "deleteProduct"),
      getProduct: this.createHandler(funProps, "getProduct"),
      getProducts: this.createHandler(funProps, "getProducts"),
      getSellerProducts: this.createHandler(funProps, "getSellerProducts"),

      createCategory: this.createHandler(funProps, "createCategory"),
      editCategory: this.createHandler(funProps, "editCategory"),
      deleteCategory: this.createHandler(funProps, "deleteCategory"),
      getCategory: this.createHandler(funProps, "getCategory"),
      getCategories: this.createHandler(funProps, "getCategories"),

      createDeals: this.createHandler(funProps, "createDeals"),

      imageUploader: this.createHandler(funProps, "imageUploader"),
      messageQueueHandler: this.createHandler(funProps, "messageQueueHandler"),
    };
  }
  createHandler(props: NodejsFunctionProps, handler: string): NodejsFunction {
    return new NodejsFunction(this, handler, {
      entry: join(__dirname, "/../src/handlers/index.ts"),
      handler: handler,
      ...props,
    });
  }
}
