import { FastifyInstance } from "fastify";
import { RequestModel } from "@/models/RequestModel";
import { saveFile } from "@/utils/imagefile";
import type { IRequestForm, IRequestQuery } from "@/types/RequestType";
import type { IUserToken } from "@/types/UserType";

export default async function RequestController(fastify: FastifyInstance) {
  const requestModel = new RequestModel();

  //find many
  fastify.get("/", async (req, res) => {
    const query = req.query as IRequestQuery;
    const user = req.user as IUserToken;
    const { result, totalItem, totalPage } = await requestModel.findMany(
      query,
      user.id
    );
    res.send({ rows: result, totalItem, totalPage });
  });

  //find by id
  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await requestModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
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
    //เก็บค่าหน่วยวยงาน
    let newData = { ...data, faculty_id, user_id: user.id };
    //อัพโหลดรูป
    if (Array.isArray(newData["image[]"])) {
      const imageArray = await Promise.all(
        newData["image[]"].map(async (image, key) => {
          //ถ้าเป็นรูปให้อัพโหลด
          if (typeof image === "object") {
            return await saveFile("request", image);
          } else {
            //ถ้าไม่ใช่รูปจะเป็นชื่อรูปให้เก็บไว้เหมือนเดิม
            return image;
          }
        })
      );

      newData = { ...newData, "image[]": imageArray };
    }

    const result = await requestModel.create(newData);
    res.send({ result });
  });

  //รายละเอียดงานซ่อมจากไอดี
  fastify.get("/details/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await requestModel.findByIdDetails(id);
    res.send(result);
  });

  //ประวัติสถานะงานซ่อม
  fastify.get("/history/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await requestModel.findByIdHistory(id);
    res.send(result);
  });
}
