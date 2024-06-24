import * as yup from "yup";

export const requestInitialValues = {
  id: null,
  name: "",
  issue_id: "",
  issue_sub_id: "",
  priority_id: "",
  equip_id: [] as string[],
  details: "",
  image: [],
};

export const requestYup = yup.object().shape({
  id: yup.number().default(null).notRequired(),
  name: yup
    .string()
    .required("กรุณากรอกชื่องานซ่อม")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  issue_id: yup.string().required("กรุณาเลือกประเภทงาน"),
  issue_sub_id: yup.string().default("").notRequired(),
  priority_id: yup.string().required("กรุณาเลือกความเร่งด่วน"),
  equip_id: yup
    .array()
    .of(yup.string().required("กรุณาเลือกอุปกรณ์"))
    .test("hasValidItem", "กรุณาเลือกอุปกรณ์อย่างน้อยหนึ่งชิ้น", (value) => {
      return value && value.length > 0 && value[0] !== "";
    })
    .default([""]),
  details: yup
    .string()
    .max(500, "ห้ามเกิน 500 ตัวอักษร")
    .default("")
    .notRequired(),
  image: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test("fileSize", "ไฟล์รูปภาพขนาดห้ามเกิน 2 MB", (value) => {
          if (!value) {
            return true;
          }
          if (
            value instanceof File &&
            "size" in value &&
            typeof value.size === "number"
          ) {
            return value.size <= 2 * 1024 * 1024; // ตรวจสอบขนาดไฟล์ไม่เกิน 2 MB
          } else {
            return true;
          }
        })
    )

    .default([]),
});
