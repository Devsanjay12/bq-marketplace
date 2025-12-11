// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "10 s"),
//   analytics: true,
//   /**
//    * Optional prefix for the keys used in redis. This is useful if you want to share a redis
//    * instance with other applications and want to avoid key collisions. The default prefix is
//    * "@upstash/ratelimit"
//    */
//   prefix: "@upstash/ratelimit",
// });

// Simple in-memory rate limiter for zero-cost MVP if Redis is not available
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
    // If Upstash env vars are present, use Upstash (commented out for now to ensure zero-cost default)
    // if (process.env.UPSTASH_REDIS_REST_URL) { ... }

    const now = Date.now();
    const record = rateLimitMap.get(identifier) || { count: 0, lastReset: now };

    if (now - record.lastReset > windowMs) {
        record.count = 0;
        record.lastReset = now;
    }

    record.count += 1;
    rateLimitMap.set(identifier, record);

    return {
        success: record.count <= limit,
        limit,
        remaining: Math.max(0, limit - record.count),
        reset: record.lastReset + windowMs,
    };
}
