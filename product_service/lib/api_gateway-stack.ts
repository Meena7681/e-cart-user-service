import { aws_apigateway } from "aws-cdk-lib";
import {
  LambdaIntegration,
  LambdaRestApi,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { ServiceInterface } from "./serviceInterface";

interface ApiGatewayStackProps {
  services: ServiceInterface;
}

type MethodType = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

interface Method {
  methodType: MethodType;
  handler: IFunction;
}

interface ResourceType {
  name: string;
  methods: Method[];
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props);
  }

  addResource(serviceName: string, { services }: ApiGatewayStackProps) {
    const apgw = new aws_apigateway.RestApi(this, `${serviceName}-ApiGtw`);

    // product Endpoints
    const productResource = this.createEndpoints(apgw, {
      name: "product",
      methods: [
        {
          methodType: "POST",
          handler: services.createProduct,
        },
        {
          methodType: "GET",
          handler: services.getProducts,
        },
      ],
    });

    this.addChildEndpoints(productResource, {
      name: "{id}",
      methods: [
        {
          methodType: "GET",
          handler: services.getProduct,
        },
        {
          methodType: "PUT",
          handler: services.editProduct,
        },
        {
          methodType: "DELETE",
          handler: services.deleteProduct,
        },
      ],
    });

    this.createEndpoints(apgw, {
      name: "seller_products",
      methods: [
        {
          methodType: "GET",
          handler: services.getSellerProducts,
        },
      ],
    });

    const categoryResource = this.createEndpoints(apgw, {
      name: "category",
      methods: [
        {
          methodType: "POST",
          handler: services.createCategory,
        },
        {
          methodType: "GET",
          handler: services.getCategories,
        },
      ],
    });

    this.addChildEndpoints(categoryResource, {
      name: "{id}",
      methods: [
        {
          methodType: "GET",
          handler: services.getCategory,
        },
        {
          methodType: "PUT",
          handler: services.editCategory,
        },
        {
          methodType: "DELETE",
          handler: services.deleteCategory,
        },
      ],
    });

    this.createEndpoints(apgw, {
      name: "deals",
      methods: [
        {
          methodType: "POST",
          handler: services.createDeals,
        },
      ],
    });

    this.createEndpoints(apgw, {
      name: "upload",
      methods: [
        {
          methodType: "POST",
          handler: services.imageUploader,
        },
      ],
    });

    this.createEndpoints(apgw, {
      name: "product-queue",
      methods: [
        {
          methodType: "POST",
          handler: services.messageQueueHandler,
        },
      ],
    });

    // this.createEndpoints(productService, apgw, {
    //   name: "product",
    //   methods: ["GET", "POST"],
    //   child: {
    //     name: "{id}",
    //     methods: ["GET", "PUT", "DELETE"],
    //   },
    // });

    // this.createEndpoints(categoryService, apgw, {
    //   name: "category",
    //   methods: ["GET", "POST"],
    //   child: {
    //     name: "{id}",
    //     methods: ["GET", "PUT", "DELETE"],
    //   },
    // });

    // this.createEndpoints(dealsService, apgw, {
    //   name: "deals",
    //   methods: ["GET", "POST"],
    //   child: {
    //     name: "{id}",
    //     methods: ["GET", "PUT", "DELETE"],
    //   },
    // });
    // this.createEndpoints(imageService, apgw, {
    //   name: "uploader",
    //   methods: ["GET"],
    // });

    // this.createEndpoints(queueService, apgw, {
    //   name: "products-queue",
    //   methods: ["POST"],
    // });
  }

  createEndpoints(resource: RestApi, { name, methods }: ResourceType) {
    const rootResource = resource.root.addResource(name);
    methods.map((item) => {
      const lambdaFunction = new LambdaIntegration(item.handler);
      rootResource.addMethod(item.methodType, lambdaFunction);
    });
    return rootResource;
  }

  addChildEndpoints(
    rootResource: aws_apigateway.Resource,
    { name, methods }: ResourceType
  ) {
    const ChildResource = rootResource.addResource(name);
    methods.map((item) => {
      const lambdaFunction = new LambdaIntegration(item.handler);
      ChildResource.addMethod(item.methodType, lambdaFunction);
    });
  }
}
