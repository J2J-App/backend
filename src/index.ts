import 'dotenv/config'
import { PrismaClient } from '@prisma/client';
import {app, server} from './app'

const port = process.env.PORT || 6969;

export const prisma = new PrismaClient()

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
