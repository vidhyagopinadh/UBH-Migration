import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../images/logo.png";
import { ContentGenerator } from "./contentGenerator";
import { DoctorGenerator } from "./doctorGenerator";
import { PatientGenerator } from "./patientGenerator";
import { RequestDataGenerator } from "./requestDataGenerator";
import { ContactGenerator, ObtainCopyGenerator } from "./generator";
import { HipaaGenerator } from "./hipaaGenerator";
import { SudGenerator } from "./sudGenerator";

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
    padding: 20,
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
  hipaaCard: {
    border: "1px solid #e0e0e3",
    borderRadius: "10px",
    width: "100%",
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
  obtainCard: {
    height: "auto",
    border: "1px solid #e0e0e3",
    borderRadius: "10px",
    borderBottom: "1px solid #eaeaea !important",
  },
  leftSection: {
    width: "38%",
  },
});

const MyDocument = (props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Image style={styles.image} src={logo} />
        <View style={styles.upperSection}>
          <RequestDataGenerator request={props.data} />
        </View>
        <View style={styles.section}>
          <View style={styles.leftSection}>
            <View style={styles.patientCard}>
              <PatientGenerator request={props.data} />
            </View>
            {props.obtainData.length > 0 && (
              <View style={styles.obtainCard}>
                <ObtainCopyGenerator data={props.obtainData} />
              </View>
            )}
            {props.contactData.length > 0 && (
              <View style={styles.obtainCard}>
                <ContactGenerator data={props.contactData} />
              </View>
            )}
            {props.doctorData.length > 0 && (
              <View style={styles.obtainCard}>
                <DoctorGenerator data={props.doctorData} />
              </View>
            )}
          </View>
          <View style={styles.card}>
            <ContentGenerator
              request={props.data}
              attachmentData={props.attachmentData}
            />
          </View>
        </View>
      </Page>
      {props.hipaaData.id && (
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.hipaaCard}>
            <HipaaGenerator
              hipaaDetails={props.hipaaData}
              request={props.data}
              legalIdData={props.legalIdData}
              hipaaSignData={props.hipaaSignData}
            />
          </View>
        </Page>
      )}
      {props.sudData.id && (
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.hipaaCard}>
            <SudGenerator
              sudDetails={props.sudData}
              request={props.data}
              sudSignData={props.sudSignData}
            />
          </View>
        </Page>
      )}
      {(props.data.medicalRequestFormFileId ||
        props.data.healthInformationAuth ||
        props.data.disorderRequestAuth ||
        props.data.addendumRequestFileId ||
        props.data.editedImageId ||
        props.data.hasPersonalRepresentative ||
        props.data.attachment) && (
        <Page size="A4" style={styles.page} wrap>
          {props.data.medicalRequestFormFileId && (
            <View>
              <Text style={styles.imageHeading}>
                Patient Record Request File
              </Text>
              <Image style={styles.uploadImage} src={props.medical} />
            </View>
          )}
          {props.data.healthInformationAuth && (
            <View>
              <Text style={styles.imageHeading}>HIPAA Request File</Text>
              <Image style={styles.uploadImage} src={props.hipaa} />
            </View>
          )}
          {props.data.disorderRequestAuth && (
            <View>
              <Text style={styles.imageHeading}>
                Substance Use Disorder Form
              </Text>
              <Image style={styles.uploadImage} src={props.disorder} />
            </View>
          )}
          {props.data.hasPersonalRepresentative && (
            <View>
              <Text style={styles.imageHeading}>
                Documentation of Patient Representative
              </Text>
              <Image style={styles.uploadImage} src={props.proxyData} />
            </View>
          )}
          {props.data.addendumRequestFileId && (
            <View>
              <Text style={styles.imageHeading}>Addendum Request Form</Text>
              <Image style={styles.uploadImage} src={props.addendumForm} />
            </View>
          )}
          {props.data.editedImageId && (
            <View>
              <Text style={styles.imageHeading}>
                Screenshot of Medical Record
              </Text>
              <Image style={styles.uploadImage} src={props.screenshot} />
            </View>
          )}
          {props.data.attachment && (
            <View>
              <Text style={styles.imageHeading}>Billing Request Document</Text>
              <Image style={styles.uploadImage} src={props.billingData} />
            </View>
          )}
        </Page>
      )}
    </Document>
  );
};
export default MyDocument;
