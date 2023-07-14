import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin";
import { knex } from "knex"

interface KnexOpts {
  options: any;
  connectionName: string
}

const knexConnector = async (fastify: FastifyInstance, opts: KnexOpts, done: (err?: Error) => void): Promise<void> => {
  try {
    const connection = await knex(opts.options)
    fastify.decorate(opts.connectionName, connection)
    done()
  } catch (err) {
    done(err as Error)
  }
}

export default fastifyPlugin(knexConnector)