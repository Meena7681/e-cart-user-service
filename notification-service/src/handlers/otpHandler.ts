import { SQSEvent } from "aws-lambda";
import { AppValidationError } from "../utility/errors";
import { plainToClass } from "class-transformer";
import { OTPInput } from "../dto/otpdto";
import { SendVerificationCode } from "../providers/sms";

export const CustomerOTPEmailHandler = async (event: SQSEvent) => {
  const response: Record<string, unknown>[] = [];
  const promisses = event.Records.map(async (record) => {
    const input = plainToClass(OTPInput, JSON.parse(record.body));
    const errors = await AppValidationError(input);
    console.log("ERRORS: ", JSON.stringify(errors));

    if (!errors) {
      const { phone, code } = input;
      await SendVerificationCode(Number(code), phone.trim());
    } else {
      response.push({ error: JSON.stringify(errors) });
    }
  });

  await Promise.all(promisses);
  console.log("SQS response: ", response);
  return { response };
};
