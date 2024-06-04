import { FastifyInstance } from "fastify";
import { EquipStatusModel } from "@/models/EquipStatusModel";
import type {
  IEquipStatusForm,
  IEquipStatusQuery,
} from "@/types/EquipStatusType";

export default async function EquipStatusController(fastify: FastifyInstance) {
  const equipStatusModel = new EquipStatusModel();

  fastify.get("/", async (req, res) => {
    const query = req.query as IEquipStatusQuery;
    const { result, totalPage, totalItem } = await equipStatusModel.findMany(
      query
    );
    res.send({ rows: result, totalPage, totalItem });
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await equipStatusModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
    const data = req.body as IEquipStatusForm;
    const result = await equipStatusModel.createOne(data);
    res.send(result);
  });

  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IEquipStatusForm;
    const result = await equipStatusModel.update(id, data);
    res.send(result);
  });

  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await equipStatusModel.deleteOne(id);
    res.send(result);
  });
}
