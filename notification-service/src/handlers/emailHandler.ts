import { SQSEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { SendEmailUsingSES } from "../providers/email";
import { EmailInput } from "../dto/emaildto";

export const CustomerEmailHandler = async (event: SQSEvent) => {
  const response: Record<string, unknown>[] = [];
  console.log("Email handler");
  const promisses = event.Records.map(async (record) => {
    const input = plainToClass(EmailInput, JSON.parse(record.body));
    const errors = await AppValidationError(input);
    console.log("ERRORS: ", JSON.stringify(errors));

    if (!errors) {
      const { to, name, order_number } = input;
      const emailBody = `Dear Mr. ${name}, thank ksgsdgsd dfssdgdgdg gds your order-Number:- ${order_number}`;
      await SendEmailUsingSES(to, emailBody);
      // const OrderTemplate = ORDER_CONFIRMATION(to,name,order_number);
      // await SendEmail(OrderTemplate);
    } else {
      response.push({ error: JSON.stringify(errors) });
    }
  });

  await Promise.all(promisses);
  console.log("SQS response: ", response);
  return {};
};
