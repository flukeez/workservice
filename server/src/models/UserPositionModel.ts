import db from "@/database";
import type {
  IFacultyOrgChart,
  IFacultyPosition,
  IFacultyQuery,
} from "@/types/FacultyType";
import { pagination } from "@/utils/pagination";

const tbName = "tb_user_position";
export class UserPositionModel {
  //ผู้ใช้และตำแหน่งงานทั้งหมดในหน่วยงาน
  async findMany(
    fac_id: number,
    query: IFacultyQuery
  ): Promise<{
    result: IFacultyOrgChart[];
    totalItem: number;
    totalPage: number;
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
          `${tbName}.id`,
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
      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  //ผู้ใช้และตำแหน่ง 1 แถว ในหน่วยงาน
  async findById(id: number): Promise<{ result: IFacultyPosition }> {
    try {
      const result = await db("tb_user_position").where({ id }).first();
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  //เพิ่มตำแหน่งในหน่วยงาน
  async create(data: IFacultyPosition): Promise<{ result: number }> {
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
  async update(
    id: number,
    data: IFacultyPosition
  ): Promise<{ result: number }> {
    try {
      const checkPosition = await this.checkDuplicatePosition(
        data.fac_id,
        data.user_id,
        id
      );
      if (checkPosition) {
        return { result: 0 };
      }
      const result = await db("tb_user_position")
        .where({
          id,
        })
        .update(data);
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  //ลบตำแหน่งในหน่วยงาน
  async delete(id: number): Promise<{ result: number }> {
    try {
      const result = await db("tb_user_position").where({ id }).del();
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  async checkDuplicatePosition(
    fac_id: number,
    user_id: number,
    id?: number
  ): Promise<number> {
    try {
      const query = await db("tb_user_position")
        .where({ fac_id, user_id })
        .whereNot({ id })
        .first();
      console.log(query);
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
