import { RequestModel } from "@/models/RequestModel";
import { IRequestForm } from "@/types/Request";
import { IUserToken } from "@/types/UserType";
import { FastifyInstance } from "fastify";

export default async function RequestController(fastify: FastifyInstance) {
  const requestModel = new RequestModel();
  fastify.post("/", async (req, res) => {
    const data = req.body as IRequestForm;
    const user = req.user as IUserToken;
    //ถ้าหน่วยงานไม่ตรงกับที่เลือกมา
    // กำหนด faculty_id หากไม่ได้รับค่าใน request
    const faculty_id = data.faculty_id || user.position[0].fac_id;

    // ตรวจสอบว่าหน่วยงานตรงกับที่ผู้ใช้เป็นสมาชิกอยู่หรือไม่
    if (
      data.faculty_id &&
      !user.position.some((item) => item.fac_id === data.faculty_id)
    ) {
      return res.send({
        result: 0,
      });
    }
    const newData = { ...data, faculty_id };
    const result = await requestModel.create(newData);
    res.send({ result });
  });
}
