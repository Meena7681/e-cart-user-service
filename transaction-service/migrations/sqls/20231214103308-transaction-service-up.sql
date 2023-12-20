CREATE TABLE "transactions" (
    "id" bigserial PRIMARY KEY,
    "amount" integer NOT NULL,
    "amount_received" integer,
    "capture_method" varchar,
    "created" integer,
    "currency" varchar,
    "customer" varchar,
    "payment_id" varchar UNIQUE NOT NULL,
    "payment_method" varchar,
    "payment_method_types" varchar,
    "status" varchar,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "orders" (
    "id" bigserial PRIMARY KEY,
    "user_id" integer NOT NULL,
    "status" varchar NOT NULL,
    "amount" integer NOT NULL,
    "transaction_id" integer NOT NULL,
    "order_ref_id" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now());
    "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "orders" ("order_ref_id");
ALTER TABLE "orders" ADD FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id");

CREATE TABLE "order_items" (
    "id" bigserial PRIMARY KEY,
    "order_id" integer NOT NULL,
    "product_id" varchar NOT NULL,
    "name" varchar NOT NULL,
    "image_url" varchar NOT NULL,
    "price" integer NOT NULL,
    "item_qty" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
    "updated_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");