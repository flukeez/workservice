import { FastifyInstance } from "fastify";
import { CategoryModel } from "@/models/CategoryModel";
import type { ICategoryForm, ICategoryQuery } from "@/types/CategoryType";

export default async function CategoryController(fastify: FastifyInstance) {
  const categoryModel = new CategoryModel();

  fastify.get("/", async (req, res) => {
    const query = req.query as ICategoryQuery;
    const { result, totalPage, totalItem } = await categoryModel.findMany(
      query
    );
    res.send({ rows: result, totalPage, totalItem });
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await categoryModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
    const data = req.body as ICategoryForm;
    const result = await categoryModel.createOne(data);
    res.send(result);
  });

  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as ICategoryForm;
    const result = await categoryModel.update(id, data);
    res.send(result);
  });

  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await categoryModel.deleteOne(id);
    res.send(result);
  });
}
