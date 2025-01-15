const crypto = require('crypto');

module.exports = {
    // NODE_ENV: 'local',
    // SERVICE_NAME: 'school_management_api',
    // MONGO_URI: 'mongodb://localhost:27017/school_management_db',
    // CACHE_PREFIX: 'cache_prefix',
    // CACHE_REDIS: 'redis://localhost:6379',
    // CORTEX_PREFIX: 'cortex_prefix',
    // CORTEX_REDIS: 'redis://localhost:6379',
    // CORTEX_TYPE: 'type',
    // JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    // LONG_TOKEN_SECRET: 'long_token_secret',
    // SHORT_TOKEN_SECRET: 'short_token_secret',
    // NACL_SECRET: 'nacl_secret',
    // USER_PORT: 3000,

    NODE_ENV: 'local',
    SERVICE_NAME: 'school_management_api_test',
    MONGO_URI: "mongodb+srv://soar:soar@soar.u5yjg.mongodb.net/?retryWrites=true&w=majority&appName=soar",
    CACHE_PREFIX: 'cache_prefix_test',
    CACHE_REDIS: 'redis://:HGOy88PiHXPaDpqjZTvdlddjC2kaD2U6@redis-14769.c278.us-east-1-4.ec2.redns.redis-cloud.com:14769',
    CORTEX_PREFIX: 'cortex_prefix_test',
    CORTEX_REDIS: 'redis://:HGOy88PiHXPaDpqjZTvdlddjC2kaD2U6@redis-14769.c278.us-east-1-4.ec2.redns.redis-cloud.com:14769',
    CORTEX_TYPE: 'type_test',
    JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    LONG_TOKEN_SECRET: 'long_token_secret_test',
    SHORT_TOKEN_SECRET: 'hort_token_secret_test',
    NACL_SECRET: 'nacl_secret_test',
    USER_PORT: 3000,
    RATE_LIMIT_WINDOW_IN_MINUTES: 15,
    RATE_LIMIT_MAX_REQUESTS: 100
};
