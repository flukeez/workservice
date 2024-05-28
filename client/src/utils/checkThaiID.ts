function checkThaiID(id: string) {
  //by pass
  if (id == "0000000000000") return true;
  const digits = id.split("").map(Number);
  const checkDigit = digits.pop(); // เอาหลักที่ 13 ออกมา

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (13 - i);
  }

  const calculatedCheckDigit = (11 - (sum % 11)) % 10;
  return checkDigit === calculatedCheckDigit;
}
export { checkThaiID };
