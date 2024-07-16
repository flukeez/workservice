import * as yup from "yup";
export const priorityInitialValues = {
  name: "",
};
export const priorityYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อความเร่งด่วน")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
});
