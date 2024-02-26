import React, { useEffect, useState } from "react";
import { Button, List, Tab, usePermissions, useTranslate } from "react-admin";
// import ProjectCard from "./../../../components/projectCard";
import {
  PatientDependentFilter,
  PriorityFilter,
  RequestTypeFilter,
  StatusFilter,
} from "./filters";
import {
  CO_ROLE_ADMIN,
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../../../utils/roles";
// import useTraces from "../../../hooks/useTraces";
// import { useSelector } from "react-redux";
//import type { AppState } from "../../../types";
import { MedicalInformation } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from "react-router-dom";
import CustomEmpty from "../../../components/customEmpty";
import PageNotFound from "../../../components/pageNotFound";
import CustomFilter from "../../../components/customFilter";
import { Link } from "react-router-dom";
import NotVerifiedBanner from "../../../components/notVerifiedBanner";
import LinearProgressWithLabel from "../../../components/linearProgressWithLabel";
import { Typography, Box, Tabs, Divider, Grid, Card, CardContent, Container } from "@mui/material";
import useRequestList from "./useRequestList";
import { styled } from '@mui/material/styles';

const PREFIX = 'RequestDetails';
const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
}

const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    border: "0px solid #ffffff",
  },
  [`& .${classes.content}`]: {
    backgroundColor: "transparent",
    border: "0px solid #ffffff",
  },
  [`& .${classes.header}`]: {
    backgroundColor: "Lavender",
  },

}))

// const Card = withStyles((theme) => ({
//   root: {
//     [theme.breakpoints.up("sm")]: {
//       order: -1,
//       marginRight: "1em",
//       backgroundColor: theme.palette.primary.light,
//       overflow: "unset",
//     },
//     [theme.breakpoints.down("sm")]: {
//       display: "none",
//     },
//   },
// }))(MuiCard);

export const CommentGrid = ({ ids, data, basePath }): JSX.Element => {
  const { StyledDiv } = useRequestList();

  const classes = useStyles();
  const { permissions } = usePermissions();
  const { getTrace } = useTraces();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );

  const [progress, setProgress] = React.useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + 10,
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {ids.length !== 0 ? (
        <>
          <Typography
            className={classes.title}
            variant="h5"
            style={{ fontSize: "18px" }}
          >
            Showing {ids.length > 0 ? ids.length : 0} request(s)
          </Typography>
          <Grid container style={{ marginTop: 20 }} id="requests">
            {ids.map((d) => (
              <Grid
                item
                key={d.id}
                md={mode === "grid" ? 4 : 12}
                sm={mode === "grid" ? 6 : 12}
                xs={12}
                style={{ padding: 10 }}
              >
                {/* {data[d] !== undefined && (
                  <ProjectCard path={basePath} project={data[d]} />
                )} */}
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Box sx={{ width: "100%" }}>
          {progress < 100 && (
            <LinearProgressWithLabel
              variant="determinate"
              value={progress}
              color="secondary"
            />
          )}
        </Box>
      )}
    </>
  );
};

CommentGrid.defaultProps = {
  data: {},
  ids: [],
};

const FilterSidebar = ({ type = null }): JSX.Element => {
  const PREFIX = 'RequestList';

  const classes = {
    filter: `${PREFIX}-filter`,
  }

  const Root = styled('div')(({ theme }) => ({
    [`&.${classes.filter}`]: {
      backgroundColor: theme.palette.primary.light,
    },

  }));
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  //const classes = useStyles();
  return (
    <Root>
      <Card className={classes.filter} id="filter-sidebar" sx={{ display: { sm: "none" } }}>
        <CardContent>
          <PriorityFilter />
          <StatusFilter />
          <RequestTypeFilter />
          {userInfoReducer.role === CO_ROLE_PATIENT && type === "myself" && (
            <PatientDependentFilter />
          )}
        </CardContent>
      </Card>
    </Root>
  );
};
export const RequestList = (props): JSX.Element => {
  const navigate = useNavigate();
  const listStyles = useListStyles();
  const translate = useTranslate();
  const [showBanner, setShowBanner] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [currTab, setCurrTab] = React.useState(
    window.location.href.includes("myRequests") ? "myself" : "behalf",
  );
  const tabs = [
    { id: "0", value: "myself", label: "My Requests" },
    { id: "1", value: "behalf", label: "Requests on My Behalf" },
  ];
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
      setShowBanner(true);
    }
  }, []);
  // const UserFilter = (props) => (
  //   <Filter {...props} style={{ justifyContent: "flex-end", display: "flex" }}>
  //     <SelectInput
  //       label="Request Type"
  //       source="categoryType"
  //       style={{ float: "right" }}
  //       choices={[
  //         { id: "request", name: "Medical Record Request" },
  //         { id: "addendum", name: "Addendum Request" },
  //         { id: "billing", name: "Billing/Insurance Request" },
  //       ]}
  //       alwaysOn
  //     />
  //   </Filter>
  // );
  // const [myRequests, setMyRequests] = useState([]);
  // const [ppaRequests, setPpaRequests] = useState([]);
  const handleTabsChange = (
    event: React.ChangeEvent<{}>,
    value: string,
  ): void => {
    if (value === "myself") {
      navigate("/myRequests");
      setCurrTab("myself");
    } else {
      navigate("/requestsOnBehalf");
      setCurrTab("behalf");
    }
  };
  return (
    <>
      <StyledDiv>
        {userInfoReducer.role !== CO_ROLE_ADMIN ? (
          <Container style={{ maxWidth: "unset" }}>
            <div style={{ display: "column" }}>
              {showBanner && (
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <NotVerifiedBanner setShowBanner={setShowBanner} />
                </div>
              )}

              <div
                style={{
                  float: "left",
                  paddingBottom: "20px",
                }}
              >
                <Typography
                  component="h2"
                  gutterBottom
                  variant="overline"
                  style={{ marginTop: "10px" }}
                >
                  {translate(`resources.requests.browse`)}
                </Typography>
                <Typography component="h1" variant="h5">
                  {translate(`resources.requests.see`)}
                </Typography>
              </div>
              <div
                style={{
                  float: "right",
                  paddingBottom: "20px",
                  marginRight: "6%",
                }}
              >
                <CustomFilter
                  setFilterValue={setFilterValue}
                  fieldName="patient first name"
                />
                {userInfoReducer.role !== CO_ROLE_MRA && !emailNotVerified && (
                  <Button
                    color="primary"
                    component={Link}
                    to="/requestCreate"
                    variant="contained"
                    className={classes.createButton}
                  >
                    <Add className={classes.addIcon} />
                    {translate(`resources.requests.create`)}
                  </Button>
                )}
              </div>
              <div style={{ float: "left", width: "100%" }}>
                {userInfoReducer.role === CO_ROLE_PATIENT ? (
                  <>
                    <Tabs
                      onChange={handleTabsChange}
                      scrollButtons="auto"
                      variant="scrollable"
                      value={currTab}
                      textColor="primary"
                      indicatorColor="primary"
                    >
                      {tabs.map((tab) => (
                        <Tab
                          style={{ textTransform: "none" }}
                          key={tab.value}
                          icon={
                            tab.value === "myself" ? (
                              <MedicalInformation className={classes.icon} />
                            ) : (
                              <Assignment className={classes.icon} />
                            )
                          }
                          label={tab.label}
                          value={tab.value}
                        />
                      ))}
                    </Tabs>
                    <Divider style={{ marginBottom: "20px" }} />
                    <List
                      title={" "}
                      {...props}
                      perPage={9}
                      sort={{ field: "createdat", order: "DESC" }}
                      classes={{
                        content: listStyles.content,
                        root: listStyles.root,
                      }}
                      exporter={false}
                      empty={
                        !filterValue ? (
                          <CustomEmpty type={currTab} />
                        ) : (
                          <CustomEmpty type="noResults" />
                        )
                      }
                      filter={{
                        firstName: filterValue,
                      }}
                      actions={null}
                      aside={<FilterSidebar type={currTab} />}
                    // filters={<UserFilter />}
                    // filterDefaultValues={{ categoryType: "request" }}
                    >
                      <CommentGrid {...props} />
                    </List>
                  </>
                ) : (
                  <List
                    title={" "}
                    {...props}
                    perPage={9}
                    sort={{ field: "createdat", order: "DESC" }}
                    classes={{
                      content: listStyles.content,
                      root: listStyles.root,
                    }}
                    exporter={false}
                    empty={
                      !filterValue ? (
                        <CustomEmpty type="myself" />
                      ) : (
                        <CustomEmpty type="noResults" />
                      )
                    }
                    filter={{
                      firstName: filterValue,
                    }}
                    actions={null}
                    aside={<FilterSidebar />}

                  // filters={<UserFilter />}
                  // filterDefaultValues={{ categoryType: "request" }}
                  >
                    <CommentGrid {...props} />
                  </List>
                )}
              </div>
            </div>
          </Container>
        ) : (
          <PageNotFound />
        )}
      </StyledDiv>
    </>
  );
};
