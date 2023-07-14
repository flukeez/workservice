import { IconBook2, IconDeviceDesktopAnalytics, IconTool } from "@tabler/icons-react";

export const MenuData = [
  { label: 'แดชบอร์ด', icon: IconDeviceDesktopAnalytics, pathActive: ['/dashboard'], link: '/dashboard' },
  {
    label: 'ข้อมูลพื้นฐาน',
    icon: IconTool,
    pathActive: ['/typeMoneys','/typeManages'],
    links: [
      { label: 'ประเภทเงิน', link: '/typeMoneys' },
      { label: 'ประเภทจัดหา', link: '/typeManages' }
    ]
  },

  { label: 'สารสนเทศ', icon: IconBook2, link: '/information', pathActive: ['/information'] },
];