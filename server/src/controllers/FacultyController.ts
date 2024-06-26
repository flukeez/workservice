import { FastifyInstance } from "fastify";
import { FacultyModel } from "@/models/FacultyModel";
import {
  IFacultyForm,
  IFacultyPosition,
  IFacultyQuery,
} from "@/types/FacultyType";

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
  //ตำแหน่งทั้งหมดในหน่วยงาน
  fastify.get("/org_chart/:fac_id", async (req, res) => {
    const { fac_id } = req.params as { fac_id: number };
    const query = req.query as IFacultyQuery;
    const { result, totalItem, totalPage, faculty_name } =
      await facultyModel.organizeChart(fac_id, query);
    res.send({ rows: result, totalItem, totalPage, faculty_name });
  });
  //ตำแหน่งเดียวในหน่วยงาน
  fastify.get("/org_chart/:fac_id/user/:user_id", async (req, res) => {
    const { fac_id, user_id } = req.params as {
      fac_id: number;
      user_id: number;
    };
    const result = await facultyModel.organizeChartPosition(fac_id, user_id);
    res.send(result);
  });
  fastify.post("/org_chart/create", async (req, res) => {
    console.log("test");
    const formData = req.body as IFacultyPosition;
    const result = await facultyModel.createPosition(formData);
    res.send(result);
  });
  fastify.put("/org_chart/update", async (req, res) => {
    const formData = req.body as IFacultyPosition;
    const result = await facultyModel.updatePosition(formData);
    res.send(result);
  });
  fastify.delete("/org_chart/del/:fac_id/user/:user_id", async (req, res) => {
    const { fac_id, user_id } = req.params as {
      fac_id: number;
      user_id: number;
    };
    const result = await facultyModel.deletePosition(fac_id, user_id);
    res.send(result);
  });
}
