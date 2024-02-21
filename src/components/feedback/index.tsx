import React, { useState } from "react";
import PropTypes from "prop-types";
import FeedBack from "./feedback";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import html2canvas from "html2canvas";
import { usePermissions } from "react-admin";
import { CO_ROLE_ADMIN } from "../../utils/roles";
import { Button } from "@mui/material";

function FeedBackForm({ page }: any) {
  const [feedBackStatus, setFeedBackStatus] = useState(false);
  const [canvasVal, setCanvasVal] = useState({});
  const { permissions } = usePermissions();
  const trigger = () => {
    html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
    }).then(function (canvas) {
      const data = canvas.toDataURL("image/jpeg", 0.9);
      setCanvasVal(data);
      setFeedBackStatus(!feedBackStatus);
    });
  };

  const onClose = () => {
    setFeedBackStatus(false);
  };
  return (
    <div>
      {permissions !== CO_ROLE_ADMIN && (
        <>
          <Button
            onClick={() => trigger()}
            color="secondary"
            variant="contained"
            style={{
              position: "fixed",
              background: "#5eb562",
              right: "-75px",
              top: "45%",
              transform: "rotate(-90deg)",
              padding: "2px 6px",
              zIndex: 999,
            }}
          >
            Support & FeedBack{" "}
            <HelpOutlineIcon style={{ marginLeft: "10px" }} />
          </Button>
          <FeedBack
            open={feedBackStatus}
            page={page}
            canvased={canvasVal}
            onClose={onClose}
          />
        </>
      )}
    </div>
  );
}

FeedBackForm.propTypes = {
  page: PropTypes.string,
};

export default FeedBackForm;
