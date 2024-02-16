type ICorrelationConstants = Record<
  string,
  {
    eventTitle: string;
    aecId: string;
    aecIeId: string;
  }
>;

type IParentAec = Record<
  string,
  {
    aecTitle: string;
    aecId: string;
  }
>;

const parentAec: IParentAec = {
  "aec-p-001": {
    aecTitle: "LogIn to Unblock Health",
    aecId: "AEC-COPA-RA-FN-GN-0001",
  },
  "aec-p-003": {
    aecTitle: "Logged In as PPA",
    aecId: "AEC-COPA-RA-PPA-GN-0003",
  },
  "aec-p-004": {
    aecTitle: "Requests Operations by PPA",
    aecId: "AEC-COPA-RA-PPA-RE-0004",
  },
  "aec-p-005": {
    aecTitle: "Medical Record Requests Operations by PPA",
    aecId: "AEC-COPA-RA-PPA-MR-0005",
  },
  "aec-p-006": {
    aecTitle: "Addendum Requests Operations by PPA",
    aecId: "AEC-COPA-RA-PPA-AR-0006",
  },
  "aec-p-007": {
    aecTitle: "Billing Requests Operations by PPA",
    aecId: "AEC-COPA-RA-PPA-BR-0007",
  },
  "aec-p-008": {
    aecTitle: "Patients List Operations by PPA",
    aecId: "AEC-COPA-RA-PPA-PA-0008",
  },
  "aec-p-009": {
    aecTitle: "Logged In as MRA",
    aecId: "AEC-COPA-RA-MRA-GN-0009",
  },
  "aec-p-010": {
    aecTitle: "Tasks Operations by MRA",
    aecId: "AEC-COPA-RA-MRA-RE-0010",
  },
  "aec-p-011": {
    aecTitle: "Logged In as Guest User",
    aecId: "AEC-COPA-RA-GU-GN-0012",
  },
  "aec-p-012": {
    aecTitle: "HIPAA operations by Guest User",
    aecId: "AEC-COPA-RA-GU-HA-0013",
  },
  "aec-p-013": {
    aecTitle: "SUD operations by Guest User",
    aecId: "AEC-COPA-RA-GU-SU-0014",
  },
  "aec-p-014": {
    aecTitle: "Patient Record Request Form operations by Guest User",
    aecId: "AEC-COPA-RA-GU-PF-0015",
  },
  "aec-p-015": {
    aecTitle: "Addendum Form operations by Guest User",
    aecId: "AEC-COPA-RA-GU-AF-0016",
  },
  "aec-p-016": {
    aecTitle: "Feedback operations by PPA",
    aecId: "AEC-COPA-RA-PPA-GN-0017",
  },
  "aec-p-017": {
    aecTitle: "Feedback operations by MRA",
    aecId: "AEC-COPA-RA-MRA-GN-0018",
  },
  "aec-p-018": {
    aecTitle: "Logged In as Patient",
    aecId: "AEC-COPA-RA-PU-GN-0003",
  },
  "aec-p-019": {
    aecTitle: "Requests Operations by Patient",
    aecId: "AEC-COPA-RA-PU-RE-0004",
  },
  "aec-p-020": {
    aecTitle: "Medical Record Requests Operations by Patient",
    aecId: "AEC-COPA-RA-PU-MR-0005",
  },
  "aec-p-021": {
    aecTitle: "Addendum Requests Operations by Patient",
    aecId: "AEC-COPA-RA-PU-AR-0006",
  },
  "aec-p-022": {
    aecTitle: "Billing Requests Operations by Patient",
    aecId: "AEC-COPA-RA-PU-BR-0007",
  },
  "aec-p-023": {
    aecTitle: "Dependents List Operations by Patient",
    aecId: "AEC-COPA-RA-PU-PA-0008",
  },
  "aec-p-024": {
    aecTitle: "Profile Operations by Patient",
    aecId: "AEC-COPA-RA-PU-PR-0001",
  },
  "aec-p-025": {
    aecTitle: "Identity Verification Operations by Patient",
    aecId: "AEC-COPA-RA-PU-IDV-0017",
  },
};

const correlationConstants: ICorrelationConstants = {
  "ev-001": {
    eventTitle: "Open URL in the browser",
    aecId: parentAec["aec-p-001"].aecId,
    aecIeId: parentAec["aec-p-001"].aecId + "-IE001",
  },
  "ev-002": {
    eventTitle: "Log in page is loaded",
    aecId: parentAec["aec-p-001"].aecId,
    aecIeId: parentAec["aec-p-001"].aecId + "-IE002",
  },
  "ev-003": {
    eventTitle: "Click on sign in button",
    aecId: parentAec["aec-p-001"].aecId,
    aecIeId: parentAec["aec-p-001"].aecId + "-IE003",
  },
  "ev-004": {
    eventTitle: "Token received from Keycloak",
    aecId: parentAec["aec-p-001"].aecId,
    aecIeId: parentAec["aec-p-001"].aecId + "-IE004",
  },
  "ev-005": {
    eventTitle: "User Logged In successfully",
    aecId: parentAec["aec-p-001"].aecId,
    aecIeId: parentAec["aec-p-001"].aecId + "-IE005",
  },
  "ev-006": {
    eventTitle: "User Login failure",
    aecId: parentAec["aec-p-001"].aecId,
    aecIeId: parentAec["aec-p-001"].aecId + "-IE006",
  },
  "ev-037": {
    eventTitle:
      "Token verification.verify the role of the user( Role should be PPA)",
    aecId: parentAec["aec-p-003"].aecId,
    aecIeId: parentAec["aec-p-003"].aecId + "-IE001",
  },
  "ev-038": {
    eventTitle: "Dashboard is loaded(PPA)",
    aecId: parentAec["aec-p-003"].aecId,
    aecIeId: parentAec["aec-p-003"].aecId + "-IE002",
  },
  "ev-039": {
    eventTitle: "Data Loaded in Dashboard",
    aecId: parentAec["aec-p-003"].aecId,
    aecIeId: parentAec["aec-p-003"].aecId + "-IE003",
  },
  "ev-040": {
    eventTitle: "Click My requests",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE001",
  },
  "ev-041": {
    eventTitle: "All Requests are listed",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE002",
  },
  "ev-042": {
    eventTitle:
      "Requests can be filter based on Priority, status and request type.",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE003",
  },
  "ev-043": {
    eventTitle: "Click on View More Button",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE004",
  },
  "ev-044": {
    eventTitle: "Request loaded",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE005",
  },
  "ev-045": {
    eventTitle: "Click on activity",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE006",
  },
  "ev-046": {
    eventTitle: "Post reply and post internal notes are filled by user",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE007",
  },
  "ev-047": {
    eventTitle: "Click on Change request status",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE008",
  },
  "ev-048": {
    eventTitle: "When change the request status into denied, upload signature",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE009",
  },
  "ev-049": {
    eventTitle: "Click on Submit button",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE010",
  },
  "ev-050": {
    eventTitle: "Click on Delete button",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE011",
  },
  "ev-051": {
    eventTitle: "  Click download",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE012",
  },
  "ev-052": {
    eventTitle: "Files Downloaded",
    aecId: parentAec["aec-p-004"].aecId,
    aecIeId: parentAec["aec-p-004"].aecId + "-IE013",
  },
  "ev-053": {
    eventTitle: "Click on create medical records request",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE001",
  },
  "ev-054": {
    eventTitle: "Patient record request form loaded",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE002",
  },
  "ev-055": {
    eventTitle: "Data filled by the user in Medical Record Request",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE003",
  },
  "ev-056": {
    eventTitle: "Attach Patient Record Request Form.",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE004",
  },
  "ev-057": {
    eventTitle:
      "When Patient Record Request Form is not attached: Message appears -> Successfully send Patient Record Request Form E-mail.",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE005",
  },
  "ev-058": {
    eventTitle: "Attach Substance Use Disorders form.",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE006",
  },
  "ev-059": {
    eventTitle:
      "When substance use disorders form is not attached: Message appears -> Successfully send Substance use disorder authorization form E-mail.",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE007",
  },
  "ev-060": {
    eventTitle: "Attach HIPAA authorization Form",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE008",
  },
  "ev-061": {
    eventTitle:
      "When HIPAA authorization form is not attached: Message appears -> Successfully send HIPAA authorization Form E-mail",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE009",
  },
  "ev-062": {
    eventTitle: "Submit Clicked",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE010",
  },
  "ev-063": {
    eventTitle: "Display 'Successfully created request'  message",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE011",
  },
  "ev-118": {
    eventTitle: "New institution added",
    aecId: parentAec["aec-p-005"].aecId,
    aecIeId: parentAec["aec-p-005"].aecId + "-IE012",
  },
  "ev-064": {
    eventTitle: "Click on Create Addendum Request",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE001",
  },
  "ev-065": {
    eventTitle: "Correction/Amendment Request Form loaded",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE002",
  },
  "ev-066": {
    eventTitle: "Data loaded in Addendum Request",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE003",
  },
  "ev-067": {
    eventTitle: "Data filled in Addendum Request",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE004",
  },
  "ev-068": {
    eventTitle: "Attach Screen shot of the Medical Record(optional)",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE005",
  },
  "ev-069": {
    eventTitle: "Attach signed addendum request form.",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE006",
  },
  "ev-070": {
    eventTitle:
      "When addendum request form is not attached: Display message 'Successfully send addendum request form E-mail'.",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE007",
  },
  "ev-071": {
    eventTitle: "Submit clicked",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE008",
  },
  "ev-072": {
    eventTitle: " Addendum request created",
    aecId: parentAec["aec-p-006"].aecId,
    aecIeId: parentAec["aec-p-006"].aecId + "-IE009",
  },
  "ev-073": {
    eventTitle: "Click on Create Billing/Insurance question request",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE001",
  },
  "ev-074": {
    eventTitle: "Billing/Insurance Question Request Form loaded",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE002",
  },
  "ev-075": {
    eventTitle: "Data loaded in Billibg Request form",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE003",
  },
  "ev-076": {
    eventTitle: "Data filled by the user in Billing Request",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE004",
  },
  "ev-077": {
    eventTitle: "Attach document (Optional)",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE005",
  },
  "ev-078": {
    eventTitle: "Submit Billing Request Form",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE006",
  },
  "ev-079": {
    eventTitle: " Billing request created.",
    aecId: parentAec["aec-p-007"].aecId,
    aecIeId: parentAec["aec-p-007"].aecId + "-IE007",
  },
  "ev-080": {
    eventTitle: "Click on Patients",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE001",
  },
  "ev-081": {
    eventTitle: "Patients List displayed",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE002",
  },
  "ev-082": {
    eventTitle: "Click on Actions",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE003",
  },
  "ev-083": {
    eventTitle: "Popup Window loaded",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE004",
  },
  "ev-084": {
    eventTitle: "Click on Account Close",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE005",
  },
  "ev-085": {
    eventTitle: "Account Successfully Closed",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE006",
  },
  "ev-086": {
    eventTitle: "Click on Export",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE007",
  },
  "ev-087": {
    eventTitle: "patienDemographics file downloaded as csv format",
    aecId: parentAec["aec-p-008"].aecId,
    aecIeId: parentAec["aec-p-008"].aecId + "-IE008",
  },
  "ev-088": {
    eventTitle:
      "Token verification.verify the role of the user( Role should be MRA)",
    aecId: parentAec["aec-p-009"].aecId,
    aecIeId: parentAec["aec-p-009"].aecId + "-IE001",
  },
  "ev-089": {
    eventTitle: "Dashboard is loaded(MRA)",
    aecId: parentAec["aec-p-009"].aecId,
    aecIeId: parentAec["aec-p-009"].aecId + "-IE002",
  },
  "ev-090": {
    eventTitle: "Data loaded in Dashboard ",
    aecId: parentAec["aec-p-009"].aecId,
    aecIeId: parentAec["aec-p-009"].aecId + "-IE003",
  },
  "ev-091": {
    eventTitle: "Click on My Tasks",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE001",
  },
  "ev-092": {
    eventTitle: "All Requests are listed",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE002",
  },
  "ev-093": {
    eventTitle:
      "Requests can be filter based on Priority, status and request type.",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE003",
  },
  "ev-094": {
    eventTitle: "Click on View More",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE004",
  },
  "ev-095": {
    eventTitle: "Request loaded",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE005",
  },
  "ev-096": {
    eventTitle: "Click on Activity",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE006",
  },
  "ev-097": {
    eventTitle: "Post reply and post internal notes are filled by user",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE007",
  },
  "ev-098": {
    eventTitle: "Click on Change request status",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE008",
  },
  "ev-099": {
    eventTitle: "When change the request status into denied, upload signature",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE009",
  },
  "ev-100": {
    eventTitle: "Submit Denial Form",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE010",
  },
  "ev-101": {
    eventTitle: "Click on Delete",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE011",
  },
  "ev-102": {
    eventTitle: "Click on Download",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE012",
  },
  "ev-103": {
    eventTitle: "Files Downloaded",
    aecId: parentAec["aec-p-010"].aecId,
    aecIeId: parentAec["aec-p-010"].aecId + "-IE013",
  },
  "ev-104": {
    eventTitle: "Logged in as Guest",
    aecId: parentAec["aec-p-011"].aecId,
    aecIeId: parentAec["aec-p-011"].aecId + "-IE001",
  },
  "ev-105": {
    eventTitle: "HIPAA form loaded",
    aecId: parentAec["aec-p-012"].aecId,
    aecIeId: parentAec["aec-p-012"].aecId + "-IE001",
  },
  "ev-106": {
    eventTitle: "Upload legal ID in HIPAA form",
    aecId: parentAec["aec-p-012"].aecId,
    aecIeId: parentAec["aec-p-012"].aecId + "-IE002",
  },
  "ev-107": {
    eventTitle: "Upload signature in HIPAA form",
    aecId: parentAec["aec-p-012"].aecId,
    aecIeId: parentAec["aec-p-012"].aecId + "-IE003",
  },
  "ev-108": {
    eventTitle: "Submit HIPAA form",
    aecId: parentAec["aec-p-012"].aecId,
    aecIeId: parentAec["aec-p-012"].aecId + "-IE004",
  },
  "ev-109": {
    eventTitle: "Substance use Disorder form loaded",
    aecId: parentAec["aec-p-013"].aecId,
    aecIeId: parentAec["aec-p-013"].aecId + "-IE001",
  },
  "ev-110": {
    eventTitle: "Upload signature in Substance use Disorder form",
    aecId: parentAec["aec-p-013"].aecId,
    aecIeId: parentAec["aec-p-013"].aecId + "-IE002",
  },
  "ev-111": {
    eventTitle: "Submit Substance use Disorder form",
    aecId: parentAec["aec-p-013"].aecId,
    aecIeId: parentAec["aec-p-013"].aecId + "-IE003",
  },
  "ev-112": {
    eventTitle: "Patient Record Request Form Loaded",
    aecId: parentAec["aec-p-014"].aecId,
    aecIeId: parentAec["aec-p-014"].aecId + "-IE001",
  },
  "ev-113": {
    eventTitle: "Upload signature in Patient Request Form",
    aecId: parentAec["aec-p-014"].aecId,
    aecIeId: parentAec["aec-p-014"].aecId + "-IE002",
  },
  "ev-114": {
    eventTitle: "Submit Patient Request Form",
    aecId: parentAec["aec-p-014"].aecId,
    aecIeId: parentAec["aec-p-014"].aecId + "-IE003",
  },
  "ev-115": {
    eventTitle: "Addendum Form Loaded",
    aecId: parentAec["aec-p-015"].aecId,
    aecIeId: parentAec["aec-p-015"].aecId + "-IE001",
  },
  "ev-116": {
    eventTitle: "Upload signature in Addendum Form",
    aecId: parentAec["aec-p-015"].aecId,
    aecIeId: parentAec["aec-p-015"].aecId + "-IE002",
  },
  "ev-117": {
    eventTitle: "Submit Addendum Form",
    aecId: parentAec["aec-p-015"].aecId,
    aecIeId: parentAec["aec-p-015"].aecId + "-IE003",
  },
  "ev-119": {
    eventTitle: "Submit Feedback form by PPA",
    aecId: parentAec["aec-p-016"].aecId,
    aecIeId: parentAec["aec-p-016"].aecId + "-IE001",
  },
  "ev-120": {
    eventTitle: "Submit Feedback form by MRA",
    aecId: parentAec["aec-p-017"].aecId,
    aecIeId: parentAec["aec-p-017"].aecId + "-IE001",
  },
  //Patient traces
  "ev-121": {
    eventTitle:
      "Token verification.verify the role of the user( Role should be Patient)",
    aecId: parentAec["aec-p-018"].aecId,
    aecIeId: parentAec["aec-p-018"].aecId + "-IE001",
  },
  "ev-122": {
    eventTitle: "Dashboard is loaded(Patient)",
    aecId: parentAec["aec-p-018"].aecId,
    aecIeId: parentAec["aec-p-018"].aecId + "-IE002",
  },
  "ev-123": {
    eventTitle: "Data Loaded in Dashboard",
    aecId: parentAec["aec-p-018"].aecId,
    aecIeId: parentAec["aec-p-018"].aecId + "-IE003",
  },
  "ev-124": {
    eventTitle: "Click My requests",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE001",
  },
  "ev-125": {
    eventTitle: "All Requests are listed",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE002",
  },
  "ev-126": {
    eventTitle: "Requests can be filtered.",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE003",
  },
  "ev-127": {
    eventTitle: "Click on View More Button",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE004",
  },
  "ev-128": {
    eventTitle: "Request loaded",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE005",
  },
  "ev-129": {
    eventTitle: "Click on activity",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE006",
  },
  "ev-130": {
    eventTitle: "Click on Change request status",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE008",
  },
  "ev-131": {
    eventTitle: "Click on Delete button",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE011",
  },
  "ev-132": {
    eventTitle: "Click on Edit button",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE011",
  },
  "ev-133": {
    eventTitle: "Click download",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE012",
  },
  "ev-134": {
    eventTitle: "Files Downloaded",
    aecId: parentAec["aec-p-019"].aecId,
    aecIeId: parentAec["aec-p-019"].aecId + "-IE013",
  },
  "ev-135": {
    eventTitle: "Click on create medical records request",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE001",
  },
  "ev-136": {
    eventTitle: "Patient record request form loaded",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE002",
  },
  "ev-137": {
    eventTitle: "Data filled by the user in Medical Record Request",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE003",
  },
  "ev-138": {
    eventTitle: "Attach Patient Record Request Form.",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE004",
  },
  "ev-139": {
    eventTitle: "Attach Substance Use Disorders form.",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE006",
  },
  "ev-140": {
    eventTitle: "Attach HIPAA authorization Form",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE008",
  },
  "ev-141": {
    eventTitle: "Submit Clicked",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE010",
  },
  "ev-142": {
    eventTitle: "Display 'Successfully created request'  message",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE011",
  },
  "ev-143": {
    eventTitle: "New institution added",
    aecId: parentAec["aec-p-020"].aecId,
    aecIeId: parentAec["aec-p-020"].aecId + "-IE012",
  },

  "ev-144": {
    eventTitle: "Click on Dependents",
    aecId: parentAec["aec-p-023"].aecId,
    aecIeId: parentAec["aec-p-023"].aecId + "-IE001",
  },
  "ev-145": {
    eventTitle: "Dependents List displayed",
    aecId: parentAec["aec-p-023"].aecId,
    aecIeId: parentAec["aec-p-023"].aecId + "-IE002",
  },
  "ev-146": {
    eventTitle: "Click on Edit",
    aecId: parentAec["aec-p-023"].aecId,
    aecIeId: parentAec["aec-p-023"].aecId + "-IE003",
  },
  "ev-147": {
    eventTitle: "Click on Account Close",
    aecId: parentAec["aec-p-023"].aecId,
    aecIeId: parentAec["aec-p-023"].aecId + "-IE005",
  },
  "ev-148": {
    eventTitle: "Select Profile",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE001",
  },
  "ev-149": {
    eventTitle: "Profile loaded",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE002",
  },
  "ev-150": {
    eventTitle: "Change Profile picture",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE003",
  },
  "ev-151": {
    eventTitle: "View SSN",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE004",
  },
  "ev-152": {
    eventTitle: "Click on verify email button",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE005",
  },
  "ev-153": {
    eventTitle: "Click on edit profile",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE006",
  },
  "ev-154": {
    eventTitle: "Close Edit form",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE007",
  },
  "ev-155": {
    eventTitle: "Submit updated details",
    aecId: parentAec["aec-p-024"].aecId,
    aecIeId: parentAec["aec-p-024"].aecId + "-IE008",
  },
  "ev-156": {
    eventTitle: "Select Id verification tab",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE001",
  },
  "ev-157": {
    eventTitle: "Click start verify button",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE002",
  },
  "ev-158": {
    eventTitle: "Agreement loaded",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE003",
  },
  "ev-159": {
    eventTitle: "Click on agree button",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE004",
  },
  "ev-160": {
    eventTitle: "Click on cancel button",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE005",
  },
  "ev-161": {
    eventTitle: "Validation popup displayed",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE006",
  },
  "ev-162": {
    eventTitle: "Click on allow and continue",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE007",
  },
  "ev-163": {
    eventTitle: "Click on cancel button",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE008",
  },
  "ev-164": {
    eventTitle: "Redirect to IAS verification site",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE009",
  },
  "ev-165": {
    eventTitle: "Success popup displayed after verification",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE010",
  },
  "ev-166": {
    eventTitle: "Error popup displayed after verification",
    aecId: parentAec["aec-p-025"].aecId,
    aecIeId: parentAec["aec-p-025"].aecId + "-IE011",
  },
};

export { parentAec, correlationConstants };
