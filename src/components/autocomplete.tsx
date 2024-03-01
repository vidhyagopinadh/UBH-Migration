/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import type { IAutoCompleteWithCreateOption, IInput } from "../types";
import { HIGH_PRIORITY, STANDARD_PRIORITY } from "../utils/constants";
import { AddCircle, ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { Box, makeStyles } from "@material-ui/core";
import { useTranslate } from "react-admin";
const filter = createFilterOptions<IInput>();
const useStyles = makeStyles(() => ({
  arrowUp: {
    color: "green",
    marginRight: "5px",
  },
  arrowDown: {
    color: "blue",
    marginRight: "5px",
  },
}));
export default function AutoCompleteWithCreateOption({
  title,
  variant,
  optionData,
  type,
  fullWidth,
  onAddOption,
  problemStatus,
  problem,
  setPriorityStatus,
  selectedValue,
  statusChange,
  setPriority,
}: IAutoCompleteWithCreateOption) {
  const translate = useTranslate();
  const [value, setValue] = React.useState<IInput | null>(null);
  const [optionType, setOptionType] = React.useState(null);
  const classes = useStyles();
  useEffect(() => {
    if (optionData[0] !== undefined) {
      setOptionType(optionData[0].__typename);
      if (type == "problemsFaced") {
        if (selectedValue.id) {
          setValue({ value: selectedValue.value });
        } else {
          setValue({
            value: translate("resources.requests.dropdown.problemsFaced"),
          });
        }
      } else if (type == "impactFaced") {
        if (selectedValue.id) {
          setValue({ value: selectedValue.value });
        } else {
          setValue({
            value: translate("resources.requests.dropdown.impactFaced"),
          });
        }
      }
    }
  }, [optionData]);
  return (
    <Autocomplete
      value={value}
      disableClearable
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            value: newValue,
          });
          onAddOption(newValue, optionType);
          if (type === "problemsFaced") {
            setPriority(STANDARD_PRIORITY);
            setPriorityStatus(false);
          }
        } else if (newValue && newValue.inputValue) {
          setValue({
            value: newValue.inputValue,
          });
          onAddOption(newValue.inputValue, optionType);
          if (type === "problemsFaced") {
            setPriority(STANDARD_PRIORITY);
            setPriorityStatus(false);
          }
        } else if (newValue) {
          setValue(newValue);
          onAddOption(newValue, optionType);
          if (type === "problemsFaced") {
            setPriority(newValue.priority);
            setPriorityStatus(false);
          }
        }
        if (value === type) {
          statusChange(true);
        } else {
          statusChange(false);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (params.inputValue !== "") {
          filtered.push({
            inputValue: params.inputValue,
            value: `No data found.Do you want to add new item -'"${params.inputValue}"'?`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={optionData}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.value;
      }}
      renderOption={(option) => (
        <>
          {type === "problemsFaced" && (
            <>
              {option.priority === HIGH_PRIORITY ? (
                <ArrowUpward className={classes.arrowUp} />
              ) : option.priority === STANDARD_PRIORITY ? (
                <ArrowDownward className={classes.arrowDown} />
              ) : (
                ""
              )}
            </>
          )}
          {option.value.includes(
            translate("resources.requests.dropdown.noData"),
          ) && <AddCircle color="primary" style={{ marginRight: "5px" }} />}
          {option.value}
        </>
      )}
      freeSolo
      renderInput={(params) => (
        <Box>
          <TextField
            {...params}
            fullWidth={fullWidth || false}
            label={title}
            variant={variant}
            error={problemStatus ? true : false}
            helperText={problemStatus === true ? problem : " "}
          />
        </Box>
      )}
    />
  );
}
