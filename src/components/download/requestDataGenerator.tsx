import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { tommddyyyy } from "../../lib/universal/utils/dateFormator";
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    padding: 20,
    margin: 10,
  },
  section: {
    margin: 10,
    flexDirection: "row",
    flexGrow: 1,
    alignContent: "flex-start",
  },
  image: {
    height: 35,
    width: 80,
    padding: 5,
  },
  uploadImage: {
    height: "auto",
    width: "100%",
    padding: 10,
  },
  upper: {
    width: "40%",
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "left",

    justifyContent: "flex-start",
    paddingTop: "5px",
  },
  upperSection: {
    borderTop: "2px solid #6d8fcc",
    width: "95%",
  },
  listitemStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "left",
    alignItems: "center",
    paddingTop: "4px",
    paddingBottom: "5px",
    justifyContent: "space-between",
    borderBottom: "1px solid #eaeaea !important",
    marginTop: 7,
  },

  title: {
    fontSize: "8px",
    width: "45%",
    fontWeight: 500,
  },
  patientTitle: {
    fontSize: "8px",
    width: "35%",
    fontWeight: 500,
  },
  patientSubTitle: {
    fontSize: "8px",
    width: "60%",
    fontWeight: 400,
  },
  imageHeading: {
    fontSize: "10px",
    fontWeight: 500,
    marginTop: 10,
    padding: 10,
  },
  heading: {
    fontSize: "10px",
    fontWeight: 500,
    borderBottom: "1px solid #eaeaea !important",
    paddingBottom: "5px",
  },
  subTitle: {
    fontSize: "8px",
    width: "50%",
    fontWeight: 400,
  },
  card: {
    border: "1px solid #e0e0e3",
    borderRadius: "10px",
    width: "60%",
    marginBottom: "auto",
  },
  patientCard: {
    // width: "38%",
    height: "auto",
    border: "1px solid #e0e0e3",
    borderRadius: "10px",
    borderBottom: "1px solid #eaeaea !important",
  },
  cardContainer: {
    padding: 16,
  },
  obtainCard: {
    // width: "38%",
    height: "auto",
    border: "1px solid #e0e0e3",
    borderRadius: "10px",
    borderBottom: "1px solid #eaeaea !important",
  },
  leftSection: {
    width: "38%",
    // height: "20%",
  },
});

export const RequestDataGenerator = ({ request }: any) => {
  const requestDataContent = {
    "Requested By": ` ${request.createdfname} ${request.createdmname} ${request.createdlastname}`,
    "Request Type":
      request.categoryType === "request"
        ? "Medical Record Request"
        : request.categoryType === "addendum"
          ? "Addendum Request"
          : "Billing/Insurance Request",
    "Created On": tommddyyyy(request.createdat),
    "Request Status": request.requeststatus,
  };
  return (
    <View style={styles.cardContainer}>
      {Object.entries(requestDataContent).map((eachContent) => (
        <View style={styles.upper}>
          <Text style={styles.title}> {`${eachContent[0]}`}: &nbsp;</Text>
          <Text style={styles.subTitle}>{`${eachContent[1]}`}</Text>
        </View>
      ))}
    </View>
  );
};
