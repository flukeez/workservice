import app from './app'
import config from './config'

const port = Number(config.server_port)
const address = config.server_address


const start = async () => {
  try {
    await app.listen({ port, host: address })
    console.log('Server START at ' + address + ':' + port)
  } catch (error) {
    // console.error('Server Error : ' + error)
    console.error(`Server Error : ${error}`)
    process.exit(1)
  }
}

start()