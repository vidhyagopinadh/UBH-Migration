import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { tommddyyyy } from "../../lib/universal/utils/dateFormator";
import { FORM_CONTENT } from "../../utils/constants";
const styles = StyleSheet.create({
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
    height: "70px",
    width: "100px",
    padding: 10,
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
  sudTitle: {
    fontSize: "8px",
    width: "100%",
    fontWeight: 1000,
    marginTop: 5,
    marginBottom: 10,
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
    fontSize: "8px",
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
    width: "40%",
    alignContent: "center",
    marginBottom: "auto",
  },
  cardContainer: {
    padding: 16,
  },
});

export const SudGenerator = ({ sudDetails, request, sudSignData }: any) => {
  const formType = "sud";
  const hipaaContent = {
    "Authorization Title:": sudDetails.useDisorderAuthorizationTitle,
    "Time Period From": tommddyyyy(sudDetails.startFrom),
    "Time Period To": tommddyyyy(sudDetails.endTo),
  };
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.heading}>{FORM_CONTENT[formType].headerTitle}</Text>
      <Text style={styles.heading}>{FORM_CONTENT[formType].cardTitle}</Text>
      <Text style={styles.sudTitle}>{FORM_CONTENT[formType].title}</Text>
      <Text style={styles.sudTitle}>
        {" "}
        1. This authorization applies to the following information:
      </Text>
      {Object.entries(hipaaContent).map((eachContent) => (
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
      <Text style={styles.sudTitle}>2.{FORM_CONTENT[formType].formfield2}</Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Disorder Treatment Program:</Text>

        <Text style={styles.patientSubTitle}>
          {" "}
          {sudDetails.disorderTreatmentProgram}
        </Text>
      </View>
      <Text style={styles.sudTitle}>3.{FORM_CONTENT[formType].formField3}</Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Receive Person:</Text>
        <Text style={styles.patientSubTitle}> {sudDetails.receivePerson}</Text>
      </View>
      <Text style={styles.sudTitle}>
        4.Purpose of proposed use or disclosure:
      </Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Purpose:</Text>
        <Text style={styles.patientSubTitle}> {sudDetails.purpose}</Text>
      </View>
      <Text style={styles.sudTitle}>5.This authorization expires:</Text>
      <View style={styles.listitemStyle}>
        {sudDetails.authorizationExpireEvent ? (
          <>
            <Text style={styles.patientTitle}>Authorization Expire Event:</Text>
            <Text style={styles.patientSubTitle}>
              {" "}
              {sudDetails.authorizationExpireEvent}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.patientTitle}>Authorization Expire Date:</Text>
            <Text style={styles.patientSubTitle}>
              {" "}
              {tommddyyyy(sudDetails.expiryDate)}
            </Text>
          </>
        )}
      </View>
      <Text style={styles.heading}>AUTHORIZATION</Text>
      <Text style={styles.sudTitle}>
        I understand and agree to the foregoing:
      </Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Patient Name:</Text>
        <Text style={styles.patientSubTitle}>
          {" "}
          {request.firstName +
            " " +
            (request.middleName ? request.middleName : "") +
            " " +
            request.lastName}
        </Text>
      </View>

      {!sudDetails.patientRepresentative ? (
        <Text style={styles.sudTitle}>Signed as the patient</Text>
      ) : (
        <>
          <Text style={styles.sudTitle}>
            Signed as the patient representative
          </Text>
          <View style={styles.section}>
            <View style={styles.listitemStyle}>
              <Text style={styles.patientTitle}>Name:</Text>
              <Text style={styles.patientSubTitle}>
                {" "}
                {sudDetails.patientRepresentative}
              </Text>
            </View>
            <View style={styles.listitemStyle}>
              <Text style={styles.patientTitle}>Relation:</Text>
              <Text style={styles.patientSubTitle}>
                {" "}
                {sudDetails.patientRelation}
              </Text>
            </View>
          </View>
        </>
      )}
      <View style={{ display: "flex" }}>
        <Text style={styles.imageHeading}>Signature</Text>
        <Image style={styles.uploadImage} src={sudSignData} />
      </View>
    </View>
  );
};
