import db from "@/database";
import { IProvince } from "@/types/ProvinceType";

const tbName = "tb_province";
export class ProvinceModel {
  async findMany(): Promise<{ result: IProvince[] }> {
    try {
      const result = await db(tbName)
        .select("id", "province_name")
        .orderBy("province_name", "asc");
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
}
