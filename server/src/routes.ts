import { FastifyInstance } from "fastify"
import CustomerController from "./controllers/CustomerController"
import TypeMoneyController from "./controllers/TypeMoneyController"
import TypeManageController from "./controllers/TypeManageController"

const routes = async (fastify: FastifyInstance) => {
  fastify.get('/api/home', () => 'Hello Home')

  fastify.register(CustomerController, { prefix: '/api/customers' })
  fastify.register(TypeMoneyController, { prefix: '/api/typeMoneys'})
  fastify.register(TypeManageController, { prefix: '/api/typeManages'})
}

export default routes