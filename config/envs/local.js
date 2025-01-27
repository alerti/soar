const crypto = require('crypto');

module.exports = {
    NODE_ENV: 'local',
    SERVICE_NAME: 'school_management_api',
    MONGO_URI: process.env.MONGO_URI,
    CACHE_PREFIX: 'cache_prefix_test',
    CACHE_REDIS: process.env.CACHE_REDIS,
    CORTEX_PREFIX: 'cortex_prefix_test',
    CORTEX_REDIS: process.env.CORTEX_REDIS,
    CORTEX_TYPE: 'type',
    JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    LONG_TOKEN_SECRET: process.env.LONG_TOKEN_SECRET,
    SHORT_TOKEN_SECRET: process.env.SHORT_TOKEN_SECRET,
    NACL_SECRET: process.env.NACL_SECRET,
    USER_PORT: process.env.USER_PORT || 30001,
    RATE_LIMIT_WINDOW_IN_MINUTES: 15,
    RATE_LIMIT_MAX_REQUESTS: 100
};
