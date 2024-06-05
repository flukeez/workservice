import {
  IconArchiveFilled,
  IconBriefcaseFilled,
  IconDashboard,
  IconNews,
  IconStack2Filled,
  IconTools,
  IconUserFilled,
} from "@tabler/icons-react";

import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  { title: "หน้าหลัก", path: "/", icon: IconDashboard },
  {
    title: "ข้อมูลประเภทสินค้า",
    path: "#",
    icon: IconTools,
    childPath: ["/ctype", "/customer_chart"],
    subMenuItems: [
      { title: "ประเภทสินค้า", path: "/ctype" },
      { title: "สรุปจำนวนลูกค้า", path: "/customer_chart" },
    ],
  },
  {
    title: "ข้อมูลลูกค้า",
    path: "#",
    icon: IconNews,
    childPath: ["/customer"],
    subMenuItems: [
      { title: "ลูกค้า", path: "/customer" },
      { title: "สรุปลูกค้า", path: "/customer-total" },
    ],
  },
  {
    title: "รายการอุปกรณ์",
    path: "/equipment",
    icon: IconArchiveFilled,
  },
  {
    title: "รายชื่อผู้ใช้",
    path: "/user",
    childPath: ["/user/new", "/user/:id"],
    icon: IconUserFilled,
  },
  {
    title: "หน่วยงาน",
    path: "#",
    icon: IconBriefcaseFilled,
    childPath: ["/faculty", "/position", "/assign", "/faculty/organize_chart"],
    subMenuItems: [
      { title: "หน่วยงาน", path: "/faculty" },
      { title: "ตำแหน่งงาน", path: "/position" },
      { title: "มอบหมายตำแหน่งงาน", path: "/assign" },
    ],
  },
  {
    title: "ข้อมูลพื้นฐาน",
    path: "#",
    icon: IconStack2Filled,
    childPath: ["/category", "/equip_status", "/issue", "/priority", "/status"],
    subMenuItems: [
      { title: "ประเภทอุปกรณ์", path: "/category" },
      { title: "สถานะอุปกรณ์", path: "/equip_status" },
      { title: "สถานะงาน", path: "/status" },
      { title: "ลําดับความสําคัญ", path: "/priority" },
      { title: "ประเภทปัญหา", path: "/issue" },
    ],
  },
];
