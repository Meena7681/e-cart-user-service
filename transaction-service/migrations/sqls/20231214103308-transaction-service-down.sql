ALTER TABLE IF EXISTS "order_items" DROP CONSTRAINT IF EXISTS "order_items_order_id_fkey";
DROP TABLE order_items;

ALTER TABLE IF EXISTS "orders" DROP CONSTRAINT IF EXISTS "orders_transaction_id_fkey";
DROP TABLE orders;

DROP TABLE transaction;