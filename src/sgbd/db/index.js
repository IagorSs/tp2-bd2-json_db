import { JsonDB, Config } from 'node-json-db';

const __dirname = import.meta.dirname;

const db = new JsonDB(new Config(`${__dirname}/db`, true, true));

export default db;
