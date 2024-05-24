import * as yup from "yup";
export const customerInitialValues = {
  ctype_id: "",
  name: "",
  address: "",
  tel: "",
  contact: "",
  price: "",
  insale: "",
  paydate: "",
  note: "",
};

export const customerYup = yup.object().shape({
  ctype_id: yup.string().required("เลือกประเภทสินค้า").nullable(),
  name: yup
    .string()
    .required("กรุณากรอกชื่อลูกค้า")
    .max(200, "ห้ามเกิน 200 ตัวอักษร")
    .nullable(),
  address: yup.string().nullable(),
  tel: yup
    .string()
    .required("กรุณากรอกเบอร์โทร")
    .max(100, "ห้ามเกิน 100 ตัวอักษร")
    .nullable(),
  contact: yup
    .string()
    .required("กรุณากรอกผู้ติดต่อ")
    .max(100, "ห้ามเกิน 100 ตัวอักษร")
    .nullable(),
  price: yup.number().required("กรุณากรอกราคา").typeError("กรุณากรอกตัวเลข"),
  insale: yup.string().nullable(),
  paydate: yup.string().nullable(),
  note: yup.string().nullable(),
});
