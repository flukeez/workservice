import { FastifyInstance } from "fastify";

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
import CategoryController from "./controllers/CategoryController";
import EquipStatusController from "./controllers/EquipStatusController";
import EquipmentController from "./controllers/EquipmentController";

const routes = async (fastify: FastifyInstance) => {
  //DEFAULT ROUTE
  fastify.get("/", async (request, reply) => {
    return "Hello World!";
  });

  //DEFAULT ROUTE
  fastify.get("/api", async (request, reply) => {
    return "Hello API";
  });

  fastify.register(CustomerController, { prefix: "/api/customers" });
  fastify.register(FacultyController, { prefix: "/api/facultys" });
  fastify.register(IssueController, { prefix: "/api/issues" });
  fastify.register(PositionController, { prefix: "/api/positions" });
  fastify.register(PriorityController, { prefix: "/api/prioritys" });
  fastify.register(StatusController, { prefix: "/api/statuses" });
  fastify.register(CategoryController, { prefix: "/api/categories" });
  fastify.register(EquipStatusController, { prefix: "/api/equip_statues" });
  fastify.register(UserController, { prefix: "/api/users" });
  fastify.register(EquipmentController, { prefix: "/api/equipments" });
  fastify.register(ProvinceController, { prefix: "/api/provinces" });
  fastify.register(AmphureController, { prefix: "/api/amphures" });
  fastify.register(TumbolController, { prefix: "/api/tumbols" });
  fastify.register(ImageController, { prefix: "/api/images" });
};

export default routes;
