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
        surname: "bypaass",
        image: "",
      };
      return { result };
    }
    const user = await db(tbName)
      .select("password", "id", "firstname", "surname", "image")
      .where({ username })
      .first();
    if (user) {
      const passwordCheck = comparePassword(password, user.password);
      if (passwordCheck) {
        //ลบคีย์password ออก
        const { password, ...result } = user;
        const now = new Date();
        await db(tbName).update({ last_login: now }).where({ id: result.id });
        await db("tb_login_log").insert({ user_id: result.id, timestamp: now });

        return { result };
      }
    }
    return { result: 0 };
  }
}
