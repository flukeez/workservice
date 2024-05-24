import { FastifyInstance } from "fastify";
import { CustomerModel } from "../models/CustomerModel";
import { dateToMySql } from "../utils/mydate";

export default async function CustomerController(fastify: FastifyInstance) {
  const customerModel = new CustomerModel();

  //ROUTE findAll
  fastify.get("/", async (request, reply) => {
    const query = request.query;
    const { results, totalItem, totalPage } = await customerModel.findMany(
      query
    );
    reply.send({ rows: results, totalItem, totalPage });
  });

  //ROUTE findById
  fastify.get("/:id", async (request, reply) => {
    const params: any = request.params;
    const id = params.id;

    const row = await customerModel.findById(id);

    reply.send({ row });
  });

  //ROUTE Create
  fastify.post("/", async (request, reply) => {
    const formData: any = request.body;
    const data = {
      name: formData.name,
      address: formData.address,
      tel: formData.tel,
      contact: formData.contact,
      note: formData.note,
      insale: dateToMySql(formData.insale),
      price: Number(formData.price || 0),
      ctype_id: formData.ctype_id,
      paydate: dateToMySql(formData.paydate),
    };
    const row = await customerModel.create(data);
    reply.send({ row });
  });

  //ROUTE Update
  fastify.patch("/:id", async (request, reply) => {
    const params: any = request.params;
    const id = params.id;
    const formData: any = request.body;

    const data = {
      name: formData.name,
    };

    const row = await customerModel.update(id, data);
    reply.send({ row });
  });

  //ROUTE Delete
  fastify.delete("/:id", async (request, reply) => {
    const params: any = request.params;
    const id = params.id;

    const row = await customerModel.delete(id);
    reply.send({ row });
  });
}
