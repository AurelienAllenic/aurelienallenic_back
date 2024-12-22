const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: "Vous avez atteint la limite d'appels pour cette heure.",
    keyGenerator: (req) => req.ip,
});

module.exports = limiter;
