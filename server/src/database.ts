import knex from "knex";
import type {Knex} from 'knex'
import moment from "moment";

import {config} from './config'
const configKnex: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: config.DB1_HOST,
      port: Number(config.DB1_PORT),
      database: config.DB1_NAME,
      user: config.DB1_USER,
      password: config.DB1_PASSWORD,
      typeCast: function (field: any, next: any) {
        if (field.type == 'DATETIME') {
          const fieldDString = moment(field.string()).format('YYYY-MM-DD HH:mm:ss')
          if (moment(fieldDString, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
            return fieldDString
          } else {
            return ''
          }
        }

        if (field.type == 'DATE') {
          const fieldString = moment(field.string()).format('YYYY-MM-DD')
          if (moment(fieldString, 'YYYY-MM-DD', true).isValid()) {
            return fieldString
          } else {
            return ''
          }
        }
        return next()
      },
    },
  },
}

const environment = process.env.NODE_ENV || 'development'
const db = knex(configKnex[environment])

export default db
