import db from "@/database";
import { pagination } from "@/utils/pagination";
import type { IUser, IUserData, IUserForm, IUserQuery } from "@/types/UserType";

const tbName = "tb_user";
export class UserModel {
  //find all
  async findMany(
    query: IUserQuery
  ): Promise<{ result: IUser[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .where("firstname", "LIKE", `%${txtSearch}%`)
      .orWhere("surname", "LIKE", `%${txtSearch}%`)
      .orWhere("nickname", "LIKE", `%${txtSearch}%`)
      .orWhere("username", "LIKE", `%${txtSearch}%`);
    try {
      const result = await baseQuery
        .clone()
        .select(
          "id",
          "firstname",
          "surname",
          "nickname",
          "image",
          "username",
          "phone",
          "last_login"
        )
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
  async findById(id: number): Promise<{ result: IUserData }> {
    try {
      const result = await db(tbName).where({ id }).first();
      return { result };
    } catch (error) {
      console.error("Error in FindyById:", error);
      throw error;
    }
  }
  //create one
  async createOne(data: IUserForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(
        data.id_card,
        data.firstname,
        data.surname
      );
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
  async update(id: number, data: IUserForm): Promise<{ result: number }> {
    try {
      const checkDuplicate = await this.checkDuplicate(
        data.id_card,
        data.firstname,
        data.surname,
        id
      );
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
  //delete
  async deleteOne(id: number): Promise<{ result: number }> {
    try {
      const result = await db(tbName).where({ id }).update("user_show", 1);
      return { result };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  //check duplicate
  async checkDuplicate(
    id_card: string,
    firstname: string,
    surname: string,
    id = 0
  ): Promise<number> {
    try {
      const query = await db(tbName)
        .where(function () {
          this.where({
            id_card,
          }).orWhere({ firstname, surname });
        })
        .whereNot({ id })
        .where("user_show", 0)
        .first();
      return query ? 1 : 0;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Internal server error");
    }
  }
}
