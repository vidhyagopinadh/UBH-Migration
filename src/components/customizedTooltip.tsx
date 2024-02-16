import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

export const CustomizedTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#D3D3D3",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#D3D3D3",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(14),
    fontFamily: "Segoe UI",
    fontStyle: "italic",
    borderRadius: "10px",
  },
}));
