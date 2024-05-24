import { FastifyInstance } from "fastify";

import CtypeController from "./controllers/CtypeController";
import CustomerController from "./controllers/CustomerController";
import FacultyController from "./controllers/FacultyController";

const routes = async (fastify: FastifyInstance) => {
  //DEFAULT ROUTE
  fastify.get("/", async (request, reply) => {
    return "Hello World!";
  });

  //DEFAULT ROUTE
  fastify.get("/api", async (request, reply) => {
    return "Hello API";
  });

  fastify.register(CtypeController, { prefix: "/api/ctypes" });
  fastify.register(CustomerController, { prefix: "/api/customers" });
  fastify.register(FacultyController, { prefix: "/api/facultys" });
};

export default routes;
