import db from "@/database";
import { pagination } from "@/utils/pagination";
import type {
  IEquip,
  IEquipmentForm,
  IEquipQuery,
} from "@/types/EquipmentType";
import { dateToMySql } from "@/utils/mydate";

const tbName = "tb_equip";
export class EquipmentModel {
  async findMany(
    query: IEquipQuery
  ): Promise<{ result: IEquip[]; totalItem: number; totalPage: number }> {
    const {
      txtSearch,
      page,
      limit,
      sortField,
      sortDirection,
      faculty_id,
      user_id,
    } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .leftJoin("tb_faculty", `${tbName}.faculty_id`, "tb_faculty.id")
      .leftJoin("tb_category", `${tbName}.cate_id`, "tb_category.id")
      .leftJoin(
        "tb_equip_status",
        `${tbName}.equip_status_id`,
        "tb_equip_status.id"
      )
      .leftJoin("tb_user", `${tbName}.user_id`, "tb_user.id")
      .where((builder) => {
        builder
          .where(`${tbName}.name`, "LIKE", `%${txtSearch}%`)
          .orWhere(`${tbName}.code`, "LIKE", `%${txtSearch}%`)
          .orWhere(`${tbName}.serial`, "LIKE", `%${txtSearch}%`);
      })
      .where((builder) => {
        if (faculty_id) builder.where(`${tbName}.faculty_id`, faculty_id);
        if (user_id) builder.where(`${tbName}.user_id`, user_id);
      })

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
          `${tbName}.date_start`,
          `${tbName}.warranty`,
          `${tbName}.warranty_end`,
          `${tbName}.image`,
          "tb_equip_status.name as equip_status_name",
          "tb_category.name as category_name",
          "tb_faculty.name as faculty_name",
          "tb_user.firstname",
          "tb_user.surname"
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
      const result = await db(tbName)
        .select("*", "image as image_old")
        .where({ id })
        .first();
      return { result };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
  async createOne(data: IEquipmentForm): Promise<{ result: number }> {
    try {
      const formData = {
        ...data,
        date_start: dateToMySql(data.date_start),
        warranty_start: dateToMySql(data.warranty_start),
        warranty_end: dateToMySql(data.warranty_end),
      };
      const result = await db(tbName).insert(formData);

      return { result: result[0] };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
  async update(id: number, data: IEquipmentForm): Promise<{ result: number }> {
    try {
      const formData = {
        ...data,
        date_start: dateToMySql(data.date_start),
        warranty_start: dateToMySql(data.warranty_start),
        warranty_end: dateToMySql(data.warranty_end),
      };
      const result = await db(tbName).update(formData).where({ id });
      return { result };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }

  async delete(id: number): Promise<{ result: number; image: string }> {
    try {
      const data = await db(tbName).select("image").where({ id }).first();
      const result = await db(tbName).delete().where({ id });
      return { result, image: data?.image || "" };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
  async checkDuplicate(code: string, serial: string, id = 0): Promise<number> {
    try {
      const query = await db(tbName)
        .where({ code })
        .orWhere({ serial })
        .andWhereNot({ id })
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }

  async findAllById(
    query: IEquipQuery,
    id: string
  ): Promise<{ result: object[]; totalItem: number; totalPage: number }> {
    try {
      const {
        txtSearch,
        page,
        limit,
        sortField,
        sortDirection,
        faculty_id,
        user_id,
      } = query;

      const baseQuery = db(tbName).where((builder) => {
        builder
          .where("name", "LIKE", `%${txtSearch}%`)
          .orWhere(`code`, "LIKE", `%${txtSearch}%`)
          .orWhere(`serial`, "LIKE", `%${txtSearch}%`);
      });

      const equip = await db("tb_request_equip")
        .select(db.raw("GROUP_CONCAT(equip_id) as id"))
        .where({ request_id: id })
        .first();
      const equipIds = equip?.id?.split(",") || [];
      const limitPerPage =
        page == 0 && equipIds.length > 10 ? equipIds.length : limit;

      const result = await baseQuery
        .clone()
        .select("id", "code", "name", "serial", db.raw("1 as sort_order"))
        .whereIn("id", equipIds)
        .union(function () {
          this.select("id", "code", "name", "serial", db.raw("2 as sort_order"))
            .from(tbName)
            .whereNotIn("id", equipIds)
            .where(function () {
              this.where("name", "LIKE", `%${txtSearch}%`)
                .orWhere(`code`, "LIKE", `%${txtSearch}%`)
                .orWhere(`serial`, "LIKE", `%${txtSearch}%`);
            });
        })
        .orderBy([
          { column: "sort_order", order: "asc" },
          { column: sortField, order: sortDirection },
        ])
        .limit(limitPerPage)
        .offset(limitPerPage * page);

      const rowCount = await baseQuery
        .clone()
        .count({ countId: `${tbName}.id` })
        .first();

      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = await pagination(totalItem, limit);

      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
}
