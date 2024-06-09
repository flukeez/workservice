import { FastifyReply } from "fastify";

export const setCookie = (
  name: string,
  cookie: string,
  reply: FastifyReply
) => {
  return reply.setCookie(name, cookie, {
    // domain: "",
    path: "/",
    signed: true,
    sameSite: "lax", // หรือ "None" ถ้าใช้ HTTPS
    secure: false, // true หากใช้ HTTPS
    httpOnly: true, // true สำหรับป้องกันการเข้าถึงจากฝั่ง client-side
  });
};
