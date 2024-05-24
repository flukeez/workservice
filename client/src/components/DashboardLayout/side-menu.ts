import {
  IconArchiveFilled,
  IconDashboard,
  IconNews,
  IconStack2Filled,
  IconTools,
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
    title: "หน่วยงาน",
    path: "/faculty",
    icon: IconArchiveFilled,
  },
  {
    title: "ข้อมูลพื้นฐาน",
    path: "#",
    icon: IconStack2Filled,
    childPath: ["/info"],
    subMenuItems: [
      { title: "ประเภทปัญหา", path: "/issue" },
      { title: "ตำแหน่งงาน", path: "/position" },
    ],
  },
];
