import { Card, Container, Table, Text } from "@mantine/core";

export default function TypeManage() {
  return (
    <>
      <Container fluid px="xs">
        <Card shadow="xs">
          <Text size="lg">ประเภทการจัดหา</Text>
          <Table striped highlightOnHover withColumnBorders>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ประเภทการจัดหา</th>
                <th>ครุภัณฑ์ (รายการ)</th>
                <th>สิ่งก่อสร้าง (รายการ)</th>
              </tr>
            </thead>
          </Table>
        </Card>
      </Container>
    </>
  );
}
