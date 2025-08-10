import Redis from "ioredis";
import 'dotenv/config';

const { REDIS_URL } = process.env;

if (!REDIS_URL) {
    throw new Error("REDIS_URL não está definido nas variáveis de ambiente.");
}

const redis = new Redis(REDIS_URL + '?family=0');

export default redis;