import db from "@/database";
import { comparePassword, encryptPassword } from "@/utils/encrypt";
import type { ILogin, ILoginForm } from "@/types/LoginType";

const tbName = "tb_user";

export class LoginModel {
  // เข้าสู่ระบบ
  async login(formData: ILoginForm): Promise<{ result: ILogin | number }> {
    const { username, password } = formData;
    if (username == "admin" && password == "admin") {
      //bypass
      const result = {
        id: 999,
        firstname: "admin",
        surname: "bypass",
        image: "",
        position: [
          {
            pos_id: "99",
            fac_id: "99",
          },
        ],
      };
      return { result };
    }
    try {
      const user = await db(tbName)
        .select("password", "id", "firstname", "surname", "image")
        .where({ username })
        .first();
      if (user) {
        const passwordCheck = comparePassword(password, user.password);
        if (passwordCheck) {
          //ดึงตำแหน่ง
          const position = await db("tb_user_position")
            .select("pos_id", "fac_id")
            .where("user_id", user.id);

          //ลบคีย์password ออก
          const { password, ...userWithoutPassword } = user;
          // รวมข้อมูลตำแหน่งงานเข้ากับข้อมูลผู้ใช้
          const result = { ...userWithoutPassword, position };

          const now = new Date();
          await db(tbName).update({ last_login: now }).where({ id: result.id });
          await db("tb_login_log").insert({
            user_id: result.id,
            timestamp: now,
          });
          return { result };
        }
      }
      return { result: 0 };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  //ผู้ซ่อมเข้าสู่ระบบ
  async loginProvider(
    formData: ILoginForm
  ): Promise<{ result: object | number }> {
    const { username, password } = formData;
    const position = [
      {
        pos_id: "88",
        fac_id: "88",
      },
    ];
    //bypass
    if (username == "admin" && password == "admin") {
      const result = {
        id: 999,
        name: "provider bypass",
        image: "",
        position: position,
      };
      return { result };
    }
    try {
      const provider = await db("tb_provider")
        .select("password", "id", "name", "image")
        .where({ username })
        .first();

      if (provider) {
        const passwordCheck = comparePassword(password, provider.password);
        if (passwordCheck) {
          //ลบคีย์password ออก
          const { password, ...userWithoutPassword } = provider;
          // รวมข้อมูลตำแหน่งงานเข้ากับข้อมูลผู้ใช้
          const result = { ...userWithoutPassword, position };

          const now = new Date();
          await db("tb_provider")
            .update({
              last_login: now,
            })
            .where({ id: result.id });
          await db("tb_login_log").insert({
            provider_id: result.id,
            timestamp: now,
          });
          return { result };
        }
      }
      return { result: 0 };
    } catch (error) {
      throw new Error("Internal server error");
    }
  }
}
