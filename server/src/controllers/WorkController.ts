import WorkModel from "@/models/WorkModel";
import { IUserToken } from "@/types/UserType";
import type { IWorkQuery } from "@/types/WorkType";
import { FastifyInstance } from "fastify";

export default async function WorkController(fastify: FastifyInstance) {
  const workModel = new WorkModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IWorkQuery;
    const { result, totalItem, totalPage } = await workModel.findMany(query);
    res.send({ rows: result, totalItem, totalPage });
  });
  fastify.get("/status/:status", async (req, res) => {
    const query = req.query as IWorkQuery;
    const params = req.params as { status: string };
    const status = params.status.split(",");
    const user = req.user as IUserToken;
    const { result, totalItem, totalPage } = await workModel.findManyByStatus(
      query,
      status,
      user.id
    );
    res.send({ rows: result, totalItem, totalPage });
  });
  //รับงานซ่อม
  fastify.get("/submit/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const user = req.user as IUserToken;
    let status = 0;
    //เช็คว่างานซ่อมมีคนรับไปยัง
    const validate = await workModel.checkStatus(id, 2);
    if (validate) {
      const { result } = await workModel.submitWork(id, user.id);
      status = result;
    }
    res.send(status);
  });
}
