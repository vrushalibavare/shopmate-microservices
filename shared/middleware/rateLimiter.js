// Enhanced rate limiting middleware with resource protection
const rateLimit = (windowMs, max) => {
  const requests = new Map();
  const MAX_IPS = 10000;
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (requests.size >= MAX_IPS && !requests.has(key)) {
      const oldestKey = requests.keys().next().value;
      requests.delete(oldestKey);
    }
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= max) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    if (Math.random() < 0.05) {
      let cleaned = 0;
      for (const [ip, times] of requests.entries()) {
        const validTimes = times.filter(time => time > windowStart);
        if (validTimes.length === 0) {
          requests.delete(ip);
          cleaned++;
        } else {
          requests.set(ip, validTimes);
        }
      }
      
      if (cleaned > 0) {
        console.log(`Rate limiter cleaned ${cleaned} expired entries. Active IPs: ${requests.size}`);
      }
    }
    
    next();
  };
};

module.exports = { rateLimit };