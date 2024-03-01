import * as React from "react";
import SignatureCanvas from "react-signature-canvas";
// import { IconButton } from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "./Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import signature from "./../images/signature.jpg";
import type ReactSignatureCanvas from "react-signature-canvas";
import { IconButton } from "@mui/material";

// const useStyles = makeStyles(() => ({
//   root: {},
//   media: {
//     height: 170,
//   },
//   placeholder: {
//     height: 170,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   content: {
//     padding: 8,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   actions: {
//     padding: 8,
//     justifyContent: "center",
//   },
//   menu: {
//     width: 250,
//     maxWidth: "100%",
//   },
//   additionalClass: {
//     border: "2px solid #7c7c7c",
//     borderRadius: "10px",
//     background: `url(${signature})`,
//     backgroundSize: "400px",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "bottom left",
//   },
//   sigPad: {
//     width: "100%",
//     height: "200px",
//   },
// }));

const PREFIX = "SignatureBox";
const classes = {
  root: `${PREFIX}-root`,
  media: `${PREFIX}-media`,
  placeholder: `${PREFIX}-placeholder`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  menu: `${PREFIX}-menu`,
  additionalClass: `${PREFIX}-additionalClass`,
  sigPad: `${PREFIX}-sigPad`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {},
  [`& .${classes.media}`]: {
    height: 170,
  },
  [`& .${classes.placeholder}`]: {
    height: 170,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`&.${classes.content}`]: {
    padding: 8,
    justifyContent: "center",
  },
  [`& .${classes.actions}`]: {
    padding: 8,
    justifyContent: "center",
  },
  [`& .${classes.menu}`]: {
    width: 250,
    maxWidth: "100%",
  },
  [`& .${classes.additionalClass}`]: {
    border: "2px solid #7c7c7c",
    borderRadius: "10px",
    background: `url(${signature})`,
    backgroundSize: "400px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom left",
  },
  [`& .${classes.sigPad}`]: {
    width: "100%",
    height: "200px",
  },
}));

interface ISignatureBox {
  getSign: Function;
}
export const SignatureBox = ({ getSign }: ISignatureBox) => {
  // @ts-ignore
  let sigPad: ReactSignatureCanvas = {};

  const endSign = () => {
    const data = sigPad.getTrimmedCanvas().toDataURL("image/png");
    getSign(data);
  };
  const clear = () => {
    sigPad.clear();
    getSign("");
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <SignatureCanvas
        penColor="black"
        onEnd={endSign}
        canvasProps={{
          // width: "100%",
          // height: 200,
          className: `sigCanvas ${classes.additionalClass} sigPad ${classes.sigPad}`,
        }}
        ref={(ref) => {
          sigPad = ref;
        }}
      />
      <Tooltip
        title="Clear Signature"
        style={{ position: "absolute", bottom: "10px", right: "0" }}
      >
        <IconButton size="small" onClick={() => clear()}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
