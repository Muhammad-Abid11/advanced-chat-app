import jwt from "jsonwebtoken";

export const createJWT = (user) => {
    return jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES || '7d' }
    );
};

export const isTokenValid = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
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
       const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "No token found",
            });
        }

        const decoded = isTokenValid(token)
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};