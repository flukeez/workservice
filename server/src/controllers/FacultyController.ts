import { FastifyInstance } from "fastify";
import { FacultyModel } from "@/models/FacultyModel";
import { IFacultyForm, IFacultyQuery } from "@/types/FacultyType";

export default async function FacultyController(fastify: FastifyInstance) {
  const facultyModel = new FacultyModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IFacultyQuery;
    const { result, totalItem, totalPage } = await facultyModel.findMany(query);
    res.send({ rows: result, totalItem, totalPage });
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await facultyModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
    const formData = req.body as IFacultyForm;
    const result = await facultyModel.createOne(formData);
    res.send(result);
  });

  fastify.patch("/:id", async (req, res) => {
    const formData = req.body as IFacultyForm;
    const { id } = req.params as { id: number };
    const result = await facultyModel.update(id, formData);
    res.send(result);
  });

  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await facultyModel.deleteOne(id);
    res.send(result);
  });
}
