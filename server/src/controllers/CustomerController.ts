import { FastifyInstance } from "fastify";
import CustomerModel from "../models/CustomerModel";

export default async function CustomerController(fastify: FastifyInstance) {
  const db = fastify.db
  const customerModel = new CustomerModel()

  //get all
  fastify.get('/', async (request, replay) => {
    try {
      const { results, totalItem, totalPage } = await customerModel.getMany(db)

      replay.send({
        message: 'GET Customers',
        rows: results,
        totalItem,
        totalPage
      })
    } catch (err) {
      console.log('Error=>', err)
      throw err
    }

  })

  //get some
  fastify.get('/:id', async (request, replay) => {
    const params: any = request.params
    const id = params.id

    const rs: any = await db('tbCustomers').where('id', id)

    replay.send({ message: 'GET Customer by ' + id, row: rs })
  })

  //insert
  fastify.post('/create', async (request, replay) => {
    try {
      const { fname, lname, position }: any = request.body
      const {id} = await customerModel.createUser(db, fname, lname, position);

      replay.send({message: `Add Data is success`, rows: {id:id, fname:fname, lname:lname, position:position}})
    } catch (err) {
      console.log('Error=>', err)
      throw err
    }
  })

  //delete
  fastify.delete('/:id', async (request, replay) => {
    try {
      const { id } : any = request.params
      const {results} = await customerModel.deleteUser(db, id);
  
      replay.send({message: 'Delete User ID :'+results, id:results})
    } catch (err) {
      console.log('Error=>', err)
      throw err
    }
  })

  //update all field
  fastify.put('/edit/:id', async (request, replay) => {
    try {
      const {id} :any = request.params
      const {fname, lname, position}: any = request.body

      const {result} = await customerModel.updateUser(db, id, fname, lname, position);
      replay.send({message: `update Data id = ${id}  is success`, result:result})
    } catch (err) {
      console.log('Error=>', err)
      throw err
    }
    
  })

  //update some filed
  fastify.patch('/edit/:id', async (request, replay) => {
    try {
      const {id} :any = request.params
      const {name}: any = request.body

      const {results} = await customerModel.updateNameUser(db,id,name)
      replay.send({message: `update name success ${results}`})
    } catch (err) {
      console.log("Error =>", err)
      throw err
    }
  })
}