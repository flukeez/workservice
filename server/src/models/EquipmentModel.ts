import db from "@/database";
import { pagination } from "@/utils/pagination";
import type { IEquip, IEquipQuery } from "@/types/EquipmentType";

const tbName = "tb_equip";
export class EquipmentModel {
  async findMany(
    query: IEquipQuery
  ): Promise<{ result: IEquip[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .leftJoin("tb_faculty", `${tbName}.faculty_id`, "tb_faculty.id")
      .leftJoin("tb_category", `${tbName}.cate_id`, "tb_category.id")
      .leftJoin(
        "tb_equip_status",
        `${tbName}.equip_status_id`,
        "tb_equip_status.id"
      )
      .where(`${tbName}.name`, "LIKE", `%${txtSearch}%`)
      .andWhere(`${tbName}.equip_show`, 0);
    try {
      const result = await baseQuery
        .clone()
        .select(
          `${tbName}.id`,
          `${tbName}.name`,
          `${tbName}.code`,
          `${tbName}.serial`,
          `${tbName}.price`,
          `${tbName}.shared`,
          `${tbName}.warranty`,
          `${tbName}.warranty_start`,
          `${tbName}.warranty_end`,
          `${tbName}.image`,
          "tb_equip_status.name",
          "tb_category.name",
          "tb_faculty.name",
          "tb_user.name"
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
  async findById(id: number): Promise<{ result: IEquip }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
