import * as yup from "yup";
export const positionInitialValues = {
  name: "",
  faculty_id: "",
  super_admin: false,
};

export const positionYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อตําแหน่งงาน")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  faculty_id: yup.string().required("กรุณาเลือกหน่วยงาน"),
  super_admin: yup.boolean().default(false),
});
