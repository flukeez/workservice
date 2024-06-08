import "module-alias";
import fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyCookie from "@fastify/cookie";

import cors from "@fastify/cors";
import routes from "./route";

const app = fastify({
  logger: false,
  bodyLimit: 90000001000,
});

// ฮุก onRequest จะทำงานเมื่อได้รับคำขอ
//เอาไว้แสดงเฉยๆเวลามีการ call api
app.addHook("onRequest", (request, reply, done) => {
  const method = request.raw.method; // HTTP method
  const url = request.raw.url; // URL path
  console.log(`${method} ${url}`);
  done(); // เรียก done() เพื่อดำเนินการต่อ
});

app.register(cors, {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization'],
});
app.register(multipart, {
  addToBody: true,
});
app.register(fastifyCookie, {
  secret: "test",
});
app.register(routes);
export default app;
