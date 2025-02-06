const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret key
        console.log("Decoded Token:", decoded); // Debugging log
        // Optionally, you can fetch the user from the database using decoded user ID
        // const user = await User.findById(decoded._id); 
        
        // For now, we'll just add the decoded data directly to the request
        req.user = decoded;  // Assuming the decoded JWT includes user information (like _id)

        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { verifyToken };
