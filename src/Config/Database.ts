import {createConnection, getConnection} from 'typeorm';
import dotenv from "dotenv";
import path from 'path';

if (process.env.NODE_ENV !== 'production') dotenv.config();
const databaseUri : string = process.env.DB_URI;

const Database = {
    create(){
      createConnection({
        type: "postgres",
        url: databaseUri,
        entities: [
          path.join(__dirname, '..', 'Components/*/*.entity.ts')
        ],
        synchronize: process.env.NODE_ENV !== 'production' ? true : false,
        dropSchema: process.env.NODE_ENV !== 'production' ? true : false,
        logging: false
    }).then( (connection) => {
        console.log('DB connected');
      })
    },

    async close(){
      await getConnection().close(); 
    },
  
    async clear(){
      const connection = getConnection();
      const entities = connection.entityMetadatas;
  
      entities.forEach(async (entity) => {
        const repository = connection.getRepository(entity.name);
        await repository.query(`DELETE FROM ${entity.tableName}`);
      });
    },
  };
  export default Database;