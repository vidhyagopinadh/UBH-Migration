import { InputAdornment, TextField } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { GridSearchIcon } from "@mui/x-data-grid";
import React, { useState } from "react";
import type { BaseSyntheticEvent } from "react";
const CustomFilter = ({ setFilterValue, fieldName }) => {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = () => {
    setIsSearching(true);
    setFilterValue(searchText?.trim());
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleClear = () => {
    setIsSearching(false);
    setFilterValue("");
    setSearchText("");
  };
  const handleChange = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setIsSearching(false);
    setSearchText(event.target.value);
  };
  return (
    <>
      <TextField
        variant="filled"
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={"Search by " + fieldName}
        value={searchText}
        data-testid="customFilter"
        margin="dense"
        style={{ marginRight: "15px", width: "250px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isSearching ? (
                <Close onClick={handleClear} style={{ cursor: "pointer" }} />
              ) : (
                <GridSearchIcon
                  onClick={handleSearch}
                  style={{ cursor: "pointer" }}
                  data-testid="searchButton"
                />
              )}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default CustomFilter;
