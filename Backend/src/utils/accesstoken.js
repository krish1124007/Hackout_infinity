import jwt from "jsonwebtoken";

export function generateAccessToken(payload)
{
    return jwt.sign(payload,process.env.JWT_SECERATE_TOKEN , {expiresIn:process.env.JWT_EXPIRE})
}

