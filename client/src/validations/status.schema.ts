import * as yup from "yup";
export const statusInitialValues = {
  name: "",
};
export const statusYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อสถานะงาน")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
});
