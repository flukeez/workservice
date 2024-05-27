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
  fastify.post("/create", async (req, res) => {
    const data = req.body as IUserForm;
    const result = await userModel.createOne(data);
    res.send(result);
  });
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
