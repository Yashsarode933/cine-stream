import NodeCache from 'node-cache';

// Default cache TTL is 30 minutes (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

export const cacheMiddleware = (durationSec = 1800) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }

    // Override res.json to intercept and cache the response data
    res.originalJson = res.json;
    res.json = (body) => {
      if (res.statusCode === 200) {
        cache.set(key, body, durationSec);
      }
      res.originalJson(body);
    };

    next();
  };
};

export { cache };
