import db from "@/database";
import type {
  IPosition,
  IPositionAssign,
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
    const baseQuery = db(tbName)
      .join("tb_faculty", `${tbName}.faculty_id`, `tb_faculty.id`)
      .where(`${tbName}.name`, "LIKE", `%${txtSearch}%`);
    try {
      const result = await baseQuery
        .clone()
        .select(
          `${tbName}.id`,
          `${tbName}.name`,
          `${tbName}.super_admin`,
          "tb_faculty.name as faculty_name"
        )
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
      const checkDuplicate = await this.checkDuplicate(
        data.name,
        data.faculty_id
      );
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
      const checkDuplicate = await this.checkDuplicate(
        data.name,
        data.faculty_id,
        data.id
      );
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
  async checkDuplicate(name: string, faculty_id: number, id = 0) {
    try {
      const query = await db(tbName)
        .where({ name })
        .where({ faculty_id })
        .whereNot({ id })
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }

  //ผู้ใช้และตำแหน่งงาน
  async positionAssign(query: IPositionQuery): Promise<{
    result: IPositionAssign[];
    totalItem: number;
    totalPage: number;
  }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db("tb_user_position")
      .join("tb_user", "tb_user_position.user_id", "tb_user.id")
      .join("tb_position", "tb_user_position.pos_id", "tb_position.id")
      .join("tb_faculty", "tb_position.faculty_id", "tb_faculty.id")
      .where("tb_user.name", "LIKE", `%${txtSearch}%`)
      .where("tb_user.user_show", 0)
      .groupBy("tb_user.id");
    try {
      const result = await baseQuery
        .clone()
        .select(
          db.raw(
            "GROUP_CONCAT(tb_position.name SEPARATOR ', ' tb_faculty.name) as position"
          ),
          "tb_user.name",
          "tb_user.id"
        )
        .orderBy(sortField, sortDirection)
        .offset(offset)
        .limit(limit);
      const rowCount = await baseQuery
        .clone()
        .count({ countId: "tb_user.id" })
        .first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
}
