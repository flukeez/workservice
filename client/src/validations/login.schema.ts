import * as yup from "yup";

export const loginInitialValues = {
  username: "",
  password: "",
};
export const loginYup = yup.object().shape({
  username: yup.string().required("กรุณากรอกชื่อผู้ใช้งาน").default(""),
  password: yup.string().required("กรุณากรอกรหัสผ่าน").default(""),
});
