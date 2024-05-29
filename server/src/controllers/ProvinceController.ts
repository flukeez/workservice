import { ProvinceModel } from "@/models/ProvinceModel";
import { FastifyInstance } from "fastify";

export default async function ProvinceController(fastify: FastifyInstance) {
  const provinceModel = new ProvinceModel();
  fastify.get("/", async (req, res) => {
    const { result } = await provinceModel.findMany();
    res.send({ rows: result });
  });
}
