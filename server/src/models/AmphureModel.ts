import db from "@/database";
import { IAmphure } from "@/types/AmphureType";

const tbName = "tb_amphure";
export class AmphureModel {
  async findMany(id: number): Promise<{ result: IAmphure[] }> {
    try {
      const result = await db(tbName)
        .select("id", "amphure_name")
        .where("province_id", id)
        .orderBy("amphure_name", "asc");
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
}
