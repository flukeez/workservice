import { FastifyInstance } from "fastify";
import type { ILoginForm } from "@/types/LoginType";
import { LoginModel } from "@/models/LoginModel";
import { setCookie } from "@/utils/setcookie";

export default async function LoginController(fastify: FastifyInstance) {
  const loginModel = new LoginModel();
  fastify.post("/", async (req, res) => {
    const data = req.body as ILoginForm;
    const { result } = await loginModel.login(data);
    if (typeof result !== "number") {
      const refresh_key = process.env.REFRESH_SECRET_KEY!;
      const token = fastify.jwt.sign(result);
      const refresh_token = fastify.jwt.sign(result, {
        expiresIn: "1d",
        key: refresh_key,
      });
      setCookie("refresh_token", refresh_token, res);
      res.send({ result: { token } });
    } else {
      res.send({ result });
    }
  });
  fastify.post("/refresh", async (req, res) => {
    const unsignedCookie = req.cookies["refresh_token"] as string;
    const cookie = req.unsignCookie(unsignedCookie);
    const refreshToken = cookie.value;
    try {
      const refresh_key = process.env.REFRESH_SECRET_KEY as string;
      if (!refreshToken) {
        return res.status(401).send("Refresh token is required.");
      }
      const result = fastify.jwt.verify(refreshToken, {
        key: refresh_key,
      });
      const secret_key = process.env.SECRET_KEY as string;
      const token = fastify.jwt.sign(result, {
        expiresIn: "2h",
        key: secret_key,
      });
      res.send({ token });
    } catch (error) {
      res.status(401).send("Refresh token expired or invalid.");
    }
  });
}
