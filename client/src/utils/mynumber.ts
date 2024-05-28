/**
 * แปลงค่าที่ได้รับมาเป็นตัวเลข หากเป็นตัวหนังสือจะคืนค่า 0
 * @param value
 * @returns value  หรือ 0
 */
const convertToNumberOrZero = (value: string | number | undefined | null) => {
  const numbericValue = Number(value);
  return Number.isNaN(numbericValue) ? 0 : numbericValue;
};

const convertToDecimal = (
  value: string | number | undefined | null,
  fixDecimal: number
) => {
  const newValue = convertToNumberOrZero(value).toFixed(fixDecimal);
  return convertToNumberOrZero(newValue);
};

export { convertToNumberOrZero, convertToDecimal };
