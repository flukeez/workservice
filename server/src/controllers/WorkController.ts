import WorkModel from "@/models/WorkModel";
import { IUserToken } from "@/types/UserType";
import type { IWorkForm, IWorkQuery } from "@/types/WorkType";
import { saveFile } from "@/utils/imagefile";
import { FastifyInstance } from "fastify";

export default async function WorkController(fastify: FastifyInstance) {
  const workModel = new WorkModel();
  //งานซ่อมรอดำเนินการ
  fastify.get("/", async (req, res) => {
    const query = req.query as IWorkQuery;
    const { result, totalItem, totalPage } = await workModel.findMany(query);
    res.send({ rows: result, totalItem, totalPage });
  });
  //งานซ่อมตามสถานะ
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
    const validate = await workModel.checkStatus(id, [2]);
    if (validate) {
      const { result } = await workModel.submitWork(id, user.id);
      status = result;
    }
    res.send(status);
  });
  //อัพเดทงานสถานะงานซ่อม
  fastify.patch("/update/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IWorkForm;
    let status = 0;
    //เช็คว่างานซ่อมนี้สำเร็จยัง
    const validate = await workModel.checkStatus(id, [4, 5, 6, 7]);
    if (validate) {
      if (Array.isArray(data.image)) {
        const image = await saveFile("request/" + id, data.image[0]);
        data.image = image;
      }
      const { result } = await workModel.updateStatus(id, data);
      status = result;
    }
    res.send({ result: status });
  });
}
