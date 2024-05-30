import { Dayjs, default as dayjs } from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";
import thLocale from "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(buddhistEra);
dayjs.locale(thLocale);

//แปลงวันที่จาก mysql แสดงเป็น พ.ศ
//รับค่าเป็น 2022-02-30
function dateToText(dateSql: any) {
  const validDate = dayjs(dateSql, "YYYY-MM-DD", true).isValid();
  if (!validDate) {
    return "";
  }

  let result = "";
  let year = dateSql.substring(0, 4);
  let month = dateSql.substring(5, 7);
  let day = dateSql.substring(8, 10);

  let yearThai = Number(year) + 543;
  if (Number(year) > 2200) {
    yearThai = Number(year);
  }

  result = `${day}/${month}/${yearThai}`;
  return result;
}
//เช็ควจำนวนวันตั้งแต่ล่าสุดจนถึงปัจจุบัน
function timeFormNow(dateSql: string) {
  return dayjs(dateSql).fromNow();
}
//สำหรับเช็ครูปแบบวันที่ว่าถูกต้องหรือไม่
function convertDate(dateSql: string) {
  console.log(dateSql);
  let date = dayjs(dateSql, "YYYY-MM-DD", true);
  if (!date.isValid()) {
    return "";
  }
  const year = date.year();
  //ถ้าปีน้อยกว่าปี 2200 ให้ถือว่าเป็นปีที่ส่งมาเป็น คศ
  if (year > 2100) {
    date = date.year(year - 543);
  }
  return date;
}

function formatDate(date: Dayjs | null, format: string) {
  return date ? date.format(format) : "";
}
function dateToMySql(dateSql: string) {
  const day = dayjs(dateSql, "DD/MM/YYYY", true).format("YYYY-MM-DD");
  const date: any = convertDate(day.toString());
  return formatDate(date, "YYYY-MM-DD");
}
//ตย
//แบบสั้น 	19 พ.ค. 67
//แบบยาว  19 พ.ค. 2567
function dateThai(dateSql: any, short = false) {
  const date: any = convertDate(dateSql);
  return formatDate(date, short ? "DD MMM BB" : "DD MMM BBBB");
}

//ตย
//แบบสั้น 	19 พฤษภาคม 67
//แบบยาว  19 พฤษภาคม 2567
function dateThaiLong(dateSql: any, short = false) {
  const date: any = convertDate(dateSql);
  return formatDate(date, short ? "DD MMM BBBB" : "DD MMMM BBBB");
}
// ตย
//แบบสั้น 	19/05/67
//แบบยาว  19/05/2567
function dateShort(dateSql: any, short = false) {
  const date: any = convertDate(dateSql);
  return formatDate(date, short ? "DD/MM/BB" : "DD/MM/BBBB");
}

//ตย
//แบบสั้น 	อา. 19 พ.ค. 2567
//แบบยาว  วันอาทิตย์ 19 พฤษภาคม 2567
function dayThai(dateSql: any, short = false) {
  const date: any = convertDate(dateSql);
  return formatDate(date, short ? "dd DD MMM BBBB" : "วันddddที่DD MMMM BBBB");
}

export {
  timeFormNow,
  dateToMySql,
  dateToText,
  dateThai,
  dayThai,
  dateThaiLong,
  dateShort,
};
