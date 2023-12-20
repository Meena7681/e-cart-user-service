import { IResource, Resource, aws_apigateway } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
  createOrder: IFunction;
  getOrder: IFunction;
  getOrders: IFunction;
  getTransaction: IFunction;
}

interface ResourceType {
  name: string;
  methods: string[];
  child?: ResourceType;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("transaction", props);
  }

  addResource(
    serviceName: string,
    { getOrder, getOrders, createOrder, getTransaction }: ApiGatewayStackProps
  ) {
    //transaction
    const apgw = new aws_apigateway.RestApi(this, `${serviceName}-Api`, {
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
      },
    });

    // order EndPoint
    const orderResource = this.createEndpoints(getOrders, apgw, {
      name: "order",
      methods: ["POST"],
    });
    this.addChildEndpoint("{id}", "GET", getOrder, orderResource);

    /// orders - GET /orders
    //      {id} -> GET orders/123
    //transaction Endpoint
    this.createEndpoints(getTransaction, apgw, {
      name: "transactions",
      methods: ["GET"],
    });
  }

  createEndpoints(
    handler: IFunction,
    resource: RestApi,
    { name, methods, child }: ResourceType
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const rootResource = resource.root.addResource(name);
    methods.map((item) => {
      rootResource.addMethod(item, lambdaFunction);
    });
    return rootResource;
  }

  addChildEndpoint(
    path: string,
    methodType: string,
    handler: IFunction,
    resource: aws_apigateway.Resource
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const childResource = resource.addResource(path);
    childResource.addMethod(methodType, lambdaFunction);
  }
}
