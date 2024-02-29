import * as React from "react";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../types";

const CopyToClipboardButton = (link) => {
  const [open, setOpen] = useState(false);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  React.useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(link.urlLink);
  };

  return (
    <>
      {!emailNotVerified && (
        <Button
          onClick={handleClick}
          color="primary"
          style={{ textTransform: "none" }}
          data-testid="test-copyToClipboard-btn"
        >
          Copy URL
        </Button>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
};

export default CopyToClipboardButton;
