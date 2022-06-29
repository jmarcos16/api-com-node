import { req, res, next } from "express";
import jwt from "jsonwebtoken";

async function UserAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Access denied" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Invalid Token" });
  }
}

export default UserAuth;
