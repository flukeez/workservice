import * as yup from "yup";

export const userInitialValues = {
  id: null,
  id_card: "",
  firstname: "",
  surname: "",
  nickname: "",
  sex: null,
  birthday: null,
  address: "",
  province_id: "",
  amphure_id: "",
  tumbol_id: "",
  phone: "",
  email: "",
  line: "",
  line_token: "",
  username: "",
  password: "",
  con_password: "",
  image: null,
};

export const userYup = yup.object().shape({
  id: yup.number().default(null).nullable(),
  id_card: yup
    .string()
    .required("กรุณากรอกเลขบัตรประชาชน")
    .length(13, "เลขบัตรประชาชนต้องมี 13 หลัก"),
  firstname: yup
    .string()
    .required("กรุณากรอกชื่อจริง")
    .max(100, "ห้ามเกิน 100 ตัวอักษร"),
  surname: yup
    .string()
    .required("กรุณากรอกนามสกุล")
    .max(100, "ห้ามเกิน 100 ตัวอักษร"),
  nickname: yup
    .string()
    .notRequired()
    .default("")
    .max(30, "ห้ามเกิน 30 ตัวอักษร"),
  sex: yup.string().nullable().default(null).max(3, "ข้อมูลไม่ถูกต้อง"),
  birthday: yup.string().nullable().default(null).typeError("วันที่ไม่ถูกต้อง"),
  address: yup
    .string()
    .notRequired()
    .default("")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  province_id: yup.string().notRequired().default(""),
  amphure_id: yup.string().notRequired().default(""),
  tumbol_id: yup.string().notRequired().default(""),
  phone: yup.string().notRequired().default("").max(10, "ห้ามเกิน 10 ตัวอักษร"),
  email: yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").notRequired().default(""),
  line: yup.string().notRequired().default("").max(50, "ห้ามเกิน 50 ตัวอักษร"),
  line_token: yup
    .string()
    .notRequired()
    .default("")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  username: yup
    .string()
    .required("กรุณากรอกชื่อเข้าใช้งาน")
    .min(6, "ชื่อเข้าใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
    .max(32, "ชื่อเข้าใช้งานต้องมีความยาวไม่เกิน 32 ตัวอักษร")
    .matches(
      /^[a-zA-Z0-9]{6,32}$/,
      "ชื่อเข้าใช้งานต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น"
    ),
  password: yup
    .string()
    .notRequired()
    .default("")
    .when("id", {
      is: (id: string | number) => !!id,
      then: (schema) =>
        schema.when("password", {
          is: (password: string) => !!password,
          then: (schema) =>
            schema
              .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
              .max(32, "รหัสผ่านต้องมีความยาวไม่เกิน 32 ตัวอักษร")
              .matches(
                /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/]).*(?=.*[0-9]).*(?=.*[a-zA-Z]).*$/,
                "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
              )
              .default(""),
          otherwise: (schema) => schema,
        }),
      otherwise: (schema) =>
        schema
          .required("กรุณากรอกรหัสผ่าน")
          .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
          .max(32, "รหัสผ่านต้องมีความยาวไม่เกิน 32 ตัวอักษร")
          .matches(
            /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/]).*(?=.*[0-9]).*(?=.*[a-zA-Z]).*$/,
            "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
          ),
    }),

  con_password: yup
    .string()
    .notRequired()
    .default("")
    .when("id", {
      is: (id: string | number) => !!id,
      then: (schema) =>
        schema.when("password", {
          is: (password: string) => !!password,
          then: (schema) =>
            schema
              .required("กรุณากรอกยืนยันรหัสผ่าน")
              .oneOf([yup.ref("password")], "รหัสผ่านไม่ตรงกัน"),
          otherwise: (schema) => schema,
        }),
      otherwise: (schema) =>
        schema
          .required("กรุณากรอกยืนยันรหัสผ่าน")
          .oneOf([yup.ref("password")], "รหัสผ่านไม่ตรงกัน"),
    }),

  image: yup
    .mixed()
    .test("fileSize", "ไฟล์รูปภาพขนาดห้ามเกิน 2 MB", (value) => {
      if (!value) {
        return true;
      }
      if (
        value instanceof File && // ตรวจสอบว่า value เป็น instance ของ File หรือไม่
        "size" in value &&
        typeof value.size === "number"
      ) {
        return value.size <= 2 * 1024 * 1024;
      } else {
        return true;
      }
    })
    .nullable()
    .default(null),
});
