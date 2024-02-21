export const darkTheme = {
  palette: {
    primary: {
      main: "#90caf9",
      light: "#424242",
      dark: "white",
    },
    secondary: {
      main: "#FBBA72",
    },
    background: {
      default: "#2B2D2F",
    },
    type: "dark" as const, // Switching the dark mode on is a single property value change.
  },
  overrides: {
    MuiTypography: {
      body1: {
        fontSize: "14px",
        lineHeight: "21px",
        letterSpacing: "-0.05px",
      },
    },
    MuiFormLabel: {
      root: {
        color: "#FFFFFF",
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "unset",
      },
    },
    RaSidebar: {
      drawerPaper: {
        backgroundColor: "#2B2D2F",
      },
      fixed: {
        width: "240px",
        position: "unset",
      },
    },
    RaMenuItemLink: {
      root: {
        borderLeft: "3px solid #fff",
      },
      active: {
        borderLeft: "3px solid #6d8fcc",
      },
    },
    RaAppBar: {
      toolbar: {
        borderBottom: "3px solid #6d8fcc",
      },
    },
    MuiAppBar: {
      colorSecondary: {
        color: "#ffffffb3",
        backgroundColor: "#616161e6",
      },
    },
    MuiButtonBase: {
      root: {
        "&:hover:active::after": {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "currentColor",
          opacity: 0.3,
          borderRadius: "inherit",
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};

export const lightTheme = {
  palette: {
    primary: {
      main: "#6d8fcc",
      light: "#FFFFFF",
      dark: "black",
    },
    secondary: {
      light: "#5f5fc4",
      main: "#283593",
      dark: "#001064",
      contrastText: "#fff",
    },
    background: {
      default: "#f4f6f8",
    },
    type: "light" as const,
  },
  shape: {
    borderRadius: 10,
  },
  overrides: {
    MuiTypography: {
      body1: {
        fontSize: "14px",
        lineHeight: "21px",
        letterSpacing: "-0.05px",
      },
    },
    RaDatagrid: {
      expandIcon: {
        padding: "0",
        visibility: "hidden",
      },
      expandIconCell: {
        width: "0px",
        height: "0px",
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "unset",
      },
    },
    RaAppBar: {
      toolbar: {
        borderBottom: "3px solid #6d8fcc",
      },
    },
    RaSidebar: {
      drawerPaper: {
        backgroundColor: "#ffffff",
      },
      fixed: {
        width: "240px",
        position: "unset",
      },
    },
    RaMenuItemLink: {
      root: {
        borderLeft: "3px solid #fff",
      },
      active: {
        borderLeft: "3px solid #6d8fcc",
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "none",
      },
      root: {
        border: "1px solid #e0e0e3",
        backgroundClip: "padding-box",
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: "#fff",
        color: "#4f3cc9",
        boxShadow: "none",
      },
    },
    MuiButtonBase: {
      root: {
        "&:hover:active::after": {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "currentColor",
          opacity: 0.3,
          borderRadius: "inherit",
        },
      },
    },
    MuiAppBar: {
      colorSecondary: {
        color: "#808080",
        backgroundColor: "#fff",
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: "#f5f5f5",
      },
      barColorPrimary: {
        backgroundColor: "#d7d7d7",
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        "&$disabled": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};
