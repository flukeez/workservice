import * as yup from "yup";
export const facultyInitialValues = {
  name: "",
  faculty_id: "",
};
export const facultyYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อหน่วยงาน")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  faculty_id: yup.string().required("กรุณาเลือกชื่อหน่วยงานต้นสังกัด"),
});
