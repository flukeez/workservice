import db from "@/database";
import { pagination } from "@/utils/pagination";
import type { IRequestForm, IRequestQuery } from "@/types/RequestType";

const tbName = "tb_request";
export class RequestModel {
  async findMany(
    query: IRequestQuery,
    user_id: number
  ): Promise<{ result: Object[]; totalItem: number; totalPage: number }> {
    const { txtSearch, page, limit, sortField, sortDirection } = query;
    const offset = page * limit;

    const baseQuery = db(tbName)
      .leftJoin("tb_issue as main_issue", `${tbName}.issue_id`, "main_issue.id")
      .leftJoin(
        "tb_issue as sub_issue",
        `${tbName}.issue_sub_id`,
        "sub_issue.id"
      )
      .leftJoin("tb_priority", `${tbName}.priority_id`, "tb_priority.id")
      .leftJoin("tb_faculty", `${tbName}.faculty_id`, "tb_faculty.id")
      .leftJoin(
        "tb_request_details",
        `${tbName}.id`,
        "tb_request_details.request_id"
      )
      .leftJoin("tb_user", `${tbName}.user_id`, "tb_user.id")
      .leftJoin("tb_status", `${tbName}.status_id`, "tb_status.id")
      .leftJoin("tb_provider", `${tbName}.provider_id`, "tb_provider.id")
      .where(`tb_request_details.name`, "LIKE", `%${txtSearch}%`)
      .andWhere(`${tbName}.user_id`, user_id);

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
          "tb_provider.name as provider_name",
          db.raw(
            "(select count(*) from tb_request_equip where tb_request_equip.request_id = tb_request.id) AS equip_count"
          )
        )
        .orderBy(sortField, sortDirection)
        .offset(offset)
        .limit(limit);

      const rowCount = await baseQuery
        .clone()
        .count({ countId: `${tbName}.id` })
        .first();
      const totalItem = Number(rowCount?.countId || 0);
      const totalPage = await pagination(totalItem, limit);
      return { result, totalItem, totalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }

  //find by id
  async findById(id: number): Promise<{ result: object }> {
    try {
      const result = await db(tbName)
        .select(
          "tb_request.id",
          "tb_request_details.name",
          "tb_request.issue_id",
          "tb_request.issue_sub_id",
          "tb_request.priority_id",
          "tb_request.faculty_id",
          "tb_request.user_id",
          "tb_request.status_id",
          "tb_request.provider_id",
          "tb_request.date_start",
          "tb_request.notify",
          "tb_request_details.details",
          " tb_request_details.image1",
          db.raw(`GROUP_CONCAT(tb_request_equip.equip_id) AS equip_id`),
          db.raw(`
          CONCAT_WS(',', 
              tb_request_details.image1, 
              tb_request_details.image2, 
              tb_request_details.image3, 
              tb_request_details.image4, 
              tb_request_details.image5) AS image
          `),
          db.raw(`
             CONCAT_WS(',', 
              tb_request_details.image1, 
              tb_request_details.image2, 
              tb_request_details.image3, 
              tb_request_details.image4, 
              tb_request_details.image5) AS image_old
          `)
        )
        .leftJoin(
          "tb_request_details",
          `${tbName}.id`,
          "tb_request_details.request_id"
        )
        .leftJoin(
          "tb_request_equip",
          `${tbName}.id`,
          "tb_request_equip.request_id"
        )
        .where("tb_request.id", id)
        .first();
      if (result) {
        // แปลง string ที่คั่นด้วยเครื่องหมายคอมมาเป็นอาเรย์
        result.image = result.image ? result.image.split(",") : [];
        result.image_old = result.image_old ? result.image_old.split(",") : [];
      }
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  //เพิ่มรายการใหม่
  async create(data: IRequestForm): Promise<{ result: number }> {
    try {
      await db.transaction(async (trx) => {
        //เพิ่มในตารางหลัก
        const requestData = {
          notify: 0,
          issue_id: data.issue_id,
          issue_sub_id: data.issue_sub_id,
          priority_id: data.priority_id,
          status_id: 2,
          faculty_id: data.faculty_id,
          user_id: data.user_id,
        };
        const request = await trx(tbName).insert(requestData);
        //ตารางรายละเอียด
        const image = data["image[]"];
        const requestDetail = {
          name: data.name,
          details: data.details,
          request_id: request[0],
          image1: image ? image[0] : null,
          image2: image ? image[1] : null,
          image3: image ? image[2] : null,
          image4: image ? image[3] : null,
          image5: image ? image[4] : null,
        };
        await trx("tb_request_details").insert(requestDetail);

        //เพิ่มรายการอุปกรณ์ที่แจ้งซ่อม
        if (!Array.isArray(data["equip_id[]"])) {
          data["equip_id[]"] = [data["equip_id[]"]];
        }
        const equip_id = data["equip_id[]"];
        await Promise.all(
          equip_id.map(async (item: string) => {
            //แก้ไขสถานะอุปกรณืเป็นส่งซ่อม
            await trx("tb_equip")
              .where({ id: item })
              .update({ equip_status_id: 2 });
            //เพิ่มลงตารางรายการอุปกรณ์แจ้งซ่อม
            return trx("tb_request_equip").insert({
              equip_id: item,
              request_id: request[0],
            });
          })
        );

        //เพิ่มลงตารางประวัติการซ่อม
        //แจ้งซ่อม
        await trx("tb_request_history").insert({
          request_id: request[0],
          status_id: 1,
          details: "แจ้งซ่อม",
        });
        //รอดำเนินการ
        await trx("tb_request_history").insert({
          request_id: request[0],
          status_id: 2,
        });
      });
      return { result: 1 };
    } catch (error) {
      console.log(error);
      throw new Error("Internal server");
    }
  }

  //รายละเอียดงานซอม
  async findByIdDetails(id: number): Promise<{ result: object }> {
    try {
      const result = await db(tbName)
        .select(
          "tb_request.id",
          "tb_request.date_start",
          db.raw(
            "CONCAT(tb_user.firstname, ' ', tb_user.surname) AS user_name"
          ),
          "tb_request_details.name as request_name",
          db.raw("GROUP_CONCAT(tb_equip.name) AS equip_name"),
          "tb_provider.name",
          "tb_status.name as status_name"
        )
        .leftJoin("tb_user", `${tbName}.user_id`, "tb_user.id")
        .leftJoin(
          "tb_request_details",
          `${tbName}.id`,
          "tb_request_details.request_id"
        )
        .leftJoin(
          "tb_request_equip",
          `${tbName}.id`,
          "tb_request_equip.request_id"
        )
        .leftJoin("tb_equip", `tb_equip.id`, "tb_request_equip.equip_id")
        .leftJoin("tb_provider", `${tbName}.provider_id`, "tb_provider.id")
        .leftJoin("tb_status", `${tbName}.status_id`, "tb_status.id")
        .where("tb_request.id", id)
        .first();

      if (result) {
        // แปลง string ที่คั่นด้วยเครื่องหมายคอมมาเป็นอาเรย์
        result.equip_name = result.equip_name
          ? result.equip_name.split(",")
          : [];
      }

      return { result };
    } catch (error) {
      throw new Error("Internal server");
    }
  }

  //TODO ประวัติสถานะงานซ่อม
  async findByIdHistory(id: number): Promise<{ result: object }> {
    try {
      const result = await db("tb_request_history")
        .select(
          "tb_request_history.timestamp",
          "tb_status.name",
          "tb_request_history.status_id"
        )
        .where("tb_request_history.request_id", id)
        .leftJoin("tb_status", `tb_request_history.status_id`, "tb_status.id")
        .orderBy("timestamp", "asc");
      return { result };
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error");
    }
  }
}
