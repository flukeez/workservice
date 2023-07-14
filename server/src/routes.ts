import { FastifyInstance } from "fastify"
import CustomerController from "./controllers/CustomerController"
import TypeMoneyController from "./controllers/TypeMoneyController"

const routes = async (fastify: FastifyInstance) => {
  fastify.get('/api/home', () => 'Hello Home')

  fastify.register(CustomerController, { prefix: '/api/customers' })
  fastify.register(TypeMoneyController, { prefix: '/api/typeMoneys'})
}

export default routes