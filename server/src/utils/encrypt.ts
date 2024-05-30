const bcrypt = require("bcrypt");

// ฟังก์ชันสำหรับเข้ารหัสรหัสผ่าน
export function encryptPassword(password: string) {
  const saltRounds = 10; // จำนวนรอบในการให้ความปลอดภัยของการ hash

  // สร้าง salt
  const salt = bcrypt.genSaltSync(saltRounds);

  // ทำการ hash รหัสผ่าน
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
}

// ฟังก์ชันสำหรับตรวจสอบรหัสผ่านเมื่อล็อคอิน
export function comparePassword(inputPassword: string, hashedPassword: string) {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}
