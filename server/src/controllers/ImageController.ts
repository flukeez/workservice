import { FastifyInstance } from "fastify";
import { getFile } from "@/utils/imagefile";
import fs from "fs";

export default async function ImageController(fastify: FastifyInstance) {
  //ส่งตำแหน่งไฟล์
  // fastify.get("/:folder/:filename", async (req, res) => {
  //   const { folder, filename } = req.params as {
  //     folder: string;
  //     filename: string;
  //   };
  //   const filepath = await getFile(folder, filename);
  //   res.send(filepath);
  // });
  //ส่งข้อมูลไฟล์
  fastify.get("/:folderName/:filename", async (req, res) => {
    const { folderName, filename } = req.params as {
      folderName: string;
      filename: string;
    };
    const file = await getFile(folderName, filename);
    // กำหนด content-type ของไฟล์
    res.header("Content-Type", "image/jpeg");
    // ส่งข้อมูล Buffer กลับไปยังผู้ใช้
    res.send(file);
  });
}
