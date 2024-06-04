import db from "@/database";
import { pagination } from "@/utils/pagination";
import type {
  IEquipStatus,
  IEquipStatusForm,
  IEquipStatusQuery,
} from "@/types/EquipStatusType";

const tbName = "tb_equip_status";
export class EquipStatusModel {
  //ค้นหาทั้งหมด
  async findMany(
    query: IEquipStatusQuery
  ): Promise<{ result: IEquipStatus[]; totalPage: number; totalItem: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .where("name", "LIKE", `%${txtSearch}%`)
      .andWhere("status_show", 0);
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
      const totalPage = await pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
  //ค้นหาตามไอดี
  async findById(id: number): Promise<{ result: IEquipStatus }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
  //เพิ่มใหม่ 1 รายการ
  async createOne(data: IEquipStatusForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name);
      if (checkDuplicate) {
        return { result: 0 };
      }
      const result = await db(tbName).insert(data);
      return { result: result[0] };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }
  //อัพเดท
  async update(
    id: number,
    data: IEquipStatusForm
  ): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name, id);
      if (checkDuplicate !== 0) {
        return { result: 0 };
      }
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
      const result = await db(tbName).where({ id }).update("status_show", 1);
      return { result };
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
  //เช็คซ้ำ
  async checkDuplicate(name: string, id = 0): Promise<number> {
    try {
      const query = await db(tbName)
        .where({ name })
        .whereNot({ id })
        .where("status_show", 0)
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
