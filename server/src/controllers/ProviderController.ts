import { FastifyInstance } from "fastify";
import ProviderModel from "@/models/ProviderModel";
import type { IProviderQuery } from "@/types/ProviderType";

export default async function ProviderController(fastify: FastifyInstance) {
  const providerModel = new ProviderModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IProviderQuery;
    const { result, totalItem, totalPage } = await providerModel.findMany(
      query
    );
    res.send({ rows: result, totalItem, totalPage });
  });
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await providerModel.findById(id);
    res.send(result);
  });
}
