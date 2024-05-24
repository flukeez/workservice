import { useState, useRef, useEffect } from "react";
import { PatternFormat } from "react-number-format";

import { Calendar } from "@mantine/dates";
import { ActionIcon, CloseButton, Group, Indicator, Input, Popover, TextInput, } from "@mantine/core";
import { IconCalendarEvent, IconX } from "@tabler/icons-react";

import { dateToMySql } from "@/utils/mydate";
import { default as dayjs } from "dayjs";
import { default as buddhistEra } from "dayjs/plugin/buddhistEra";
import { default as customParseFormat } from "dayjs/plugin/customParseFormat";
import "dayjs/locale/th";

interface Props {
  textValue: string; //thai date string eg. 20/05/2565
  onChangeText: (v: string) => void;
  isError?: boolean;
  isClear?: boolean;
}

const InputDate = ({
  textValue,
  onChangeText,
  isError,
  isClear,
  // ...rest
}: Props) => {
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
    const valueThai = !!value ? dayjs(value).format("DD/MM/BBBB") : ''

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
        className={`mantineTextInput ${isError ? " mantineTextInput-Valid" : ""
          }`}
        defaultValue={textValue}
        onChange={handleChangeText}
        onBlur={onBlur}
        customInput={TextInput}
      />
    );
  };

  const handleNextClickMonth = () => {
    const nextMonth = new Date(value.getFullYear(), value.getMonth() + 1, value.getDate());
    setValue(nextMonth);
  };

  const handlePrevClickMonth = () => {
    const prevMonth = new Date(value.getFullYear(), value.getMonth() - 1, value.getDate());
    setValue(prevMonth);
  };

  const handleNextClickYear = () => {
    const nextYear = new Date(value.getFullYear() + 1, value.getMonth(), value.getDate());
    setValue(nextYear);
  };

  const handlePrevClickYear = () => {
    const prevYear = new Date(value.getFullYear() - 1, value.getMonth(), value.getDate());
    setValue(prevYear);
  };

  const handleNextClickDecade = () => {
    const nextYear = new Date(value.getFullYear() + 10, value.getMonth(), value.getDate());
    setValue(nextYear);
  };

  const handlePrevClickDecade = () => {
    const prevYear = new Date(value.getFullYear() - 10, value.getMonth(), value.getDate());
    setValue(prevYear);
  };

  return (
    <>
      <Input
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
                  <ActionIcon color="blue" variant="light" onClick={openCalendar}>
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
                      selected: dayjs(date).isSame(new Date(dateToMySql(textDate)), 'date'),
                      onClick: () => handleChangeCalendar(date),
                    })}
                    locale="th"
                    date={value}
                    onMonthSelect={(v) => {
                      const setData = new Date(value.getFullYear(), v.getMonth(), 1)
                      setValue(setData)
                    }}
                    onNextMonth={handleNextClickMonth}
                    onPreviousMonth={handlePrevClickMonth}

                    onYearSelect={(v) => {
                      const setData = new Date(v.getFullYear(), value.getMonth(), 1)
                      setValue(setData)
                    }}
                    onNextYear={handleNextClickYear}
                    onPreviousYear={handlePrevClickYear}

                    onNextDecade={handleNextClickDecade}
                    onPreviousDecade={handlePrevClickDecade}
                    renderDay={(date) => {
                      const day = date.getDate();
                      const today = new Date()
                      return (
                        <Indicator size={6} color="green" offset={-2} disabled={day !== today.getDate()}>
                          <div>{day}</div>
                        </Indicator>
                      );
                    }}
                  />
                </Popover.Dropdown>
              </Popover>
              <ActionIcon color="gray" variant="light" onClick={() => handleChangeCalendar("")}>
                <IconX size={16} />
              </ActionIcon>
            </>
          </Group>
        }
      />
    </>
  );
};

export default InputDate;