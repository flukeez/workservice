import { FastifyInstance } from "fastify";
import { IssueModel } from "@/models/IssueModel";
import { IIssueForm, IIssueQuery } from "@/types/IssueType";
export default async function IssueController(fastify: FastifyInstance) {
  const issueModel = new IssueModel();

  fastify.get("/", async (req, res) => {
    const query = req.query as IIssueQuery;
    const { result, totalPage, totalItem } = await issueModel.findMany(query);
    res.send({ rows: result, totalPage, totalItem });
  });

  fastify.get("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await issueModel.findById(id);
    res.send(result);
  });

  fastify.post("/create", async (req, res) => {
    const data = req.body as IIssueForm;
    const result = await issueModel.createOne(data);
    res.send(result);
  });

  fastify.patch("/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const data = req.body as IIssueForm;
    const result = await issueModel.update(id, data);
    res.send(result);
  });

  fastify.patch("/del/:id", async (req, res) => {
    const { id } = req.params as { id: number };
    const result = await issueModel.deleteOne(id);
    res.send(result);
  });
}
