import { pagination } from "@/utils/pagination";
import db from "../database";

import type {
  IFaculty,
  IFacultyForm,
  IFacultyOrgChart,
  IFacultyPosition,
  IFacultyQuery,
} from "../types/FacultyType";

const tbName = "tb_faculty";
export class FacultyModel {
  //ค้นหาทั้งหมด
  async findMany(
    query: IFacultyQuery
  ): Promise<{ result: IFaculty[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .leftJoin({ tbParent: tbName }, "tb_faculty.faculty_id", "tbParent.id")
      .where((builder) => {
        builder
          .where("tbParent.name", "LIKE", `%${txtSearch}%`)
          .orWhere(`${tbName}.name`, "LIKE", `%${txtSearch}%`);
      })
      .andWhere(`${tbName}.faculty_show`, 0);
    try {
      const result = await baseQuery
        .clone()
        .select(
          `${tbName}.id`,
          `${tbName}.name`,
          `tbParent.name as faculty_name`
        )
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
  async findById(id: number): Promise<{ result: IFaculty }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
  //เพิ่มใหม่ 1 รายการ
  async createOne(data: IFacultyForm): Promise<{ result: number }> {
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
  async update(id: number, data: IFacultyForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name, id);
      if (checkDuplicate) {
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
      const result = await db(tbName).where({ id }).update("faculty_show", 1);
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
        .where("faculty_show", 0)
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
  //ผู้ใช้และตำแหน่งงานทั้งหมดในหน่วยงาน
  async organizeChart(
    fac_id: number,
    query: IFacultyQuery
  ): Promise<{
    result: IFacultyOrgChart[];
    totalItem: number;
    totalPage: number;
    faculty_name: string;
  }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db("tb_user_position")
      .leftJoin("tb_user", "tb_user_position.user_id", "tb_user.id")
      .leftJoin("tb_position", "tb_user_position.pos_id", "tb_position.id")
      .where((builder) => {
        builder
          .where("tb_user.surname", "LIKE", `%${txtSearch}%`)
          .orWhere("tb_user.firstname", "LIKE", `%${txtSearch}%`)
          .orWhere("tb_position.name", "LIKE", `%${txtSearch}%`);
      })
      .where("tb_user.user_show", 0)
      .andWhere({ fac_id });
    try {
      const result = await baseQuery
        .clone()
        .select(
          "tb_position.name",
          "tb_user.firstname",
          "tb_user.surname",
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
      const faculty = await db(tbName)
        .select("name")
        .where({ id: fac_id })
        .first();
      return { result, totalItem, totalPage, faculty_name: faculty.name };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  //ผู้ใช้และตำแหน่ง 1 แถว ในหน่วยงาน
  async organizeChartPosition(
    fac_id: number,
    user_id: number
  ): Promise<{ result: IFacultyPosition }> {
    try {
      const result = await db("tb_user_position")
        .where({ fac_id, user_id })
        .first();
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  //เพิ่มตำแหน่งในหน่วยงาน
  async createPosition(data: IFacultyPosition): Promise<{ result: number }> {
    try {
      const checkPosition = await this.checkDuplicatePosition(
        data.fac_id,
        data.user_id
      );
      if (checkPosition) {
        return { result: 0 };
      }
      const result = await db("tb_user_position").insert(data);
      return { result: 1 };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  // แก้ไขตำแหน่งในหน่วยงาน
  async updatePosition(data: IFacultyPosition): Promise<{ result: number }> {
    try {
      const result = await db("tb_user_position")
        .where({
          fac_id: data.fac_id,
          user_id: data.user_id,
        })
        .update(data);
      return { result: 1 };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  //ลบตำแหน่งในหน่วยงาน
  async deletePosition(
    fac_id: number,
    user_id: number
  ): Promise<{ result: number }> {
    try {
      const result = await db("tb_user_position")
        .where({ fac_id, user_id })
        .del();
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  async checkDuplicatePosition(
    fac_id: number,
    user_id: number
  ): Promise<number> {
    try {
      const query = await db("tb_user_position")
        .where({ fac_id, user_id })
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
