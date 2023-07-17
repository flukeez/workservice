import { Knex } from "knex";

export default class TypeManageModel {

    /**
    * GET ข้อมูลหลายรายการ
    */

    async getMany(db: Knex): Promise<{results: any[], totalItem: number, totalPage: number}> {
        const rs = await db('tbTypeManages')

        return {
            results: rs,
            totalItem: rs.length,
            totalPage: (rs.length/15)+1
        }
    }

    /**
    * GET ตาม id
    */

    async getById(db: Knex, id:number): Promise<{results: any[]}> {
        const rs = await db('tbTypeManages').where('id', id)

        return {
            results:rs
        }
    }

    /**
    * เพิ่ม Typemoney
    */
    async createTypeManage(db: Knex, code:string, manage_type:string, durable_goods:number, building:number): Promise<{id: number}> {
        const [id] = await db('tbTypeManages').insert({code, manage_type, durable_goods, building})
   
        return {id};
    }

    /**
    * แก้ไข Typemoney
    */

    async updateTypeManage(db: Knex, id:number, code:string, manage_type:string, durable_goods:number, building:number): Promise<{rs: number}> {
        const rs = await db('tbTypeManages').where({id:id}).update({code:code, manage_type:manage_type, durable_goods:durable_goods, building:building})

        return {rs}
    }

    /**
    * ลบ Typemoney
    */

    async deleteTypeManage(db:Knex, id:number): Promise<{rs:number}> {
        const rs = await db('tbTypeManages').where({id:id}).del()

        return {rs}
    }
}