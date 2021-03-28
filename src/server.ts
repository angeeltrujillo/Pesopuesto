import "reflect-metadata";
import Database from "./Config/Database";
import dotenv from "dotenv";
import app from "./Config/Express"

if (process.env.NODE_ENV !== 'production') dotenv.config();

const port : string = process.env.PORT || '5000';

Database.create();

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});