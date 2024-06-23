import { FastifyInstance } from "fastify";
import { IFacultyPosition, IFacultyQuery } from "@/types/FacultyType";
import { UserPositionModel } from "@/models/UserPositionModel";

export default async function UserPositionController(fastify: FastifyInstance) {
  const userPositionModel = new UserPositionModel();
  //ตำแหน่งทั้งหมดในหน่วยงาน
  fastify.get("/faculty/:fac_id", async (req, res) => {
    const { fac_id } = req.params as { fac_id: number };
    const query = req.query as IFacultyQuery;
    const { result, totalItem, totalPage } = await userPositionModel.findMany(
      fac_id,
      query
    );
    res.send({ rows: result, totalItem, totalPage });
  });
  //ตำแหน่งเดียวในหน่วยงาน
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as {
      id: number;
    };
    const result = await userPositionModel.findById(id);
    res.send(result);
  });
  fastify.post("/create", async (req, res) => {
    const formData = req.body as IFacultyPosition;
    const result = await userPositionModel.create(formData);
    res.send(result);
  });
  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as {
      id: number;
    };
    const formData = req.body as IFacultyPosition;
    const result = await userPositionModel.update(id, formData);
    res.send(result);
  });
  fastify.delete("/:id", async (req, res) => {
    const { id } = req.params as {
      id: number;
    };
    const result = await userPositionModel.delete(id);
    res.send(result);
  });
}
