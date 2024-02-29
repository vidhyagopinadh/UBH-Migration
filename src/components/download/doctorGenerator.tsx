import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
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
    height: "auto",
    border: "1px solid #e0e0e3",
    borderRadius: "10px",
    borderBottom: "1px solid #eaeaea !important",
  },
  cardContainer: {
    padding: 16,
  },
});

export const DoctorGenerator = ({ data }) => {
  const doctorContent = {
    Name: data[0].doctorName,
    Address: data[0].address,
    Phone: data[0].phoneNumber,
    Institution: data[0].institution,
  };
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.heading}>Doctor Details</Text>
      {Object.entries(doctorContent).map((eachContent) => (
        <View style={styles.listitemStyle}>
          <Text style={styles.patientTitle}>{`${eachContent[0]}`}: &nbsp;</Text>
          <Text style={styles.patientSubTitle}>{`${eachContent[1]}`}</Text>
        </View>
      ))}
    </View>
  );
};
