import db from "@/database";
import { pagination } from "@/utils/pagination";
import type { IIssueQuery, IIssueForm, IIssue } from "@/types/IssueType";

const tbName = "tb_issue";
export class IssueModel {
  //ค้นหาทั้งหมด
  async findMany(
    query: IIssueQuery
  ): Promise<{ result: IIssue[]; totalPage: number; totalItem: number }> {
    const {
      txtSearch,
      page,
      limit,
      sortField,
      sortDirection,
      issue_type,
      issue_id,
    } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .leftJoin({ tbParent: tbName }, "tb_issue.issue_id", "tbParent.id")
      .where((builder) => {
        builder
          .where("tbParent.name", "LIKE", `%${txtSearch}%`)
          .orWhere(`${tbName}.name`, "LIKE", `%${txtSearch}%`);
      })
      .where((builder) => {
        if (issue_type) {
          builder.where("tb_issue.issue_type", issue_type);
        }
        if (issue_id) {
          builder.where("tb_issue.issue_id", issue_id);
        }
      })
      .andWhere(`${tbName}.issue_show`, 0);
    try {
      const result = await baseQuery
        .clone()
        .select(`${tbName}.id`, `${tbName}.name`, `tbParent.name as issue_name`)
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
  async findById(id: number): Promise<{ result: IIssue }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
  //เพิ่มใหม่ 1 รายการ
  async createOne(data: IIssueForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name);
      if (checkDuplicate) {
        return { result: 0 };
      }
      const result = await db(tbName).insert({
        ...data,
        issue_type: data.issue_id ? 1 : 0,
      });
      return { result: result[0] };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }
  //อัพเดท
  async update(id: number, data: IIssueForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(data.name, id);
      if (checkDuplicate !== 0) {
        return { result: 0 };
      }
      const result = await db(tbName)
        .where({ id })
        .update({
          ...data,
          issue_type: data.issue_id ? 1 : 0,
        });
      return { result };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }
  //ลบ
  async deleteOne(id: number): Promise<{ result: number }> {
    try {
      const result = await db(tbName).where({ id }).update("issue_show", 1);
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
        .where("issue_show", 0)
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
