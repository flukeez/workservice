import * as yup from "yup";
export const issueInitialValues = {
  name: "",
  issue_id: null,
};

export const issueYup = yup.object().shape({
  name: yup
    .string()
    .required("กรุณากรอกชื่อประเภทปัญหา")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  issue_id: yup.string().default(null).nullable(),
});
