import * as yup from "yup";
export const positionInitialValues = {
  name: "",
  super_admin: false,
};

export const positionYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อตําแหน่งงาน")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  super_admin: yup.boolean().default(false),
});
