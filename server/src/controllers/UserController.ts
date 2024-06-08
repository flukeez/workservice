import { upload } from "@/middlewares/multer";
import { UserModel } from "@/models/UserModel";
import { IUserForm, IUserQuery } from "@/types/UserType";
import { deleteFile, saveFile } from "@/utils/imagefile";
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
  fastify.post("/create", async (req, res) => {
    // รับข้อมูลจากฟอร์ม
    let data = req.body as IUserForm;
    const checkDuplicate = await userModel.checkDuplicate(
      data.id_card,
      data.firstname,
      data.surname,
      data.username
    );
    if (checkDuplicate) {
      res.send({ result: 0 });
      return;
    }
    try {
      if (Array.isArray(data.image)) {
        const image = await saveFile("user", data.image[0]);
        data = { ...data, image: image };
      }
    } catch (error) {
      console.error("Error processing images:", error);
      return res.status(500).send({ error: "Error processing images" });
    }
    const result = await userModel.createOne(data);
    res.send(result);
  });

  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    let data = req.body as IUserForm;
    const checkDuplicate = await userModel.checkDuplicate(
      data.id_card,
      data.firstname,
      data.surname,
      data.username,
      id
    );
    if (checkDuplicate) {
      res.send({ result: 0 });
      return;
    }
    try {
      if (!data.image && data.image_old) {
        // ไม่มีรูปภาพใหม่แต่มีชื่อภาพเก่า
        await deleteFile("user", data.image_old);
        delete data.image_old;
      } else if (Array.isArray(data.image)) {
        if (data.image_old) {
          await deleteFile("user", data.image_old);
          delete data.image_old;
        }
        const image = await saveFile("user", data.image[0]);
        data.image = image;
      }
    } catch (error) {
      console.error("Error processing images:", error);
      return res.status(500).send({ error: "Error processing images" });
    }

    const result = await userModel.update(id, data);
    res.send(result);
  });
  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const { result, image } = await userModel.deleteOne(id);
    if (image) {
      await deleteFile("user", image);
    }
    res.send(result);
  });
}
