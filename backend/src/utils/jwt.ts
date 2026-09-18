import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};