import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { tommddyyyy } from "../../lib/universal/utils/dateFormator";
const styles = StyleSheet.create({
  page: {
    //  flexDirection: "row",
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

export const PatientGenerator = ({ request }: any) => {
  const suffix = request.suffix ? request.suffix : "";
  const requestContent = {
    Name: `${request.firstName} ${request.middleName ? request.middleName : ""
      } ${request.lastName} ${suffix}`,
    "Previous Name": `${request.previousName}`,
    Email: request.electronicDetails ? request.electronicDetails : "",
    Relationship: request.relationshipValue ? request.relationshipValue : "",
    SSN: request.ssn
      ? request.ssn.slice(0, 3) +
      "-" +
      request.ssn.slice(3, 5) +
      "-" +
      request.ssn.slice(5)
      : "",
    Phone: request.phoneNumber,
    Sex: JSON.parse(request.sex).other
      ? JSON.parse(request.sex).other_value
      : JSON.parse(request.sex).value,
    Gender: JSON.parse(request.gender).other
      ? JSON.parse(request.gender).other_value
      : JSON.parse(request.gender).value,
    "Preferred Language": request.preferredLanguageValue
      ? request.preferredLanguageValue
      : "",
    DOB: tommddyyyy(request.birthDate),
    Address: `${request.addressLine1},${request.addressLine2}, ${request.city} ${request.state}, ${request.country} -${request.addressZip}`,
    "Previous Address": `${JSON.parse(request.previousAddress).previous_address1
      },${JSON.parse(request.previousAddress).previous_address2}, ${JSON.parse(request.previousAddress).previous_city
      } ${JSON.parse(request.previousAddress).previous_state}, ${JSON.parse(request.previousAddress).previous_country
      } -${JSON.parse(request.previousAddress).previous_zip}`,
  };
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.heading}>Patient Details</Text>
      {Object.entries(requestContent).map((eachContent) => (
        <View style={styles.listitemStyle}>
          <Text style={styles.patientTitle}>{`${eachContent[0]}`}: &nbsp;</Text>
          {eachContent[1] ? (
            !eachContent[1].includes("null") && (
              <Text style={styles.patientSubTitle}>{`${eachContent[1]}`}</Text>
            )
          ) : (
            <Text style={styles.patientSubTitle}></Text>
          )}
        </View>
      ))}
    </View>
  );
};
