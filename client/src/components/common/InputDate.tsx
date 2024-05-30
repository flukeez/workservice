import { useState, useRef, useEffect } from "react";
import { PatternFormat } from "react-number-format";

import { Calendar } from "@mantine/dates";
import {
  ActionIcon,
  CloseButton,
  Group,
  Indicator,
  Input,
  Popover,
  TextInput,
} from "@mantine/core";
import { IconCalendarEvent, IconX } from "@tabler/icons-react";

import { dateToMySql } from "@/utils/mydate";
import { default as dayjs } from "dayjs";
import { default as buddhistEra } from "dayjs/plugin/buddhistEra";
import { default as customParseFormat } from "dayjs/plugin/customParseFormat";
import "dayjs/locale/th";

interface Props {
  textValue: string; //thai date string eg. 20/05/2565
  onChangeText: (v: string) => void;
  isError?: string | undefined;
  isClear?: boolean;
}
const today = new Date();
const InputDate = ({
  textValue,
  onChangeText,
  isError,
  isClear,
}: // ...rest
Props) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<Date>(new Date());
  const [textDate, setTextDate] = useState(textValue);
  const inputRef = useRef<HTMLInputElement>();

  dayjs.extend(buddhistEra);
  dayjs.extend(customParseFormat);
  dayjs().format("BBBB BB");

  useEffect(() => {
    if (textValue === "") {
      setTextDate("");
    } else {
      setTextDate(textValue);
    }
  }, [isClear, textValue]);

  const handleChangeText = (e: any) => {
    const day = dayjs(e.target.value, "DD/MM/YYYY", true).isValid();

    if (day) {
      const mydate = dateToMySql(e.target.value);
      setValue(new Date(mydate));

      setTextDate(e.target.value);
      onChangeText(e.target.value);
    }

    if (e.target.value === "") {
      setTextDate("");
      onChangeText("");
    }
  };

  const handleChangeCalendar = (value: any) => {
    const valueThai = !!value ? dayjs(value).format("DD/MM/BBBB") : "";
    setValue(value);
    setOpened(false);

    setTextDate(valueThai);
    onChangeText(valueThai);
  };

  const openCalendar = () => {
    const day = dayjs(textDate, "DD/MM/YYYY", true).isValid();
    if (day) {
      const myDate = dateToMySql(textDate);
      setValue(new Date(myDate));
    } else {
      setValue(new Date());
    }
    setOpened(true);
  };

  const onBlur = () => {
    if (null !== inputRef.current) {
      const refValue = inputRef.current?.value;
      const day = dayjs(refValue, "DD/MM/YYYY", true).isValid();
      if (!day) {
        setTextDate("");
        onChangeText("");
      }
    }
  };

  const inputDate = () => {
    return (
      <PatternFormat
        getInputRef={inputRef}
        format="##/##/####"
        placeholder="วว/ดด/ปปปป"
        className={`mantineTextInput ${
          isError ? " mantineTextInput-Valid" : ""
        }`}
        error={!!isError}
        defaultValue={textValue}
        onChange={handleChangeText}
        onBlur={onBlur}
        customInput={TextInput}
      />
    );
  };

  const handleNextClickMonth = () => {
    const currentDate = value || today;
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    setValue(nextMonth);
  };

  const handlePrevClickMonth = () => {
    const currentDate = value || today;
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );
    setValue(prevMonth);
  };

  const handleNextClickYear = () => {
    const currentDate = value || today;
    const nextYear = new Date(
      currentDate.getFullYear() + 1,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    setValue(nextYear);
  };

  const handlePrevClickYear = () => {
    const currentDate = value || today;
    const prevYear = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    setValue(prevYear);
  };

  const handleNextClickDecade = () => {
    const currentDate = value || today;
    const nextYear = new Date(
      currentDate.getFullYear() + 10,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    setValue(nextYear);
  };

  const handlePrevClickDecade = () => {
    const currentDate = value || today;
    const prevYear = new Date(
      currentDate.getFullYear() - 10,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    setValue(prevYear);
  };

  return (
    <Input.Wrapper error={isError}>
      <Input
        error={isError}
        component={inputDate}
        rightSectionPointerEvents="all"
        rightSectionWidth={65}
        rightSection={
          <Group gap={2}>
            <>
              <Popover
                withArrow
                shadow="md"
                position="bottom-end"
                opened={opened}
                onClose={() => setOpened(false)}
              >
                <Popover.Target>
                  <ActionIcon
                    color="blue"
                    variant="light"
                    onClick={openCalendar}
                  >
                    <IconCalendarEvent size={16} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Calendar
                    yearLabelFormat="BBBB"
                    decadeLabelFormat="BBBB"
                    yearsListFormat="BBBB"
                    monthLabelFormat="MMMM BBBB"
                    getDayProps={(date) => ({
                      selected: dayjs(date).isSame(
                        new Date(dateToMySql(textDate)),
                        "date"
                      ),
                      onClick: () => handleChangeCalendar(date),
                    })}
                    locale="th"
                    date={value}
                    onMonthSelect={(v) => {
                      const setData = new Date(
                        value.getFullYear(),
                        v.getMonth(),
                        1
                      );
                      setValue(setData);
                    }}
                    onNextMonth={handleNextClickMonth}
                    onPreviousMonth={handlePrevClickMonth}
                    onYearSelect={(v) => {
                      const setData = new Date(
                        v.getFullYear(),
                        value.getMonth(),
                        1
                      );
                      setValue(setData);
                    }}
                    onNextYear={handleNextClickYear}
                    onPreviousYear={handlePrevClickYear}
                    onNextDecade={handleNextClickDecade}
                    onPreviousDecade={handlePrevClickDecade}
                    renderDay={(date) => {
                      const day = date.getDate();
                      return (
                        <Indicator
                          size={6}
                          color="green"
                          offset={-2}
                          disabled={day !== today.getDate()}
                        >
                          <div>{day}</div>
                        </Indicator>
                      );
                    }}
                  />
                </Popover.Dropdown>
              </Popover>
              <ActionIcon
                color="gray"
                variant="light"
                onClick={() => handleChangeCalendar("")}
              >
                <IconX size={16} />
              </ActionIcon>
            </>
          </Group>
        }
      />
    </Input.Wrapper>
  );
};

export default InputDate;
