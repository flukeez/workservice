import db from "@/database";
import type {
  IPosition,
  IPositionForm,
  IPositionQuery,
} from "@/types/PositionType";
import { pagination } from "@/utils/pagination";

const tbName = "tb_position";
export class PositionModel {
  //ค้นหาทั้งหมด
  async findMany(
    query: IPositionQuery
  ): Promise<{ result: IPosition[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName).where(
      `${tbName}.name`,
      "LIKE",
      `%${txtSearch}%`
    );
    try {
      const result = await baseQuery
        .clone()
        .orderBy(sortField, sortDirection)
        .offset(offset)
        .limit(limit);

      const rowCount = await baseQuery
        .clone()
        .count({ countId: `${tbName}.id` })
        .first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  //ค้นหาจากไอดี
  async findById(id: number): Promise<{ result: IPosition }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in FindyById:", error);
      throw error;
    }
  }
  //เเพิ่มใหม่ 1 รายการ
  async createOne(data: IPositionForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name);
      if (checkDuplicate) {
        return { result: 0 };
      }
      const result = await db(tbName).insert({
        ...data,
        super_admin: data.super_admin ? 1 : 0,
      });
      return { result: result[0] };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }
  //แกแ้ไข
  async update(id: number, data: IPositionForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name, data.id);
      if (checkDuplicate) {
        return { result: 0 };
      }
      const result = await db(tbName)
        .update({ ...data, super_admin: data.super_admin ? 1 : 0 })
        .where({ id });
      return { result };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }
  //ลบรายการ
  async deleteOne(id: number): Promise<{ result: number }> {
    try {
      const check = await db("tb_user_position")
        .select("pos_id")
        .where({ pos_id: id })
        .first();
      if (check) {
        return { result: 0 };
      }
      const result = await db(tbName).where({ id }).del();
      return { result };
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  //เช็คซ้ำ
  async checkDuplicate(name: string, id = 0) {
    try {
      const query = await db(tbName).where({ name }).whereNot({ id }).first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
