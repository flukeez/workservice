import db from "@/database";
import { IAmphure } from "@/types/AmphureType";
import { ITumbol } from "@/types/TumbolType";

const tbName = "tb_tumbol";
export class TumbolModel {
  async findMany(id: number): Promise<{ result: ITumbol[] }> {
    try {
      const result = await db(tbName)
        .select("id", "tumbol_name")
        .where("amphure_id", id)
        .orderBy("tumbol_name", "asc");
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
}
