import { useState } from "react";

import cx from "clsx";
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  rem,
  ActionIcon,
  Tooltip,
  Indicator,
} from "@mantine/core";
import {
  IconLogout,
  IconChevronDown,
  IconUser,
  IconBellFilled,
  IconCalendarFilled,
} from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { useLoginStore } from "@/stores/useLoginStore";
import { BASE_URL } from "@/config";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const loginStore = useLoginStore();

  const logout = () => {
    loginStore.resetFilter();
    navigate("/login");
  };
  return (
    <Group>
      <Tooltip label="ปฏิทินนัดหมาย">
        <Indicator inline size={7} color="red">
          <ActionIcon variant="white" color="gray">
            <IconCalendarFilled size="1.4rem" />
          </ActionIcon>
        </Indicator>
      </Tooltip>
      <Tooltip label="การแจ้งเตือน">
        <Indicator inline size={7} color="green">
          <ActionIcon variant="white" color="gray">
            <IconBellFilled size="1.4rem" />
          </ActionIcon>
        </Indicator>
      </Tooltip>
      <Menu
        width={200}
        withArrow
        arrowPosition="center"
        position="bottom-end"
        transitionProps={{ transition: "pop-top-right" }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={cx(classes.user, {
              [classes.userActive]: userMenuOpened,
            })}
          >
            <Group gap={7}>
              {loginStore.image ? (
                <Avatar src={`${BASE_URL}/images/user/${loginStore.image}`} />
              ) : (
                <Avatar color="blue">
                  {loginStore.fullname.substring(0, 2)}
                </Avatar>
              )}
              <Text fw={500} size="sm" lh={1} ml={15} mr={3}>
                {loginStore.fullname}
              </Text>
              <IconChevronDown
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconUser
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={() => navigate("/profile")}
          >
            ข้อมูลส่วนตัว
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={() => logout()}
          >
            ออกจากระบบ
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
