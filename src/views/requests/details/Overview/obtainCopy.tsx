import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  List,
  Typography,
  ListItem,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDataProvider } from "react-admin";
import { perPageMax } from "../../../../utils/pageConstants";
import type { RequestObtainRecordType } from "../../../../__generated__/typescript-operations_all";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.primary.light,
//   },
//   cardBottom: {
//     marginBottom: "15px",
//     backgroundColor: theme.palette.primary.light,
//   },
//   listItems: {
//     "&.MuiListItem-gutters": {
//       paddingLeft: 0,
//       paddingRight: 0,
//     },
//   },
//   table: {
//     padding: 0,
//   },
// }));

const PREFIX = "ObtainCopy";
const classes = {
  root: `${PREFIX}-root`,
  cardBottom: `${PREFIX}-cardBottom`,
  listItems: `${PREFIX}-listItems`,
  table: `${PREFIX}-table`,
};
const Root = styled("div")(({ theme }) => ({
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
  [`& .${classes.table}`]: {
    padding: 0,
  },
}));

export function ObtainCopy({ request }): JSX.Element {
  const dataProvider = useDataProvider();
  const [obtainData, setObtainData] = useState<RequestObtainRecordType[]>([]);

  useEffect(() => {
    let mounted = true;
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: request.id,
      },
    };
    function getObtainRecordDetails(): void {
      dataProvider
        .getList("requestObtainRecordTypes", queryOption)
        .then(({ data }) => {
          if (mounted) {
            setObtainData(data);
          }
        });
    }
    if (mounted) {
      if (request.isObtainCopy) {
        getObtainRecordDetails();
      }
    }
    return () => {
      mounted = false;
    };
  }, [request]);

  const classes = useStyles();

  return (
    <div>
      {request.categoryType === "request" && request?.isObtainCopy && (
        <Card className={classes.cardBottom}>
          <CardContent>
            <Typography component="h6" variant="subtitle1">
              <b>Obtain Copy Methods</b>
            </Typography>
            <Divider />
            <List>
              {obtainData.map((eachContent) => (
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2">
                    {eachContent.obtainRecordType}
                  </Typography>

                  {eachContent.obtainRecordType === "Fax" ? (
                    <ListItem className={classes.listItems}>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >
                        {`${eachContent.remark}`}
                      </Typography>
                    </ListItem>
                  ) : (
                    ""
                  )}

                  {eachContent.obtainRecordType === "Personal Health Record" ? (
                    <ListItem className={classes.listItems}>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >
                        Name - {`${eachContent.remark}`}
                      </Typography>
                    </ListItem>
                  ) : (
                    ""
                  )}

                  {eachContent.obtainRecordType ===
                  "Other forms (please specify)" ? (
                    <ListItem className={classes.listItems}>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >
                        {`${eachContent.remark}`}
                      </Typography>
                    </ListItem>
                  ) : (
                    ""
                  )}
                </ListItem>
              ))}
              <Divider />
            </List>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
