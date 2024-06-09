import {
  IconArchiveFilled,
  IconArticleFilled,
  IconBriefcaseFilled,
  IconHomeFilled,
  IconLocationFilled,
  IconStack2Filled,
  IconUserFilled,
} from "@tabler/icons-react";

import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  { title: "หน้าหลัก", path: "/", icon: IconHomeFilled },
  { title: "แจ้งซ่อม", path: "/service_request", icon: IconLocationFilled },
  { title: "รายการแจ้งซ่อม", path: "/request", icon: IconArticleFilled },
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
    childPath: ["/faculty", "/position"],
    subMenuItems: [
      { title: "หน่วยงาน", path: "/faculty" },
      { title: "ตำแหน่งงาน", path: "/position" },
    ],
  },
  {
    title: "รายชื่อผู้ซ่อม",
    path: "/supervisor",
    icon: IconUserFilled,
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
