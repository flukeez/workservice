import db from "@/database";
import { pagination } from "@/utils/pagination";
import type {
  IPriority,
  IPriorityForm,
  IPriorityQuery,
} from "@/types/PriorityType";

const tbName = "tb_priority";

export class PriorityModel {
  //find all
  async findMany(
    query: IPriorityQuery
  ): Promise<{ result: IPriority[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .where("name", "LIKE", `%${txtSearch}%`)
      .where("priority_show", 0);

    try {
      const result = await baseQuery
        .clone()
        .orderBy(sortField, sortDirection)
        .offset(offset)
        .limit(limit);
      const rowCount = await baseQuery.clone().count({ countId: "id" }).first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  //find by id
  async findById(id: number): Promise<{ result: IPriority }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in FindyById:", error);
      throw error;
    }
  }
  //save one
  async createOne(data: IPriorityForm): Promise<{ result: number }> {
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

  //update
  async update(id: number, data: IPriorityForm): Promise<{ result: number }> {
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

  //delete one
  async deleteOne(id: number): Promise<{ result: number }> {
    try {
      const result = await db(tbName).where({ id }).update("priority_show", 1);
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
        .where("priority_show", 0)
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
