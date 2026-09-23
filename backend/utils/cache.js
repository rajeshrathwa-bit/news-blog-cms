const NodeCache = require('node-cache');

// Shared in-memory cache (1 hour TTL) for frequently reused site data.
const cache = new NodeCache();

module.exports = cache;
