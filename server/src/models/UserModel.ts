import db from "@/database";
import { pagination } from "@/utils/pagination";
import { encryptPassword } from "@/utils/encrypt";
import { dateToMySql } from "@/utils/mydate";
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
      .where((builder) => {
        builder
          .where("firstname", "LIKE", `%${txtSearch}%`)
          .orWhere("surname", "LIKE", `%${txtSearch}%`)
          .orWhere("nickname", "LIKE", `%${txtSearch}%`)
          .orWhere("username", "LIKE", `%${txtSearch}%`);
      })
      .where("user_show", 0);
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
      const result = await db(tbName)
        .select(
          "id",
          "id_card",
          "firstname",
          "surname",
          "nickname",
          "sex",
          "birthday",
          "address",
          "province_id",
          "amphure_id",
          "tumbol_id",
          "phone",
          "email",
          "line",
          "line_token",
          "username",
          "image"
        )
        .where({ id })
        .first();
      return { result };
    } catch (error) {
      console.error("Error in FindyById:", error);
      throw error;
    }
  }
  //create one
  async createOne(data: IUserForm): Promise<{ result: number }> {
    try {
      if (data.birthday) {
        data = { ...data, birthday: dateToMySql(data.birthday) };
      }
      data = { ...data, password: encryptPassword(data.password!) };
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
      if (data.birthday) {
        console.log(data.birthday);
        data = { ...data, birthday: dateToMySql(data.birthday) };
        console.log(dateToMySql(data.birthday!));
      }
      if (data.password) {
        data = { ...data, password: encryptPassword(data.password) };
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
    username: string,
    id = 0
  ): Promise<number> {
    try {
      const query = await db(tbName)
        .where(function () {
          this.where({
            id_card,
          })
            .andWhere({ firstname, surname })
            .orWhere({ username });
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
