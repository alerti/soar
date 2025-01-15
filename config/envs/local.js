const crypto = require('crypto');

module.exports = {
    NODE_ENV: 'local',
    SERVICE_NAME: 'school_management_api',
    MONGO_URI: 'mongodb://localhost:27017/school_management_db',
    CACHE_PREFIX: 'cache_prefix',
    CACHE_REDIS: 'redis://localhost:6379',
    CORTEX_PREFIX: 'cortex_prefix',
    CORTEX_REDIS: 'redis://localhost:6379',
    CORTEX_TYPE: 'type',
    JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    LONG_TOKEN_SECRET: 'long_token_secret',
    SHORT_TOKEN_SECRET: 'short_token_secret',
    NACL_SECRET: 'nacl_secret',
    USER_PORT: 3000,
    RATE_LIMIT_WINDOW_IN_MINUTES: 15,
    RATE_LIMIT_MAX_REQUESTS: 100
};
