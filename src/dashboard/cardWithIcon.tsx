import * as React from "react";
import { FC } from "react";

import { Link } from "react-router-dom";

import cartouche from "./cartouche.png";
import cartoucheDark from "./cartoucheDark.png";
import { Card, Box, Typography, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';

interface Props {
  icon: FC<any>;
  to: string;
  title?: string;
  subtitle?: string | number;
  children?: React.ReactNode;
}


const PREFIX = 'WelcomeCard';
const classes = {
  card: `${PREFIX}-card`,
  main: `${PREFIX}-main`,
  title: `${PREFIX}-title`,
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.card}`]: {
    minHeight: 52,
    display: "flex",
    flexDirection: "column",
    flex: "1",
    "& a": {
      textDecoration: "none",
      color: "inherit",
    },
  },
  [`& .${classes.main}`]: {
    overflow: "inherit",
    padding: 16,
    background: `url(${theme.palette.mode === "dark" ? cartoucheDark : cartouche
      }) no-repeat`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .icon": {
      color: theme.palette.mode === "dark" ? "inherit" : "#dc2440",
    },
  },
  [`& .${classes.title}`]: {
  },
}))


const CardWithIcon: FC<Props> = (props) => {
  const { icon: Icon, title, subtitle, to, children } = props;
  //const classes = useStyles(props);
  return (
    <StyledDiv>
      <Card className={classes.card}>
        <Link to={to}>
          <Box className={classes.main}>
            <Box width="3em" className="icon">
              <Icon fontSize="large" />
            </Box>
            <Box textAlign="right">
              <Typography className={classes.title} color="textSecondary">
                {title}
              </Typography>
              <Typography variant="h5" component="h2">
                {subtitle || " "}
              </Typography>
            </Box>
          </Box>
        </Link>
        {children && <Divider />}
        {children}
      </Card>
    </StyledDiv>

  );
};

export default CardWithIcon;
