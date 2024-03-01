import React from "react"; // useEffect // BaseSyntheticEvent, // useState,
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";

const autoCorrectedDatePipe = createAutoCorrectedDatePipe("mm/dd/yyyy HH:MM");

const DatePickerStyled = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "8px",
  },
  label: {
    marginTop: "15px",
    fontSize: 12,
    color: "#6D736F",
    marginBottom: "8px",
    fontFamily: "Roboto",
  },
  errorLabel: {
    fontSize: 12,
    color: "#f44336",
  },

  datePicker: {
    fontFamily: "Roboto",
    fontSize: "15px",
    color: "black",
    marginTop: "4px",
    width: "100%",
    borderBottom: "1px solid #6D736F",
    border: "2px #6D736F",
    "& .react-datepicker__input-container input": {
      borderBottom: "none",
      border: "2px #6D736F",
      outline: "none",
    },
  },
  errorDatePicker: {
    fontFamily: "Roboto",
    fontSize: "15px",
    color: "black",
    marginTop: "4px",
    width: "100%",
    borderBottom: "2px solid red",
    border: "2px #6D736F",
    "& .react-datepicker__input-container input": {
      borderBottom: "none",
      border: "2px #6D736F",
      outline: "none",
    },
  },
  error: {
    color: "#f44336",
    fontSize: "0.75rem",
    marginTop: 5,
  },
}));

const DatePickerWithMonthAndYearDropdown = ({
  handleChangeFunction,
  handleValidateOnBlurFunction,
  errorStatus,
  errorMessage,
  selectedDate,
  id,
  label,
}) => {
  const classes = useStyles();

  const years = Array.from(Array(new Date().getFullYear() - 1922), (_, i) =>
    (i + 1923).toString(),
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <div className={classes.container}>
        <label
          className={`${classes.label} ${
            errorStatus ? classes.errorLabel : ""
          }`}
        >
          {label}
        </label>
        <br />
        <DatePickerStyled>
          <DatePicker
            customInput={
              <MaskedInput
                mask={[
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
                pipe={autoCorrectedDatePipe}
                keepCharPositions={true}
                guide={true}
              />
            }
            className={`${classes.datePicker} ${
              errorStatus ? classes.errorDatePicker : ""
            }`}
            placeholderText="mm/dd/yyyy"
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div
                style={{
                  margin: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  {"<"}
                </button>
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(value)}
                >
                  {years.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  value={months[date.getMonth()]}
                  onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                  }
                >
                  {months.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  {">"}
                </button>
              </div>
            )}
            selected={selectedDate}
            onChange={handleChangeFunction}
            onBlur={(e) => handleValidateOnBlurFunction(e)}
            id={id}
            name={id}
            dateFormat="MM/dd/yyyy"
            maxDate={new Date()}
          />
        </DatePickerStyled>
        {errorStatus ? (
          <div className={classes.error}>{errorMessage}</div>
        ) : (
          <div className={classes.error}> &nbsp;</div>
        )}
      </div>
    </>
  );
};

export default DatePickerWithMonthAndYearDropdown;
