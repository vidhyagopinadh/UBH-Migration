import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
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
    height: "70px",
    width: "100px",
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

export const ContentGenerator = ({ request, attachmentData }: any) => {
  const adRep = request.isRequestedSupport
    ? {
      "Representative Name": request.representName,
      "Representative Email": request.representMail,
    }
    : {};
  const requestContent: any = {
    billing: {
      "Request Type": request.requestCategoryName,
      "Description of Billing Question Request": request.requesttype,
      PAN: request.pan,
      "Organization Group": request.organizationgroupname,
      Organization: request.sourceinstitutionname,
      "Assign To": `${request.assignedfname} ${request.assignedmname} ${request.assignedlastname}`,
      "Contact By": request.channelName,
      "Way to contact regarding this request": request.contactData,
    },
    request: {
      "Request Type": request.requestType
        ? JSON.parse(request.requestType).other
          ? JSON.parse(request.requestType).other_value
          : JSON.parse(request.requestType).value
        : "",
      "Records requested from": `${tommddyyyy(
        request.recordsRequestedFrom,
      )}    to    ${tommddyyyy(request.recordsRequestedTo)}`,
      "How does this impact your care or access to information?":
        request.issueImpactMasterValue,
      "Nature of source": request.sourceNature,
      "Source Institution": request.sourceinstitutionname,
      Department: request.departmentname,
      "Assign To": request.assignedfname
        ? `${request.assignedfname} ${request.assignedmname} ${request.assignedlastname}`
        : "",
      "Requested support from the corresponding facility":
        request.isRequestedSupport ? "Yes" : "No",
      "Submitted a signed medical records request": request.hasSignedRequest
        ? "Yes"
        : "No",
      "Like to be contacted personally regarding this request?": `${request.contactPersonallyValue ? "Yes:" : "No"
        }
          ${request.contactByMailValue ? "  By Mail  ," : ""}
          ${request.contactByPhoneValue ? "  By Call , " : ""}
          ${request.contactBySmsValue ? "  By SMS  " : ""}`,
      "Email or send secure message to the email address":
        request.electronicDetails,
      "Please indicate whether you would like to inspect or receive a copy of your records":
        request.isInspect
          ? "Inspect"
          : request.isObtainCopy
            ? "Obtain Copy "
            : "Nil",
      // "Fax Number": obtainData ? request.faxNumber : "Nil",
      // "Other Formats":request.otherFormat?request.otherFormat:"NIl",
      "Do you have a signed HIPAA authorization form?":
        request.hipaaAuthorizationFile ? "Yes" : "No",
      "These records contain sensitive information such as Substance Use Disorder or mental health condition?":
        request.hasSensitiveInformation ? "Yes" : "No",
    },

    addendum: {
      "Physician Name": request.provider,
      "Source Institution": request.sourceinstitutionname,
      Department: request.departmentname,
      "Date of service": tommddyyyy(request.servicedDate),
      "Change to be made": request.changeRequest,
      "Reason for request change": request.reason,
      "Would you like the response to be sent to a representative email address?":
        request.isRequestedSupport ? "Yes" : "No",

      ...adRep,
    },
  };
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.heading}>Request Details</Text>
      {Object.entries(requestContent[request.categoryType]).map(
        (eachContent) => (
          <View style={styles.listitemStyle}>
            <Text style={styles.title}> {`${eachContent[0]}`}: &nbsp;</Text>
            <Text style={styles.subTitle}>{`${eachContent[1]}`}</Text>
          </View>
        ),
      )}
      {request.signatureId && (
        <View style={{ display: "flex" }}>
          <Text style={styles.imageHeading}>Signature</Text>
          <Image style={styles.uploadImage} src={attachmentData} />
        </View>
      )}
    </View>
  );
};
