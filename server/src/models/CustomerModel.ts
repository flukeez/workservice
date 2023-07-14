import { Knex } from "knex";

export default class CustomerModel {
  /**
   * GET ข้อมูลหลายรายการตามเงื่อนไข
   * @param db 
   * @returns 
   */

  async getMany(db: Knex): Promise<{results: any[], totalItem: number, totalPage: number}> {
    const rs = await db('tbCustomers');

    return {
        results: rs,
        totalItem: 200,
        totalPage: 10
    }
  }

    /**
   * เพิ่มข้อมใหม่
   */
  // async createUser(db: Knex, fname: string,  lname: string, position: string): Promise<{CustomerName: string, CustomerSurname: string}> {
  //   const rs = await db('tbCustomers').insert({fname, lname, position});

  //   return { CustomerName: fname, CustomerSurname: lname}
  // }

  async createUser(db: Knex, fname: string,  lname: string, position: string): Promise<{id: number}> {
    const [id] = await db('tbCustomers').insert({ fname, lname, position });

    return { id};
  }

     /**
   * ลบข้อมูล
   * @param db 
   * @returns 
   */
     async deleteUser(db: Knex, id: number): Promise<{results: number}> {
      const rs = await db('tbCustomers').where({'id': id}).del();
  
      return { results: id}
    }

    
    /**
   * แก้ไขข้อมูล
   */
  async updateUser(db: Knex, id:number, name: string, lname:string, position:string): Promise<{result: number}> {
    const rs = await db('tbCustomers').where({id:id}).update({fname: name, lname: lname, position: position})

    return {
      result: rs
    }
  }

     /**
   * แก้ไขข้อมูลเฉพาะชื่อ
   */
     async updateNameUser(db: Knex, id: number, name: string): Promise<{results: number}> {
      const rs = await db('tbCustomers').where({id:id}).update({name: name})

      return {results:rs}
     }
}