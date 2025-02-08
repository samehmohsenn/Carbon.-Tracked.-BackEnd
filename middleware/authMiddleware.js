const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', ''); // extract token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token using the secret key
        // add the decoded data directly to the request
        req.user = decoded;  

        next();  // proceed
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { verifyToken };
