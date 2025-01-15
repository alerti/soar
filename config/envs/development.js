module.exports = {
    NODE_ENV: 'local',
    SERVICE_NAME: 'school_management',
    MONGO_URI: "mongodb+srv://soar:soar@soar.u5yjg.mongodb.net/?retryWrites=true&w=majority&appName=soar",
    CACHE_PREFIX: 'cache_prefix',
    CACHE_REDIS: 'redis://default:HGOy88PiHXPaDpqjZTvdlddjC2kaD2U6@redis-14769.c278.us-east-1-4.ec2.redns.redis-cloud.com:14769',
    CORTEX_PREFIX: 'cortex_prefix',
    CORTEX_REDIS: 'redis://default:HGOy88PiHXPaDpqjZTvdlddjC2kaD2U6@redis-14769.c278.us-east-1-4.ec2.redns.redis-cloud.com:14769',
    CORTEX_TYPE: 'type',
    JWT_SECRET: 'soar-technical-school-management-secret',
    LONG_TOKEN_SECRET: 'long_token_secret',
    SHORT_TOKEN_SECRET: 'short_token_secret',
    NACL_SECRET: 'nacl_secret',
    USER_PORT: 3000,
    RATE_LIMIT_WINDOW_IN_MINUTES: 15,
    RATE_LIMIT_MAX_REQUESTS: 100
};