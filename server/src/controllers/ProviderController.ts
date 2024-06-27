import { FastifyInstance } from "fastify";
import ProviderModel from "@/models/ProviderModel";
import type { IProviderForm, IProviderQuery } from "@/types/ProviderType";
import { deleteFile, saveFile } from "@/utils/imagefile";

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

  //เพิ่มผู้ซ่อม
  fastify.post("/create", async (req, res) => {
    let data = req.body as IProviderForm;
    try {
      const checkDuplicate = await providerModel.checkDuplicate(data.name);
      if (checkDuplicate) {
        res.send({ result: 0 });
        return;
      }
      if (Array.isArray(data.image)) {
        const image = await saveFile("provider", data.image[0]);
        data = { ...data, image: image };
      }
      //แปลงประเภทงานจากอาเรย์ให้ออกมาเป็นแต่ละฟิลด์
      if (Array.isArray(data["issue_id[]"])) {
        const issue_id = data["issue_id[]"].map((item, index) => {
          return { [`issue_id${index + 1}`]: item };
        });
        data = { ...data, ...Object.assign({}, ...issue_id) };
        delete data["issue_id[]"];
      }
      const result = await providerModel.createOne(data);
      res.send(result);
    } catch (error) {
      throw new Error("Error");
    }
  });

  //แก้ไขข้อมูลผู้ซ่อม
  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    let data = req.body as IProviderForm;
    try {
      const checkDuplicate = await providerModel.checkDuplicate(data.name, id);
      if (checkDuplicate) {
        res.send({ result: 0 });
        return;
      }
      //TODO ถ้าชื่อรูปไม่มี คือการลบรูป
      if (!data.image && data.image_old) {
        await deleteFile("provider", data.image_old);
      } else if (Array.isArray(data.image)) {
        //TODO มีรูปเป็นไฟล์
        //TODO ลบรูปเก่า
        if (data.image_old) {
          await deleteFile("provider", data.image_old);
        }
        //TODO อัพภาพใหม่
        const image = await saveFile("provider", data.image[0]);
        data = { ...data, image: image };
      }
      if (Array.isArray(data.image)) {
        const image = await saveFile("provider", data.image[0]);
        data = { ...data, image: image };
      }
      if (data.image_old) {
        delete data.image_old;
      }
      //แปลงประเภทงานจากอาเรย์ให้ออกมาเป็นแต่ละฟิลด์
      if (Array.isArray(data["issue_id[]"])) {
        const issue_id = data["issue_id[]"].map((item, index) => {
          return { [`issue_id${index + 1}`]: item };
        });
        data = { ...data, ...Object.assign({}, ...issue_id) };
        delete data["issue_id[]"];
      }
      const result = await providerModel.updateOne(id, data);
      res.send(result);
    } catch (error) {
      throw new Error("Error");
    }
  });

  //TODO: ผู้ซ่อมที่เหมาะกับงานซ่อม
  fastify.get("/list/:id", async (req, res) => {
    const query = req.query as IProviderQuery;
    const { id } = req.params as { id: string };
    const { result, totalItem, totalPage } =
      await providerModel.findManyForIssue(query, id);
    res.send({ rows: result, totalItem, totalPage });
  });
}
