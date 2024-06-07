import * as yup from "yup";
export const equipmentInitialValues = {
  id: null,
  name: "",
  code: "",
  serial: "",
  cate_id: null,
  price: 0,
  date_start: "",
  details: "",
  faculty_id: null,
  user_id: null,
  warranty: "",
  warranty_start: "",
  warranty_end: "",
  image: null,
  image_old: null,
};
export const equipmentYup = yup.object().shape({
  id: yup.number().default(null).nullable(),
  name: yup
    .string()
    .required("กรุณากรอกชื่ออุปกรณ์")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  code: yup.string().max(50, "ห้ามเกิน 50 ตัวอักษร").notRequired().default(""),
  serial: yup
    .string()
    .max(50, "ห้ามเกิน 50 ตัวอักษร")
    .notRequired()
    .default(""),
  cate_id: yup.string().notRequired().default(""),
  price: yup
    .number()
    .typeError("กรุณากรอกราคา")
    .min(0, "ราคาต้องมากกว่า 0")
    .required("กรุณากรอกราคา"),
  date_start: yup
    .string()
    .required("กรุณากรอกวันที่")
    .typeError("วันที่ไม่ถูกต้อง"),
  details: yup
    .string()
    .max(65000, "ห้ามเกิน 65000 ตัวอักษร")
    .notRequired()
    .default(""),
  faculty_id: yup.string().notRequired().default(""),
  user_id: yup.string().notRequired().default(null),
  warranty: yup
    .string()
    .notRequired()
    .default("")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  warranty_start: yup
    .string()
    .notRequired()
    .default("")
    .typeError("วันที่ไม่ถูกต้อง"),
  warranty_end: yup
    .string()
    .notRequired()
    .default("")
    .typeError("วันที่ไม่ถูกต้อง"),
  image: yup
    .mixed()
    .test("fileSize", "ไฟล์รูปภาพขนาดห้ามเกิน 2 MB", (value) => {
      if (!value) {
        return true;
      }
      if (
        value instanceof File && // ตรวจสอบว่า value เป็น instance ของ File หรือไม่
        "size" in value &&
        typeof value.size === "number"
      ) {
        return value.size <= 2 * 1024 * 1024;
      } else {
        return true;
      }
    })
    .nullable()
    .default(null),
  image_old: yup.string().notRequired().default(null),
});
