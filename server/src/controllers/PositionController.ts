import { PositionModel } from "@/models/PositionModel";
import type { IPositionForm, IPositionQuery } from "@/types/PositionType";
import { FastifyInstance } from "fastify";

export default async function PositionController(fastify: FastifyInstance) {
  const positionModel = new PositionModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IPositionQuery;
    const { result, totalItem, totalPage } = await positionModel.findMany(
      query
    );
    res.send({ rows: result, totalItem, totalPage });
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await positionModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
    const data = req.body as IPositionForm;
    const result = await positionModel.createOne(data);
    res.send(result);
  });

  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IPositionForm;
    const result = await positionModel.update(id, data);
    res.send(result);
  });

  fastify.delete("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await positionModel.deleteOne(id);
    res.send(result);
  });

  fastify.get("/assign", async (req, res) => {
    const query = req.query as IPositionQuery;
    const { result, totalItem, totalPage } = await positionModel.positionAssign(
      query
    );
    res.send({ rows: result, totalItem, totalPage });
  });
}
