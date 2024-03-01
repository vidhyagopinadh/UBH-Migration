import * as React from "react";
import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   List,
//   Typography,
//   ListItem,
//   Divider,
// } from "@material-ui/core";
import { PatientContact } from "./patientContact";
import { tommddyyyy } from "../../../../utils/dateFormator";
import { useDataProvider } from "react-admin";
import Activity from "./Activity";
import type { IRequestToken } from "../../../../types/types";
import { perPageMax } from "../../../../utils/pageConstants";
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { titleCase } from "../../../../utils/titleCase";
import { styled } from "@mui/material/styles";

const PREFIX = "PRRPatient";
const classes = {
  root: `${PREFIX}-root`,
  cardBottom: `${PREFIX}-cardBottom`,
  listItems: `${PREFIX}-listItems`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${classes.cardBottom}`]: {
    marginBottom: "15px",
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${classes.listItems}`]: {
    "&.MuiListItem-gutters": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

export function Patient({ request }): JSX.Element {
  const dataProvider = useDataProvider();
  const suffix = request.suffix ? request.suffix : "";
  const [requestTokenList, setRequestTokenTist] = useState<IRequestToken[]>([]);
  const [currTab, setCurrTab] = React.useState("address");
  const handleTabsChange = (
    event: React.ChangeEvent<{}>,
    value: string
  ): void => {
    setCurrTab(value);
  };
  useEffect(() => {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: request.id,
      },
    };

    function getDetails(): void {
      dataProvider.getList("requestTokenV1s", queryOption).then(({ data }) => {
        setRequestTokenTist(data);
      });
    }
    getDetails();
  }, []);
  // const classes = useStyles();

  return (
    <StyledDiv>
      <Card style={{ marginBottom: "15px" }} className={classes.root}>
        <CardContent>
          <Typography component="h6" variant="subtitle1">
            PATIENT CONTACT DETAILS
          </Typography>
          <List>
            <ListItem className={classes.listItems}>
              <PatientContact />
            </ListItem>
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Name: &nbsp;</Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${request.firstName} ${
                request.middleName ? request.middleName : ""
              } ${request.lastName} ${suffix}`}</Typography>
            </ListItem>
            <Divider />
            {request.previousName &&
              (request.previousName.trim() !== "" ? (
                <>
                  <ListItem className={classes.listItems}>
                    <Typography variant="subtitle1">
                      Previous Name: &nbsp;
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ marginLeft: "auto" }}
                    >{`${request.previousName}`}</Typography>
                  </ListItem>
                  <Divider />
                </>
              ) : (
                ""
              ))}
            {request.electronicDetails && (
              <>
                {" "}
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">Email: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto", wordBreak: "break-all" }}
                  >{`${request.electronicDetails}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.relationshipValue && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">
                    Relationship: &nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${titleCase(request.relationshipValue)}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.ssn && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">SSN: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >
                    {request.ssn.slice(0, 3) +
                      "-" +
                      request.ssn.slice(3, 5) +
                      "-" +
                      request.ssn.slice(5)}
                  </Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.phoneNumber && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">Phone: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${request.phoneNumber}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">
                Sex Assigned at Birth: &nbsp;
              </Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${
                JSON.parse(request.sex).other
                  ? titleCase(JSON.parse(request.sex).other_value)
                  : titleCase(JSON.parse(request.sex).value)
              }`}</Typography>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Gender: &nbsp;</Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${
                JSON.parse(request.gender).other
                  ? titleCase(JSON.parse(request.gender).other_value)
                  : titleCase(JSON.parse(request.gender).value)
              }`}</Typography>
            </ListItem>
            <Divider />
            {request.preferredLanguageValue && (
              <>
                {" "}
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">
                    Preferred Language: &nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${titleCase(request.preferredLanguageValue)}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.preferredPronouns && (
              <>
                {" "}
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">
                    Preferred Pronouns: &nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >
                    {request.preferredPronouns
                      ? `${titleCase(request.preferredPronouns)}`
                      : ""}
                  </Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.addressLine1 && (
              <>
                <Tabs
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  style={{ marginTop: "0px" }}
                  variant="scrollable"
                  value={currTab}
                >
                  <Tab key={"1"} label={"Address"} value={"address"} />
                  {JSON.parse(request.previousAddress).is_previous_address && (
                    <Tab
                      key={"2"}
                      label={"Previous Address"}
                      value={"previousAddress"}
                    />
                  )}
                </Tabs>
                <Divider />
                {currTab === "address" && (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Address line 1: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.addressLine1}`}</Typography>
                    </ListItem>
                    <Divider />
                    {request.addressLine2 && (
                      <>
                        <ListItem className={classes.listItems}>
                          <Typography variant="subtitle1">
                            Address line 2: &nbsp;
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ marginLeft: "auto" }}
                          >{`${request.addressLine2}`}</Typography>
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">City: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.city}`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">State: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.state}`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Country: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.country}`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Zip Code: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.addressZip}`}</Typography>
                    </ListItem>
                    <Divider />
                  </>
                )}
                {currTab === "previousAddress" && (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Address line 1: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_address1
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    {JSON.parse(request.previousAddress).previous_address2 && (
                      <>
                        <ListItem className={classes.listItems}>
                          <Typography variant="subtitle1">
                            Address line 2: &nbsp;
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ marginLeft: "auto" }}
                          >{`${
                            JSON.parse(request.previousAddress)
                              .previous_address2
                          }`}</Typography>
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">City: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_city
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">State: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_state
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Country: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_country
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Zip Code: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_zip
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                  </>
                )}
              </>
            )}
          </List>
        </CardContent>
      </Card>
      <Card className={classes.cardBottom}>
        <CardContent>
          <List>
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Created At: &nbsp;</Typography>
              <Typography variant="subtitle2" style={{ marginLeft: "auto" }}>
                {tommddyyyy(`${request.createdat}`)}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Priority: &nbsp;</Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${request.requestpriority}`}</Typography>
            </ListItem>
            <Divider />
          </List>
        </CardContent>
      </Card>
      <Card className={classes.cardBottom}>
        <CardContent>
          <List>
            <ListItem className={classes.listItems}></ListItem>
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Created At: &nbsp;</Typography>
              <Typography variant="subtitle2" style={{ marginLeft: "auto" }}>
                {tommddyyyy(`${request.createdat}`)}
              </Typography>
            </ListItem>
            {request.categoryType === "request"
              ? requestTokenList.map((indvRT) => (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography
                        variant="subtitle2"
                        style={{ marginTop: "10px" }}
                      >
                        {indvRT.authFormType === 1
                          ? "HIPAA Request Form"
                          : "Substance Use Disorder Form"}
                      </Typography>
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <Activity
                        className={classes.listItems}
                        activity={{
                          subject_type:
                            indvRT.authFormType === 1
                              ? "hippaAuthDetails"
                              : "substanceUseDisorder",
                          action_type: "document",
                          requestType: request.categoryType,
                          subject:
                            indvRT.authFormType === 1
                              ? "HIPAA Request Form"
                              : "Substance Use Disorder Form",
                          requestToken: indvRT,
                          requestStatus: request.requeststatus,
                        }}
                      />
                    </ListItem>
                  </>
                ))
              : ""}
          </List>
        </CardContent>
      </Card>
    </StyledDiv>
  );
}
