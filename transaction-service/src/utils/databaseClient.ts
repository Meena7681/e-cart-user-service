import { Client } from "pg";

export const DBClient = () => {
  const client = new Client({
    host: "ec2-3-64-216-132.eu-central-1.compute.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "user_service@2023",
    port: 5432,
  });
  console.log(client);
  return client;
};
