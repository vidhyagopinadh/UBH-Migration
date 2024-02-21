import * as React from "react";
import type { ListProps } from "react-admin";
import {
  Datagrid,
  TextField,
  DateField,
  List,
  useTranslate,
  FunctionField,
} from "react-admin";
import { linkToRecord } from "react-admin";
import { Link } from "react-router-dom";

import type { ReactElement } from "react";
import EmptyList from "../../../components/emptyList";
import { Button } from "@mui/material";

const CustomButtonLinkField = (props: any): JSX.Element => {
  const linkToUser = linkToRecord(
    "/insuranceQuestionRequests",
    props.record.id,
    "show",
  );
  return (
    <Button to={linkToUser} component={Link} color="primary">
      View
    </Button>
  );
};

CustomButtonLinkField.defaultProps = { label: "Actions" };

const BillingList = (props: ListProps): ReactElement => {
  const translate = useTranslate();
  return (
    <>
      <List
        {...props}
        title="Billing List"
        sort={{ field: "id", order: "DESC" }}
        perPage={25}
        empty={
          <EmptyList
            title={translate("resources.billingRequest.empty.title")}
            buttonTitle={translate(
              "resources.billingRequest.empty.buttonTitle",
            )}
          />
        }
      >
        <Datagrid optimized>
          <TextField source="mrn" label="MRN" />
          <TextField source="pan" label="PAN" />
          <FunctionField
            label="Patient Name"
            render={(record: any) =>
              `${record.personFname} ${record.personMname} ${record.personLname}`
            }
          />
          <TextField source="requestType" label="Request Type" />
          <TextField source="requestCategoryName" label="Request Category" />
          <DateField source="createdat" showTime label="Created On" />
          <CustomButtonLinkField {...props} />
        </Datagrid>
      </List>
    </>
  );
};

export default BillingList;
