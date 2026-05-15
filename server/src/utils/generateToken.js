import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
    return jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '30m' }
    );
};

export const createRefreshToken = (user) => {
    return jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '1d' }
    );
};

export const isTokenValid = (token, secret = process.env.ACCESS_TOKEN_SECRET) => {
    return jwt.verify(token, secret);
};

export const verifyToken = (req, res, next) => {
    try {
        /* 
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
            return res.status(401).json({ message: "Invalid Authorization header format. Use 'Bearer <token>'" });
        }

        const token = parts[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied" });
        }

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decodedToken = isTokenValid(token);

        req.user = decodedToken; // attach user data
        next();
        */
       const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "No access token found",
            });
        }

        const decoded = isTokenValid(accessToken)
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};