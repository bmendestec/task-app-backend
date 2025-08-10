import Redis from "ioredis";
import 'dotenv/config';

const { REDIS_URL } = process.env;

const redisUrl = REDIS_URL || 'redis://127.0.0.1:6379';

const redis = new Redis(redisUrl);
redis.on('connect', () => console.log('Redis conectado'));
redis.on('error', (err) => console.error('Redis error', err));

export default redis;