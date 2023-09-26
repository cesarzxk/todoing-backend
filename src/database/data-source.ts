import "reflect-metadata";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "src/database/data.db",
  synchronize: true,
  logging: false,
  entities: ["src/database/models/*.ts"],
  subscribers: [],
  migrations: ["src/database/migrations/*.ts"],
});

dataSource
  .initialize()
  .then(() => {
    console.log("🚀 Database initialized!🚀");
  })
  .catch((error) => console.log(error));
