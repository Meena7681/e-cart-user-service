import "reflect-metadata";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { Duration } from "aws-cdk-lib";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface ServiceProps {}
export class ServiceStack extends Construct {
  public readonly emailHandler: NodejsFunction;
  public readonly otpHandler: NodejsFunction;

  constructor(scope: Construct, id: string, props?: ServiceProps) {
    super(scope, id);
    const functionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(120),
    };
    this.emailHandler = this.createHandlers(
      functionProps,
      "CustomerEmailHandler"
    );
    this.otpHandler = this.createHandlers(
      functionProps,
      "CustomerOTPEmailHandler"
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
