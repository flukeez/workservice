import { FastifyInstance } from "fastify";
import { StatusModel } from "@/models/StatusModel";
import type { IStatusForm, IStatusQuery } from "@/types/StatusType";

export default async function StatusController(fastify: FastifyInstance) {
  const statusModel = new StatusModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IStatusQuery;
    const { result, totalItem, totalPage } = await statusModel.findMany(query);
    res.send({ rows: result, totalItem, totalPage });
  });
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await statusModel.findById(id);
    res.send(result);
  });
  fastify.post("/create", async (req, res) => {
    const data = req.body as IStatusForm;
    const result = await statusModel.createOne(data);
    res.send(result);
  });
  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IStatusForm;
    const result = await statusModel.update(id, data);
    res.send(result);
  });
  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await statusModel.deleteOne(id);
    res.send(result);
  });
}
