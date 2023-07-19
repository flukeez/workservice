import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Axios from "axios";

import { Card, Input, Text, Button, Group } from "@mantine/core";
import { createStyles } from "@mantine/core";
import { useEffect } from "react";
import BreadcrumbNavigation from "@/components/breadcrumb_navigation/BreadcrumbNavigation";

interface TypeManage {
  id?: number;
  code: string;
  money_type: string;
  durable_goods: number;
  building: number;
}
export default function FormTypeMange() {
  interface Inputs {
    code: string;
    manage_type: string;
    durable_goods: number;
    building: number;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchTypeManage = async (id: string) => {
    const response = await Axios.get<{ row: TypeManage[] }>(
      `http://localhost:4000/api/typeManages/${id}`
    );
    reset(...response.data.row);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (id) {
        const response = await Axios.put(
          `http://localhost:4000/api/typeManages/${id}`,
          data
        );
      } else {
        const response = await Axios.post(
          `http://localhost:4000/api/typeManages/create`,
          data
        );
      }
    } catch (error) {
      console.log(error);
    }

    navigate("/typeManages");
  };

  useEffect(() => {
    if (id) {
      void fetchTypeManage(id);
    }
  }, []);

  return (
    <>
      <BreadcrumbNavigation
        label={id ? "แก้ไขข้อมูลประเภทการจัดการ" : "ประเภทการจัดหา"}
      />
      <Card shadow="xs" mt="sm">
        <Input.Wrapper
          label="รหัส"
          required
          mx="auto"
          error={errors.code && errors.code.message}
        >
          <Input
            placeholder="รหัส"
            error={errors.code ? errors.code.message : ""}
            {...register("code", {
              required: "ป้อนรหัส",
            })}
          />
        </Input.Wrapper>
        <Input.Wrapper
          mt="xs"
          label="ประเภทการจัดหา"
          required
          mx="auto"
          error={errors.manage_type && errors.manage_type.message}
        >
          <Input
            placeholder="ประเภทการจัดหา"
            error={errors.manage_type ? errors.manage_type.message : ""}
            {...register("manage_type", {
              required: "ป้อนประเภทของการจัดหา",
            })}
          />
        </Input.Wrapper>
        <Input.Wrapper
          mt="xs"
          label="ครุภัณฑ์"
          required
          mx="auto"
          error={errors.durable_goods && errors.durable_goods.message}
        >
          <Input
            type="number"
            placeholder="ครุภัณฑ์"
            error={errors.durable_goods ? errors.durable_goods.message : ""}
            {...register("durable_goods", {
              required: "ระบุจำนวนครุภัณฑ์",
              min: {
                value: 0,
                message: "ค่าจำนวนครุภัณฑ์ต้องไม่น้อยกว่า 0",
              },
            })}
          />
        </Input.Wrapper>
        <Input.Wrapper
          mt="xs"
          label="สิ่งก่อสร้าง"
          required
          mx="auto"
          error={errors.building && errors.building.message}
        >
          <Input
            type="number"
            placeholder="สิ่งก่อสร้าง"
            error={errors.building ? errors.building.message : ""}
            {...register("building", {
              required: "ระบุจำนวนสิ่งก่อสร้าง",
              min: {
                value: 0,
                message: "ค่าจำนวนสิ่งก่อสร้างต้องไม่น้อยกว่า 0",
              },
            })}
          />
        </Input.Wrapper>
        <Group position="right" mt="sm">
          <Button
            variant="outline"
            color="gray"
            size="xs"
            component={Link}
            to="/typeManages"
          >
            ย้อนกลับ
          </Button>
          <Button color="blue" size="xs" onClick={handleSubmit(onSubmit)}>
            ยืนยัน
          </Button>
        </Group>
      </Card>
    </>
  );
}
