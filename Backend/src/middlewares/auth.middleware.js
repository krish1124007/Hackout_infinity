import jwt from "jsonwebtoken";

// Middleware to check access token
export const verifyAccessToken = (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie or Authorization header
    let token = null;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken; // from cookies
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]; // from Bearer token
    }
   
    console.log(token)
    // 2️⃣ If no token
    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECERATE_TOKEN);

  

    // 4️⃣ Attach user data to req for next middleware / controller
    req.user = decoded;

    next(); // continue
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
