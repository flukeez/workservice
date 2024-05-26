import { PriorityModel } from "@/models/PriorityModel";
import { IPriorityForm, IPriorityQuery } from "@/types/PriorityType";
import { FastifyInstance } from "fastify";

export default async function PriorityController(fastify: FastifyInstance) {
  const priorityModel = new PriorityModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IPriorityQuery;
    const { result, totalItem, totalPage } = await priorityModel.findMany(
      query
    );
    res.send({ rows: result, totalItem, totalPage });
  });
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await priorityModel.findById(id);
    res.send(result);
  });
  fastify.post("/create", async (req, res) => {
    const data = req.body as IPriorityForm;
    const result = await priorityModel.createOne(data);
    res.send(result);
  });
  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IPriorityForm;
    const result = await priorityModel.update(id, data);
    res.send(result);
  });
  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await priorityModel.deleteOne(id);
    res.send(result);
  });
}
