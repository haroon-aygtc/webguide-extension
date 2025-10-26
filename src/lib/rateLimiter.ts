import Redis from 'ioredis';
import logger from './logger';

// Redis configuration
const REDIS_CONFIG = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined
};

// Create Redis client
const redis = new Redis(REDIS_CONFIG);

redis.on('error', (err) => {
    logger.error({ err }, 'Redis client error');
});

// Redis-based token bucket rate limiter
export async function allowRequest(key: string, capacity = 60, refillPerSec = 1): Promise<boolean> {
    const now = Date.now();
    const bucketKey = `ratelimit:${key}`;

    try {
        // Using Redis multi to ensure atomic operations
        const result = await redis.multi()
            .hgetall(bucketKey)
            .pexpire(bucketKey, 24 * 60 * 60 * 1000) // Expire after 24 hours
            .exec();

        if (!result) {
            throw new Error('Redis transaction failed');
        }

        const [bucketResult] = result;
        if (bucketResult[0]) {
            throw bucketResult[0];
        }

        const bucket = bucketResult[1] as any;
        const tokens = Number(bucket.tokens) || capacity;
        const last = Number(bucket.last) || now;

        const deltaSec = (now - last) / 1000;
        const newTokens = Math.min(capacity, tokens + deltaSec * refillPerSec);

        if (newTokens >= 1) {
            await redis.hmset(bucketKey, {
                tokens: newTokens - 1,
                last: now
            });
            return true;
        }

        await redis.hmset(bucketKey, {
            tokens: newTokens,
            last: now
        });
        return false;
    } catch (err) {
        logger.error({ err, key }, 'Rate limiter error');
        // Fail open in production, fail closed in development
        return process.env.NODE_ENV === 'production';
    }
}

export async function resetLimiter(key: string): Promise<void> {
    try {
        await redis.del(`ratelimit:${key}`);
    } catch (err) {
        logger.error({ err, key }, 'Error resetting rate limiter');
    }
}
