import React, { useEffect, useState } from "react";
// import { Button, Typography } from "@material-ui/core";
import { List, useTranslate } from "react-admin";
// import Grid from "@material-ui/core/Grid";
import IntegrationCard from "../../components/integrationCard";
import { makeStyles } from "@material-ui/core/styles";
// import { Container } from "@material-ui/core";
// import { useSelector } from "react-redux";
// import type { AppState } from "../../types";
// import { Add } from "@material-ui/icons";
import CustomEmpty from "../../components/customEmpty";
import PageNotFound from "../../components/pageNotFound";
import { Link } from "react-router-dom";
import { CO_ROLE_ADMIN } from "../../utils/roles";
import { Add } from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {},
  listStyle: {
    backgroundColor: "unset !important",
  },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  createButton: {
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    float: "right",
    marginTop: "15px",
    textTransform: "none",
  },
}));

const useListStyles = makeStyles({
  content: {
    backgroundColor: "transparent",
    border: "0px solid #ffffff",
  },
  root: {
    border: "0px solid #ffffff",
  },
  header: {
    backgroundColor: "Lavender",
  },
});

export const CommentGrid = ({ ids, data, basePath }): JSX.Element => {
  const [mode, setMode] = useState<string>("grid");
  useEffect(() => {
    setMode("grid");
  }, []);

  return (
    <>
      {ids.length >= 0 ? (
        <>
          <Grid container style={{ marginTop: 20 }}>
            {ids.map((d) => (
              <Grid
                item
                key={d.id}
                md={mode === "grid" ? 4 : 12}
                sm={mode === "grid" ? 6 : 12}
                xs={12}
                style={{ padding: 10 }}
              >
                {data[d] !== undefined && (
                  <IntegrationCard path={basePath} project={data[d]} />
                )}
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <div className="loader">Loading...</div>
      )}
    </>
  );
};

CommentGrid.defaultProps = {
  data: {},
  ids: [],
};

export const IntegrationTable = (props): JSX.Element => {
  const classes = useStyles();
  const listStyles = useListStyles();
  const translate = useTranslate();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );

  return (
    <>
      {userInfoReducer.role === CO_ROLE_ADMIN ? (
        <Container style={{ maxWidth: "unset" }} id="integrationList">
          <div id="integrationList" style={{ display: "column" }}>
            <div
              style={{
                float: "left",
                paddingTop: "10px",
              }}
            >
              <Typography component="h1" variant="h5">
                {translate(`resources.integration.list`)}
              </Typography>
            </div>
            <div
              style={{
                float: "right",
                paddingBottom: "20px",
                marginRight: "6%",
              }}
            >
              <Button
                color="primary"
                component={Link}
                to="/addIntegration"
                variant="contained"
                className={classes.createButton}
              >
                <Add className={classes.addIcon} />
                {translate(`resources.integration.add`)}
              </Button>
            </div>
            <div style={{ float: "left", width: "100%" }}>
              <List
                title={translate(`resources.integration.name`)}
                {...props}
                perPage={9}
                sort={{ field: "createdAt", order: "DESC" }}
                classes={{
                  content: listStyles.content,
                  root: listStyles.root,
                }}
                exporter={false}
                empty={<CustomEmpty type="integrations" />}
                actions={null}
              >
                <CommentGrid {...props} />
              </List>
            </div>
          </div>
        </Container>
      ) : (
        <PageNotFound />
      )}
    </>
  );
};
