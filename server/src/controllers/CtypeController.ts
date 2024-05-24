import { FastifyInstance } from "fastify";
import { CtypeModel } from "../models/CtypeModel";

export default async function CtypeController(fastify: FastifyInstance) {
  const ctypeModel = new CtypeModel();

  //ROUTE findAll
  fastify.get("/", async (request, reply) => {
    const query = request.query;
    const { results, totalItem, totalPage } = await ctypeModel.findMany(query);
    reply.send({ rows: results, totalItem, totalPage });
  });

  //ROUTE findById
  fastify.get("/:id", async (request, reply) => {
    const params: any = request.params;
    const id = params.id;

    const row = await ctypeModel.findById(id);

    reply.send({ row });
  });

  //ROUTE Create
  fastify.post("/", async (request, reply) => {
    const formData: any = request.body;

    const data = {
      name: formData.name,
    };

    const row = await ctypeModel.create(data);
    reply.send({ row });
  });

  //ROUTE Update
  fastify.patch("/:id", async (request, reply) => {
    const params: any = request.params;
    const id = params.id;
    const formData: any = request.body;

    const data = {
      name: formData.name,
    };

    const row = await ctypeModel.update(id, data);
    reply.send({ row });
  });

  //ROUTE Delete
  fastify.delete("/:id", async (request, reply) => {
    const params: any = request.params;
    const id = params.id;

    const row = await ctypeModel.delete(id);
    reply.send({ row });
  });
}
