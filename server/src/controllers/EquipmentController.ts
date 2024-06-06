import { EquipmentModel } from "@/models/EquipmentModel";
import type { IEquipQuery } from "@/types/EquipmentType";
import { FastifyInstance } from "fastify";

export default async function EquipmentController(fastify: FastifyInstance) {
  const equipmentModel = new EquipmentModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IEquipQuery;
    const { result, totalItem, totalPage } = await equipmentModel.findMany(
      query
    );
    res.send({ rows: result, totalItem, totalPage });
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const { result } = await equipmentModel.findById(id);
    res.send(result);
  });
}
