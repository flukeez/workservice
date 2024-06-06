import { FastifyInstance } from "fastify";
import { EquipmentModel } from "@/models/EquipmentModel";
import type { IEquipmentForm, IEquipQuery } from "@/types/EquipmentType";
import { saveFile } from "@/utils/imagefile";

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
    const result = await equipmentModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
    let data = req.body as IEquipmentForm;
    const checkDuplicate = await equipmentModel.checkDuplicate(
      data.name,
      data.code,
      data.serial
    );
    if (checkDuplicate) {
      res.send({ result: 0 });
      return;
    }
    if (Array.isArray(data.image)) {
      const image = await saveFile("equipment", data.image[0]);
      data = { ...data, image: image };
    }
    const result = await equipmentModel.createOne(data);
    res.send(result);
  });
}
