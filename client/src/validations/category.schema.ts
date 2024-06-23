import * as yup from "yup";
export const categoryInitialValues = {
  name: "",
  code: "",
};
export const categoryYup = yup.object().shape({
  code: yup
    .string()
    .required("กรอกรหัสประเภทอุปกรณ์")
    .default("")
    .max(10, "ห้ามเกิน 10 ตัวอักษร"),
  name: yup
    .string()
    .required("กรอกชื่อประเภทอุปกรณ์")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
});
