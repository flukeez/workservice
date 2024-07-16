import { dateToMySql } from "@/utils/mydate";
import db from "@/database";
import { pagination } from "@/utils/pagination";
import { encryptPassword } from "@/utils/encrypt";
import type { IProviderForm, IProviderQuery } from "@/types/ProviderType";

const tbName = "tb_provider";

export default class ProviderModel {
  async findMany(
    query: IProviderQuery
  ): Promise<{ result: object[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;

    const baseQuery = db(tbName)
      .where("name", "LIKE", `%${txtSearch}%`)
      .where("provider_show", 0);

    try {
      const result = await baseQuery
        .clone()
        .select(
          "id",
          "name",
          "phone",
          "rating",
          "status",
          "last_login",
          "available"
        )
        .orderBy(sortField, sortDirection)
        .offset(offset)
        .limit(limit);
      const rowCount = await baseQuery.clone().count({ countId: "id" }).first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.error("Error in findMany:", error);
      throw error;
    }
  }
  async findById(id: number): Promise<{ result: object }> {
    try {
      const result = await db(tbName)
        .select(
          "id",
          "name",
          "details",
          "image",
          "image as image_old",
          "email",
          "phone",
          "line",
          "line_token",
          "address",
          "tumbol_id",
          "amphure_id",
          "province_id",
          "special",
          "username",
          db.raw(`
        CONCAT_WS(',', 
      ${tbName}.issue_id1, ${tbName}.issue_id2, ${tbName}.issue_id3, ${tbName}.issue_id4, ${tbName}.issue_id5) AS issue_id
        `)
        )
        .where({ id })
        .first();

      if (result.issue_id) {
        result.issue_id = result.issue_id.split(",");
      }
      return { result };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
  //create
  async createOne(data: IProviderForm): Promise<{ result: number }> {
    try {
      data.password = encryptPassword(data.password);
      const currentDate = dateToMySql(new Date().toString());
      const newData = { ...data, last_login: currentDate };
      const result = await db(tbName).insert(newData);
      return { result: result[0] };
    } catch (error) {
      throw new Error("error create");
    }
  }

  //update
  async updateOne(
    id: number,
    data: IProviderForm
  ): Promise<{ result: number }> {
    try {
      if (data.password) {
        data.password = encryptPassword(data.password);
      }
      const result = await db(tbName).where({ id }).update(data);
      return { result };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  //check duplicate
  async checkDuplicate(name: string, id = 0): Promise<number> {
    try {
      const query = await db(tbName)
        .where({ name })
        .whereNot({ id })
        .where("provider_show", 0)
        .first();
      return query ? 1 : 0;
    } catch (error) {
      throw new Error("Error check duplicate");
    }
  }

  //ผู้ซ่อมที่เหมาะกับงาน
  async findManyForIssue(
    query: IProviderQuery,
    id: string
  ): Promise<{ result: object[]; totalPage: number; totalItem: number }> {
    const { txtSearch, page, limit, sortField, sortDirection, issue_id } =
      query;
    const offset = page * limit;

    const baseQuery = db(tbName)
      .where("name", "LIKE", `%${txtSearch}%`)
      .andWhere("provider_show", 0)
      .whereIn("status", [1, 3]);

    try {
      //ดึงตามไอดี ถ้าตรงกับประเภทงาน
      const providerSelect = baseQuery
        .clone()
        .select(
          "id",
          "name",
          "status",
          "last_login",
          "available",
          db.raw(`
          (SELECT 
            CASE 
              WHEN issue_id1 = ${issue_id} THEN 1
              WHEN issue_id2 = ${issue_id} THEN 1
              WHEN issue_id3 = ${issue_id} THEN 1
              WHEN issue_id4 = ${issue_id} THEN 1
              WHEN issue_id5 = ${issue_id} THEN 1
              ELSE 2 
            END 
          ) AS sort_order
        `)
        )
        .where({ id });
      //ดึงทุกอันยกเว้นตรงกับไอดี
      const provider = baseQuery
        .clone()
        .select(
          "id",
          "name",
          "status",
          "last_login",
          "available",
          db.raw(`
          (SELECT 
            CASE 
              WHEN issue_id1 = ${issue_id} THEN 3
              WHEN issue_id2 = ${issue_id} THEN 3
              WHEN issue_id3 = ${issue_id} THEN 3
              WHEN issue_id4 = ${issue_id} THEN 3
              WHEN issue_id5 = ${issue_id} THEN 3
              ELSE 4 
            END 
          ) AS sort_order
        `)
        )
        .whereNot({ id });
      //1 2 3 4 หมายถึงเอาไว้เรียงเพื่อให้เวลาเลือกผุ้ซ่อมจะได้แสดงเป็นคนแรก ถึงจะไม้เหมาะสมกับประเภทงานแต่จะแสดงอันดับแรก แล้วตามด้วยผู้ซ่อมที่ตรงตามประเภทงาน
      const result = await db
        .union([providerSelect, provider], true)
        .orderBy([
          { column: "sort_order", order: "asc" },
          { column: sortField, order: sortDirection },
        ])
        .limit(limit)
        .offset(offset);

      const rowCount = await baseQuery
        .clone()
        .count({ countId: `${tbName}.id` })
        .first();

      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = await pagination(totalItem, limit);

      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Error find many for issue");
    }
  }
}
