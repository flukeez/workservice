import { TumbolModel } from "@/models/TumbolModel";
import { FastifyInstance } from "fastify";

export default async function TumbolController(fastify: FastifyInstance) {
  const tumbolModel = new TumbolModel();
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const { result } = await tumbolModel.findMany(id);
    res.send({ rows: result });
  });
}
