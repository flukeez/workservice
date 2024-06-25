import db from "@/database";

const tbName = "tb_provider";

export default class ProviderModel {
  async findMany(): Promise<{ result: object[]; totalItem: number }> {
    try {
      const result = await db(tbName).select("*");
      return { result, totalItem: result.length };
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
