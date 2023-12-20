import * as AWS from "aws-sdk";

export const SendEmailUsingSES = async (to: string, message: string) => {
  var params = {
    Destination: {
      /*required */
      CcAddresses: [
        "codeagsd@gmail.com",
        /*more items */
      ],
      ToAddresses: [
        to,
        /* more items */
      ],
    },
    Message: {
      /*Requried */
      Body: {
        /*required */
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Test email",
      },
    },
    Source: "codeagsd@gmail.com" /*required */,
    ReplyToAddresses: [
      "codeagsd@gmail.com",
      /* more items */
    ],
  };
  const sesService = new AWS.SES({ apiVersion: "2010-12-01" });
  await sesService.sendEmail(params).promise();
};

// import sendgrid from "@sendgrid/mail";

// const SENDGRID_API_KEY = "SG.Xxxxxxxxxxxxxxxxxxx";

// const FROM_EMAIL = "support@email.com";
// const TEMP_ORDER_CONFIRMATION = "";

// sendgrid.setApiKey(SENDGRID_API_KEY);

// export interface EmailTemplate {
//   to: string;
//   from: string;
//   templateId: string;
//   dynamic_template_data: Record<string, unknown>;
// }

// export const ORDER_CONFIRMATION = (
//   email: string,
//   firstName: string,
//   orderNumber: string
// ): EmailTemplate => {
//   return {
//     from: FROM_EMAIL,
//     to: email,
//     dynamic_template_data: {
//       name: firstName,
//       order_number: orderNumber,
//     },
//     templateId: TEMP_ORDER_CONFIRMATION,
//   };
// };

// export const SendEmail = async (template: EmailTemplate) => {
//   try {
//     await sendgrid.send(template);
//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };
