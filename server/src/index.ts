import app from './app'
require('dotenv').config()

const server_address = process.env.SERVER_ADDRESS
const server_port = Number(process.env.SERVER_PORT)


app.get('/ping', async (request, reply) => {
  console.log(server_address, server_port)
  return 'pong 4\n'
})

const start = async()=>{
  try{
    await app.listen({ port: server_port,host: server_address })
    console.log(`Server listening at ${server_address}:${server_port}`)
  }catch(err){
    console.error(err)
    process.exit(1)
  }
}

start()