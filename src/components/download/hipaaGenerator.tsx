import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { tommddyyyy } from "../../lib/universal/utils/dateFormator";
import {
  AUTHORIZATION_SERVICE_PROVIDERS_TYPE,
  FORM_CONTENT,
} from "../../utils/constants";
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
  uploadImageLegal: {
    height: "80px",
    width: "135px",
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
  hipaaTitle: {
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

export const HipaaGenerator = ({
  hipaaDetails,
  request,
  legalIdData,
  hipaaSignData,
}: any) => {
  const formType = "hipaa";
  const hipaaContent = {
    "Authorization Title:": hipaaDetails.healthAuthAuthorizationTitle,
    "Time Period From": tommddyyyy(hipaaDetails.startFrom),
    "Time Period To": tommddyyyy(hipaaDetails.endTo),
  };
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.heading}>{FORM_CONTENT[formType].headerTitle}</Text>
      <Text style={styles.heading}>{FORM_CONTENT[formType].cardTitle}</Text>
      <Text style={styles.hipaaTitle}>{FORM_CONTENT[formType].title}</Text>
      <Text style={styles.hipaaTitle}>
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
      <Text style={styles.hipaaTitle}>
        2.{FORM_CONTENT[formType].formfield2}
      </Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>
          Authorization Service Providers:
        </Text>

        {hipaaDetails.authorizationServiceProvidersType && (
          <Text style={styles.patientSubTitle}>
            {" "}
            {
              AUTHORIZATION_SERVICE_PROVIDERS_TYPE[
                hipaaDetails.authorizationServiceProvidersType - 1
              ].value
            }
          </Text>
        )}
        <Text style={styles.patientSubTitle}>
          {" "}
          {hipaaDetails.authorizationServiceProvidersOthers}
        </Text>
      </View>
      <Text style={styles.hipaaTitle}>
        3.{FORM_CONTENT[formType].formField3}
      </Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Receive Person:</Text>
        <Text style={styles.patientSubTitle}>
          {" "}
          {hipaaDetails.receivePerson}
        </Text>
      </View>
      <Text style={styles.hipaaTitle}>
        4.Purpose of proposed use or disclosure:
      </Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Purpose:</Text>
        <Text style={styles.patientSubTitle}> {hipaaDetails.purpose}</Text>
      </View>
      {hipaaDetails.isValidAfterDeath ? (
        <Text style={styles.hipaaTitle}>
          5.This authorization does not expire & is valid until after my death.
        </Text>
      ) : (
        <>
          <Text style={styles.hipaaTitle}>5.This authorization expires:</Text>
          <View style={styles.listitemStyle}>
            {hipaaDetails.authorizationExpireEvent ? (
              <>
                <Text style={styles.patientTitle}>
                  Authorization Expire Event:
                </Text>
                <Text style={styles.patientSubTitle}>
                  {" "}
                  {hipaaDetails.authorizationExpireEvent}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.patientTitle}>
                  Authorization Expire Date:
                </Text>
                <Text style={styles.patientSubTitle}>
                  {" "}
                  {tommddyyyy(hipaaDetails.expiryDate)}
                </Text>
              </>
            )}
          </View>
        </>
      )}
      <Text style={styles.heading}>AUTHORIZATION</Text>
      <Text style={styles.hipaaTitle}>
        I understand and agree to the foregoing:
      </Text>
      <View style={styles.listitemStyle}>
        <Text style={styles.patientTitle}>Patient Name:</Text>
        <Text style={styles.patientSubTitle}>
          {" "}
          {request.firstName +
            "  " +
            (request.middleName ? request.middleName : "") +
            "  " +
            request.lastName}
        </Text>
      </View>
      {!hipaaDetails.patientRepresentative ? (
        <Text style={styles.hipaaTitle}>Signed as the patient</Text>
      ) : (
        <>
          <Text style={styles.hipaaTitle}>
            Signed as the patient representative
          </Text>
          <View style={styles.section}>
            <View style={styles.listitemStyle}>
              <Text style={styles.patientTitle}>Name:</Text>
              <Text style={styles.patientSubTitle}>
                {" "}
                {hipaaDetails.patientRepresentative}
              </Text>
            </View>
            <View style={styles.listitemStyle}>
              <Text style={styles.patientTitle}>Relation:</Text>
              <Text style={styles.patientSubTitle}>
                {" "}
                {hipaaDetails.patientRelation}
              </Text>
            </View>
          </View>
        </>
      )}
      <View style={styles.section}>
        <View style={styles.leftSection}>
          <Text style={styles.imageHeading}>LegalId</Text>
          <Image style={styles.uploadImageLegal} src={legalIdData} />
        </View>
        <View style={styles.card}>
          <Text style={styles.imageHeading}>Signature</Text>
          <Image style={styles.uploadImage} src={hipaaSignData} />
        </View>
      </View>
    </View>
  );
};
