import { FastifyInstance } from "fastify";
import type { ILoginForm } from "@/types/LoginType";
import { LoginModel } from "@/models/LoginModel";
import { getToken } from "@/utils/generatetoken";
import { setCookie } from "@/utils/setcokkie";

export default async function LoginController(fastify: FastifyInstance) {
  const loginModel = new LoginModel();
  fastify.post("/", async (req, res) => {
    const data = req.body as ILoginForm;
    const { result } = await loginModel.login(data);
    if (typeof result !== "number") {
      const key = process.env.SECRET_KEY!;
      const refresh_key = process.env.REFRESH_SECRET_KEY!;
      const token = getToken(result, key, "1h");
      const refresh_token = getToken(result, refresh_key, "2d");
      setCookie("refresh_token", refresh_token, res);
      res.send({ result: { token, refresh_token } });
    } else {
      res.send({ result });
    }
  });
}
