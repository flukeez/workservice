import db from "@/database";
import { pagination } from "@/utils/pagination";
import type { IWorkForm, IWorkQuery } from "@/types/WorkType";

const tbName = "tb_request";

//งานซ่อมสำหรับผู้ซ่อม
export default class WorkModel {
  //ค้นหาทั้งหมด สถานะงานรอดำเนินการ
  async findMany(
    query: IWorkQuery
  ): Promise<{ result: object[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .leftJoin("tb_user", `${tbName}.user_id`, "tb_user.id")
      .leftJoin(
        "tb_request_details",
        `${tbName}.id`,
        "tb_request_details.request_id"
      )
      .leftJoin("tb_status", `${tbName}.status_id`, "tb_status.id")
      .leftJoin("tb_issue as main_issue", `${tbName}.issue_id`, "main_issue.id")
      .leftJoin(
        "tb_issue as sub_issue",
        `${tbName}.issue_sub_id`,
        "sub_issue.id"
      )
      .leftJoin("tb_priority", `${tbName}.priority_id`, "tb_priority.id")
      .leftJoin("tb_faculty", `${tbName}.faculty_id`, "tb_faculty.id")
      .where(`tb_request_details.name`, "LIKE", `%${txtSearch}%`)
      .whereIn("tb_request.status_id", [2]);

    try {
      const result = await baseQuery
        .clone()
        .select(
          "tb_request.id",
          "tb_request_details.name",
          "tb_request.date_start",
          "tb_user.firstname",
          "tb_user.surname",
          "tb_faculty.name as faculty_name",
          "main_issue.name as issue_name",
          "sub_issue.name as issue_sub_name",
          "tb_priority.name as priority_name",
          "tb_status.name as status_name",
          db.raw(
            "(select count(*) from tb_request_equip where tb_request_equip.request_id = tb_request.id) AS equip_count"
          )
        )
        .orderBy(sortField, sortDirection)
        .offset(offset);

      const rowCount = await baseQuery
        .clone()
        .count({ countId: `${tbName}.id` })
        .first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = await pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      throw new Error("Error in FindMany: " + error);
    }
  }

  //ค้นหางานซ่อมจากสถานะงาน
  async findManyByStatus(
    query: IWorkQuery,
    status: string[],
    provider_id: number
  ): Promise<{ result: object[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;
    const baseQuery = db(tbName)
      .leftJoin("tb_user", `${tbName}.user_id`, "tb_user.id")
      .leftJoin(
        "tb_request_details",
        `${tbName}.id`,
        "tb_request_details.request_id"
      )
      .leftJoin("tb_status", `${tbName}.status_id`, "tb_status.id")
      .leftJoin("tb_issue as main_issue", `${tbName}.issue_id`, "main_issue.id")
      .leftJoin(
        "tb_issue as sub_issue",
        `${tbName}.issue_sub_id`,
        "sub_issue.id"
      )
      .leftJoin("tb_priority", `${tbName}.priority_id`, "tb_priority.id")
      .leftJoin("tb_faculty", `${tbName}.faculty_id`, "tb_faculty.id")
      .where(`tb_request_details.name`, "LIKE", `%${txtSearch}%`)
      .whereIn("tb_request.status_id", status)
      .where("tb_request.provider_id", provider_id);

    try {
      const result = await baseQuery
        .clone()
        .select(
          "tb_request.id",
          "tb_request_details.name",
          "tb_request_details.details",
          "tb_request.date_start",
          "tb_user.firstname",
          "tb_user.surname",
          "tb_faculty.name as faculty_name",
          "main_issue.name as issue_name",
          "sub_issue.name as issue_sub_name",
          "tb_priority.name as priority_name",
          "tb_status.name as status_name",
          db.raw(
            "(select count(*) from tb_request_equip where tb_request_equip.request_id = tb_request.id) AS equip_count"
          ),
          db.raw(
            "(SELECT max(timestamp) from tb_request_history WHERE tb_request_history.request_id = tb_request.id) AS update_time"
          )
        )

        .orderBy(sortField, sortDirection)
        .offset(offset);

      const rowCount = await baseQuery
        .clone()
        .count({ countId: `${tbName}.id` })
        .first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = await pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      throw new Error("Error in FindManyByStatus: " + error);
    }
  }

  // รับงานซ่อม
  async submitWork(
    id: number,
    provider_id: number
  ): Promise<{ result: number }> {
    const result = await db(tbName)
      .update({ status_id: 4, provider_id })
      .where({ id });

    //log history
    await db("tb_request_history").insert({
      request_id: id,
      status_id: 4,
      details: "รับงานซ่อม",
    });
    return { result };
  }

  //เช็คสถานะงานซ่อม
  async updateStatus(id: number, data: IWorkForm): Promise<{ result: number }> {
    const status = data.status_id;
    try {
      let requestForm;
      //การส่งงานซ่อม
      if (status === "7") {
        requestForm = {
          status_id: status,
          total_cost: data.total_cost,
          date_end: new Date(),
          //อัพเดทสถานะใน ตารางรายละเอียด
        };
        await db("tb_request_details")
          .update({
            resolution: data.resolution,
            request_cost: data.request_cost,
            parts_cost: data.parts_cost,
            other_cost: data.other_cost,
            vat: data.vat,
          })
          .where({ request_id: id });
      } else {
        requestForm = {
          status_id: status,
        };
      }

      //อัพเดทสถานนะในตารางหลัก
      await db(tbName).update(requestForm).where({ id });
      //เพิ่มสถานะในตารางประวัติงารซ่อม
      await db("tb_request_history").insert({
        request_id: id,
        status_id: status,
        details: data.details,
        image: data.image,
      });
      return { result: 1 };
    } catch (error) {
      console.log(error);
      throw new Error("Error in update status");
    }
  }

  //เช็คสถานะงาน
  /**
   *
   * @param id
   * @param status[]
   * @returns number ถ้าเป็นจริงจะ return 1
   */
  async checkStatus(id: number, status: number[]): Promise<number> {
    const validate = await db(tbName)
      .select("id")
      .where({ id })
      .whereIn("status_id", status)
      .first();
    return validate ? 1 : 0;
  }
}
