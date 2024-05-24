import { pagination } from "../utils/pagination";
import db from "../database";

const tbname = "tb_ctype";
export class CtypeModel {
  async findMany(
    query: any
  ): Promise<{ results: any[]; totalItem: number; totalPage: number }> {
    const textSearch = query.textSearch || "";
    const activePage = query.activePage || 0;
    const limit = query.limit || 10;
    let baseQuery = db(tbname).where(function () {
      if (!!textSearch) {
        this.where("name", "like", `%${textSearch}%`);
      }
    });
    const recordStart = activePage * limit;
    const results = await baseQuery.clone().offset(recordStart).limit(limit);
    const rowCount = await baseQuery.clone().count({ countId: "id" }).first();

    const totalItem = Number(rowCount?.countId || 0);
    const totalPage = await pagination(totalItem, limit);
    return { results, totalItem, totalPage };
  }

  findById(id: string) {
    return db(tbname).where({ id }).first();
  }

  //new data
  create(data: any) {
    console.log("test");
    return db(tbname).insert(data);
  }

  //update data
  update(id: string, data: any) {
    return db(tbname).where({ id }).update(data);
  }

  //delete data
  delete(id: string) {
    return db(tbname).where({ id }).delete();
  }
}
