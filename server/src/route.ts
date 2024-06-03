import { FastifyInstance } from "fastify";

import CtypeController from "./controllers/CtypeController";
import CustomerController from "./controllers/CustomerController";
import FacultyController from "./controllers/FacultyController";
import IssueController from "./controllers/IssueController";
import PositionController from "./controllers/PositionController";
import PriorityController from "./controllers/PriorityController";
import StatusController from "./controllers/StatusController";
import UserController from "./controllers/UserController";
import ProvinceController from "./controllers/ProvinceController";
import AmphureController from "./controllers/AmphureController";
import TumbolController from "./controllers/TumbolController";
import ImageController from "./controllers/ImageController";

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
  fastify.register(IssueController, { prefix: "/api/issues" });
  fastify.register(PositionController, { prefix: "/api/positions" });
  fastify.register(PriorityController, { prefix: "/api/prioritys" });
  fastify.register(StatusController, { prefix: "/api/statuses" });
  fastify.register(UserController, { prefix: "/api/users" });
  fastify.register(ProvinceController, { prefix: "/api/provinces" });
  fastify.register(AmphureController, { prefix: "/api/amphures" });
  fastify.register(TumbolController, { prefix: "/api/tumbols" });
  fastify.register(ImageController, { prefix: "/api/images" });
};

export default routes;
