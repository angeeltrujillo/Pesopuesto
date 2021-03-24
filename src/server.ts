import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import app from "./Config/Express"

if (process.env.NODE_ENV !== 'production') dotenv.config(); 

const port : string = process.env.PORT || '5000';
const databaseUri : string = process.env.DB_URI;

createConnection({
    type: "postgres",
    url: databaseUri,
    entities: [
        __dirname + '/Components/*/*.entity.ts'
    ],
    synchronize: process.env.NODE_ENV !== 'production' ? true : false,
    logging: false
}).then(connection => {
    console.log("Conectado a la base de datos")
}).catch(error => console.log(error));

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});