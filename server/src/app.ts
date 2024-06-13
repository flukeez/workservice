import "module-alias";
import fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import routes from "./route";
import { JWTMiddleware } from "./middlewares/JWTMiddleware";

const app = fastify({
  logger: false,
  bodyLimit: 90000001000,
});

app.addHook("preHandler", (request, reply, done) => {
  const method = request.raw.method;
  const url = request.raw.url;
  const ip = request.ip;
  console.log(`${ip} ${method} ${url}`);
  done();
});

app.addHook("preHandler", async (request, reply) => {
  const excludedPaths = ["/api/login", "/api/images"];
  if (excludedPaths.some((path) => request.url.startsWith(path))) {
    return;
  }
  await JWTMiddleware(request, reply);
});

app.register(cors, {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "X-Requested-With",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // allowedHeaders: ['Content-Type', 'Authorization'],
});

app.register(multipart, {
  addToBody: true,
});
app.register(fastifyJwt, {
  secret: process.env.SECRET_KEY!, // ตั้งค่า secret key
  sign: {
    expiresIn: "2h",
  },
});
app.register(fastifyCookie, {
  secret: "refresh_token",
  hook: "preHandler",
  parseOptions: {},
});

app.register(routes);

export default app;
