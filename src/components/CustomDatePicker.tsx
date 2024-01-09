import React from 'react';
import DatePicker from 'react-date-picker';
import { ReactComponent as CalenderIcon } from '../assets/images/CalenderIcon.svg';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

interface DatePickerProps {
  label: string;
  onChange: any;
  value: Date | null;
  name: string;
  minDate?: any;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  label,
  onChange,
  value,
  name,
  minDate
}) => {
  return (
    <div className='date-picker'>
      <p>{label}</p>
      <DatePicker
        calendarIcon={<CalenderIcon />}
        onChange={onChange}
        value={value}
        name={name}
        dayPlaceholder='DD'
        monthPlaceholder='MM'
        yearPlaceholder='YYYY'
        minDate={minDate}
      />
    </div>
  );
};

export default CustomDatePicker;