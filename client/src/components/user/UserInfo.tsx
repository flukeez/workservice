import { Avatar, Group, Highlight } from "@mantine/core";

interface UserInfoProps {
  firstname: unknown;
  surname: unknown;
  nickname: unknown;
  image?: unknown;
  highlight: string;
}

export default function UserInfo({
  firstname,
  surname,
  nickname,
  image,
  highlight,
}: UserInfoProps) {
  const nicknameText = nickname ? " (" + String(nickname) + ")" : "";
  const name = String(firstname) + " " + String(surname) + nicknameText;
  const imageIcon = image ? (
    <Avatar src={`http://localhost:4000/api/images/user/${image}`} />
  ) : (
    <Avatar color="blue">{name.substring(0, 2)}</Avatar>
  );
  return (
    <Group wrap="nowrap">
      {imageIcon}
      <Highlight size="sm" highlight={highlight}>
        {name}
      </Highlight>
    </Group>
  );
}
