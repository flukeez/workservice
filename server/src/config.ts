if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.prod' })
} else {
  require('dotenv').config()
}

export const config = { ...process.env }
