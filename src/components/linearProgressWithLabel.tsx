import React from "react";
import { Box, LinearProgress } from "@material-ui/core";
import type { LinearProgressProps } from "@material-ui/core";
export default function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
): JSX.Element {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          data-testid="progressbar"
        />
      </Box>
    </Box>
  );
}
