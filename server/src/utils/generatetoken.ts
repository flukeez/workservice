import jwt from "jsonwebtoken";
import type { ILogin } from "@/types/LoginType";

export const getToken = (data: ILogin, key: string, time: string) => {
  const token = jwt.sign(data, key, {
    expiresIn: time,
    algorithm: "HS256",
  });
  return token;
};
