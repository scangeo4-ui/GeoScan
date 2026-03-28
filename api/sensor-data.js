const { Redis } = require('@upstash/redis');

// This file is a Vercel Serverless Function handler.
// It requires two environment variables (set in Vercel project settings):
// - UPSTASH_REDIS_REST_URL
// - UPSTASH_REDIS_REST_TOKEN

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const data = req.body;
      if (!data) return res.status(400).json({ error: 'Missing JSON body' });

      // push newest reading to the head of list and trim to last 200
      await redis.lpush('sensorData', JSON.stringify(data));
      await redis.ltrim('sensorData', 0, 199);

      return res.status(200).json({ status: 'ok' });
    }

    if (req.method === 'GET') {
      // return last N entries (0..N-1 are newest)
      const limit = parseInt(req.query.limit || '10', 10);
      const items = await redis.lrange('sensorData', 0, limit - 1);
      const parsed = items.map(i => {
        try { return JSON.parse(i); } catch (e) { return i; }
      });
      return res.status(200).json(parsed);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
