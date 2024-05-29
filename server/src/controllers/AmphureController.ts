import { AmphureModel } from "@/models/AmphureModel";
import { FastifyInstance } from "fastify";

export default async function AmphureController(fastify: FastifyInstance) {
  const amphureModel = new AmphureModel();
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const { result } = await amphureModel.findMany(id);
    res.send({ rows: result });
  });
}
