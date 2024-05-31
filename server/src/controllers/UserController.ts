import { upload } from "@/middlewares/multer";
import { UserModel } from "@/models/UserModel";
import { IUserForm, IUserQuery } from "@/types/UserType";
import { FastifyInstance } from "fastify";

export default async function UserController(fastify: FastifyInstance) {
  const userModel = new UserModel();
  fastify.get("/", async (req, res) => {
    const query = req.query as IUserQuery;
    const { result, totalItem, totalPage } = await userModel.findMany(query);
    res.send({ rows: result, totalItem, totalPage });
  });
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await userModel.findById(id);
    res.send(result);
  });
  fastify.post(
    "/create",
    { preHandler: upload.single("image") },
    async (req, res) => {
      // รับข้อมูลจากฟอร์ม
      const data = req.body as IUserForm;

      // รับข้อมูลไฟล์ที่อัปโหลด
      const file = await req.file();

      // แสดงข้อมูลทั้งหมดในคอนโซล
      console.log(data);
      console.log(file);

      // ดำเนินการต่อไปตามต้องการ เช่น เพิ่มข้อมูลลงในฐานข้อมูล
      const result = await userModel.createOne(data);

      // ส่งผลลัพธ์กลับไปยังไคลเอนต์
      res.send(result);
    }
  );

  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IUserForm;
    const result = await userModel.update(id, data);
    res.send(result);
  });
  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await userModel.deleteOne(id);
    res.send(result);
  });
}
