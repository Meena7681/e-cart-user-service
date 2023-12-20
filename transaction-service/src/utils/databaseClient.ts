import { Client } from "pg";

export const DBClient = () => {
  const client = new Client({
    host: "ec2-central-1.compute.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "users_service@2078",
    port: 5432,
  });
  console.log(client);
  return client;
};
