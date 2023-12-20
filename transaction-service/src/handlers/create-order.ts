import { SQSEvent } from "aws-lambda";
import { DBOperation } from "./db-operation";
import { RawOrderInput } from "../dto/input";
import { ValidatorError } from "../utils/errors";
import { plainToClass } from "class-transformer";

const dbOperation = new DBOperation();

export const createOrderHandler = async (event: SQSEvent) => {
  const orderResponse: Record<string, unknown>[] = [];

  const promisses = event.Records.map(async (record) => {
    const input = plainToClass(RawOrderInput, JSON.parse(record.body));
    const errors = await ValidatorError(input);

    console.log("ERRORS:", JSON.stringify(errors));

    if (!errors) {
      const {
        amount,
        amount_received,
        capture_method,
        created,
        currency,
        customer,
        id,
        payment_method,
        payment_method_types,
        status,
      } = input.transaction;
      // create transaction
      const transactionQuery = `INSERT INTO transactions(
      amount,
      amount_received,
      capture_method,
      created,
      currency,
      customer,
      payment_id,
      payment_method,
      payment_method_types,
      status
     )VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;

      const transactionValues = [
        amount,
        amount_received,
        capture_method,
        created,
        currency,
        customer,
        id,
        payment_method,
        payment_method_types.toString(),
        status,
      ];

      const transactionResult = await dbOperation.executeQuery(
        transactionQuery,
        transactionValues
      );

      if (
        transactionResult.rowCount !== null ||
        transactionResult.rowCount !== 0
      ) {
        const transaction_id = transactionResult.rows[0].id;
        const order_ref_number = Math.floor(10000 + Math.random() * 900000);
        const status = "received";
        //create order
        const orderQuery = `INSERT INTO orders(
       user_id,
       status,
       amount,
       transaction_id,
       order_ref_id
     ) VALUES($1,$2,$3,$4,$5) RETURNING *`;

        const orderValues = [
          Number(input.userId),
          status,
          amount,
          transaction_id,
          order_ref_number,
        ];

        const orderResult = await dbOperation.executeQuery(
          orderQuery,
          orderValues
        );
        const orderId = orderResult.rows[0].id;

        //create order items
        if (Array.isArray(input.items)) {
          let itemInsertPromise = Array();
          input.items.map((item) => {
            const orderItemQuery = `INSERT INTO order_items(
          order_id,
          product_id,
          name,
          image_url,
          price,
          item_qty
        ) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`;

            const orderItemValues = [
              orderId,
              item.product_id,
              item.name,
              item.image_url,
              Number(item.price),
              item.item_qty,
            ];

            itemInsertPromise.push(
              dbOperation.executeQuery(orderItemQuery, orderItemValues)
            );
          });
          await Promise.all(itemInsertPromise);
        }
      }
    } else {
      orderResponse.push({ error: JSON.stringify(errors) });
    }
  });
  await Promise.all(promisses);

  return { orderResponse };
};
