import * as React from "react";
import "./CactusComments.css";
import useScript from "../../hooks/useScript";

export const CactusComments = (props) => {
  useScript(props.commentSectionId);
  return <div id="comment-section"></div>;
};
