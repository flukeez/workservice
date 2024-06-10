import * as yup from "yup";

export const requestYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่องานซ่อม")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  issue_id: yup.string().required("กรุณาเลือกประเภทงาน"),
  issue_sub_id: yup.string().default("").notRequired(),
  priority_id: yup.string().required("กรุณาเลือกความเร่งด่วน"),
  equip_id: yup.array().of(yup.string()).required("กรุณาเลือกอุปกรณ์"),
  details: yup
    .string()
    .max(500, "ห้ามเกิน 500 ตัวอักษร")
    .default("")
    .notRequired(),
  image: yup
    .array()
    .of(
      yup
        .mixed()
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
        .nullable()
    )
    .max(5, "สามารถอัปโหลดได้สูงสุด 5 รูป")
    .default([]),
});
