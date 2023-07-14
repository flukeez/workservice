if (process.env.NODE_ENV == 'production') {
  require('dotenv').config({ path: '.env.prod' })
} else {
  require('dotenv').config()
}

const config = {
  server_port: process.env.SERVER_PORT || 4009,
  server_address: process.env.SERVER_ADDRESS || '0.0.0.0',
  db1name: process.env.DB1_NAME,
  db1user: process.env.DB1_USER,
  db1password: process.env.DB1_PASSWORD,
  db1port: process.env.DB1_PORT,
  db1host: process.env.DB1_HOST
}

export default config