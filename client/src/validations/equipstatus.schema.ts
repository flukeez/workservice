import * as yup from "yup";
export const equipStatusInitialValues = {
  name: "",
};
export const equipStatusYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อสถานะอุปกรณ์")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
});
