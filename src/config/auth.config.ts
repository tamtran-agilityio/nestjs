export default () => ({
    secret: process.env.JWT_SECRET || 'defaultSecretKey',
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10),
});
