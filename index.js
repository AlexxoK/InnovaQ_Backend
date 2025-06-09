import { config } from 'dotenv';
import { initServer, createAdmin } from './configs/server.js';

config();

const initializeServer = async () => {

    await initServer();
    await createAdmin();

};

initializeServer();