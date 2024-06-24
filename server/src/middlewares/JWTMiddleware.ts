import type { FastifyReply, FastifyRequest } from "fastify";

export async function JWTMiddleware(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "Authorization token expired":
          return res.status(401).send("Token expired. Please login again.ผผ");
        case "invalid token":
        case "jwt malformed":
        case "jwt signature is required":
          return res.status(400).send("Invalid token.");
        default:
          console.log("Unexpected error:", error);
          console.log("test");
          return res.status(500).send("Unexpected error.");
      }
    } else {
      console.log("Error is not an instance of Error.");
      return res.status(500).send("Unknown error.");
    }
  }
}
