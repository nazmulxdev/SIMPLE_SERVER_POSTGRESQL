import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeaders = req.headers.authorization;

      if (!authHeaders) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(
        authHeaders,
        config.jwt_secret as string,
      ) as JwtPayload;

      console.log({ decoded });

      if (!decoded) {
        return res.status(401).json({ message: "Invalid token." });
      }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(500).json({ message: "Unauthorized access." });
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
