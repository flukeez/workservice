import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors';
import routes from './routes'
import config from './config'

const app: FastifyInstance = Fastify({
  logger: true,
})

//ติดต่อฐานข้อมูล MySQL ด้วย Knex
app.register(require('./plugins/knex-db'), {
  connectionName: 'db',
  options: {
    client: 'mysql2',
    connection: {
      host: config.db1host,
      port: config.db1port,
      database: config.db1name,
      user: config.db1user,
      password: config.db1password,
    }
  }
})

app.register(fastifyCors, {
  origin: true
  // origin: ['http://example.com', 'http://localhost:3000'],
  // methods: ['GET', 'POST'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
});



app.register(routes)
export default app