import * as yup from "yup";
export const facultyInitialValues = {
  name: "",
  faculty_id: "",
};
export const facultyPositionInitialValues = {
  user_id: "",
  pos_id: null,
  fac_id: "",
};
export const facultyYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อหน่วยงาน")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  faculty_id: yup.string().notRequired().default(""),
});

export const facultyPositionYup = yup.object().shape({
  user_id: yup.string().required("กรุณาเลือกบุคคล").default(""),
  pos_id: yup.string().nullable().default(null),
  fac_id: yup.string().required("กรุณาเลือกหน่วยงาน").default(""),
});
