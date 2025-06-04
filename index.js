import { config } from 'dotenv';
import { initServer } from './configs/server.js';

config();

const initializeServer = async () => {

    await initServer();

};

initializeServer();