import db from "@/database";
import { pagination } from "@/utils/pagination";
import type { IProviderQuery } from "@/types/ProviderType";

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
          "tel",
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
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }
}
