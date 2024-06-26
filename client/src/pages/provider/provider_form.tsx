import ButtonNew from "@/components/common/ButtonNew";
import PageHeader from "@/components/common/PageHeader";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { Card, Grid, Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProviderForm() {
  const navigate = useNavigate();
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const listItems = [
    { title: "รายชื่อผู้ซ่อม", href: "/provider" },
    { title: "ข้อมูลผู้ซ่อม", href: "#" },
  ];

  const [title, setTitle] = useState("");
  useEffect(() => {
    setTitle(id ? "(รายละเอียด)" : "(เพิ่ม)");
  }, [id]);
  return (
    <>
      <PageHeader title={"ข้อมูลผู้ซ่อม " + title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <ButtonNew onClick={() => navigate("/provider/new")}>
              เพิ่มข้อมูล
            </ButtonNew>
          </Group>
        </Card.Section>
        <Grid mt="sm">
          <Grid.Col span={12}>
            <TextInput
              label="ชื่อผู้ซ่อม"
              placeholder="ชื่อผู้ซ่อม"
              withAsterisk
            />
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}
