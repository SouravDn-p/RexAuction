import * as React from "react";
// Import PickersDay from the main package instead of the subpath
import { DateCalendar, PickerDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";



function CustomDay(props) {
  const { day, selectedDay, ...other } = props;

  const isSelected =
    selectedDay != null && dayjs(day).isSame(selectedDay, "day");

  return (
    <PickerDay
      {...other}
      day={day}
      sx={{
        borderRadius: 1,
        ...(isSelected && {
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }),
      }}
    />
  );
}

export function Calendar({ value, onChange }) {
  return (
    <DateCalendar
      value={value ?? null}
      onChange={(newValue) => {
        onChange?.(newValue);
      }}
      slots={{
        day: (props) => (
          <CustomDay {...props} selectedDay={value ?? null} />
        ),
      }}
    />
  );
}

export default Calendar;