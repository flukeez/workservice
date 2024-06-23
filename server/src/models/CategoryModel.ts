import db from "@/database";
import { pagination } from "@/utils/pagination";
import type {
  ICategory,
  ICategoryForm,
  ICategoryQuery,
} from "@/types/CategoryType";

const tbName = "tb_category";
export class CategoryModel {
  async findMany(
    query: ICategoryQuery
  ): Promise<{ result: ICategory[]; totalPage: number; totalItem: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .where((builder) => {
        builder
          .where("code", "LIKE", `%${txtSearch}%`)
          .orWhere("name", "LIKE", `%${txtSearch}%`);
      })
      .where("cate_show", 0);
    try {
      const result = await baseQuery
        .clone()
        .orderBy(sortField, sortDirection)
        .limit(limit)
        .offset(offset);
      const rowCount = await baseQuery.clone().count({ countId: "id" }).first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = await pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Interal server error");
    }
  }
  //ค้นหาตามไอดี
  async findById(id: number): Promise<{ result: ICategory }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
  //เพิ่มใหม่ 1 รายการ
  async createOne(data: ICategoryForm): Promise<{ result: number }> {
    try {
      const result = await db(tbName).insert(data);
      return { result: result[0] };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }
  //อัพเดท
  async update(id: number, data: ICategoryForm): Promise<{ result: number }> {
    try {
      const result = await db(tbName).where({ id }).update(data);
      return { result };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }
  //ลบ
  async deleteOne(id: number): Promise<{ result: number }> {
    try {
      const result = await db(tbName).where({ id }).update("cate_show", 1);
      return { result };
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
  //เช็คซ้ำ
  async checkDuplicate(code: string, id = 0): Promise<number> {
    try {
      const query = await db(tbName)
        .where({ code })
        .whereNot({ id })
        .where("cate_show", 0)
        .first();
      return query ? 0 : 1;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
