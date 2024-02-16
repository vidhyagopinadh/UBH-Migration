import type { FC } from "react";
 import type { RaRecord, Identifier } from "react-admin";
import type { Step } from "react-joyride";
import { Integration } from "../__generated__/typescript-operations_all";
export type ThemeName = "light" | "dark";

// export interface AppState extends ReduxState {
//   theme: ThemeName;
// }
export interface AppStateJoyride {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
}
export interface IHgVerificationResponse {
  name: string;
  idVerificationBaseURL: string;
  params: [
    {
      key: string;
      value: string;
    },
    {
      key: string;
      value: string;
    },
    {
      key: string;
      value: string;
    },
    {
      key: string;
      value: string;
    },
  ];
}
export interface VerificationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  modalType?: string;
  errorType?: string;
  selectedSystem?: Integration;
  setReloadIntegrations?: (arg0: boolean) => void;
}
export interface IdVerificationUpdateProps {
  open: boolean;
  onClose: () => void;
  setEditView: (arg0: boolean) => void;
}
export interface UnEnrollConfirmProps {
  open: boolean;
  onClose: () => void;
  eachIntegration: Integration;
  unEnrollPatient: (arg0: Integration) => void;
}
export interface IdConfirmationProps {
  open: boolean;
  onClose: () => void;
  selectedSystem: Integration;
  systemLogo: string;
}
export interface IdVerificationAgreementProps {
  open: boolean;
  onClose: () => void;
  selectedSystem: Integration;
  systemLogo: string;
}
export interface ILoadingMrrProps {
  open: boolean;
  onClose: () => void;
  setOpenSearchBase: (arg0: boolean) => void;
}
export interface IErrorMrrProps {
  open: boolean;
  onClose: () => void;
}

export interface IConfirmMrrViewProps {
  open: boolean;
  onClose: () => void;
  setOpenLoadingBase: (arg0: boolean) => void;
  setSelectedIntegration: (arg0: string) => void;
  selectedIntegration: string;
  selectedPatientId: string;
  setOpenErrorBase: (arg0: boolean) => void;
}
export interface IdRedirectionProps {
  open: boolean;
  onClose: () => void;
  selectedSystem: Integration;
}
export interface IProviderViewProps {
  commRequestId?: string;
  approvedInstitution : any;
  sameInstitutionData : any;
  submittedInstitution :any;
}
export interface QueryOptions {
  pagination: {
    page: number;
    perPage: number;
  };
  sort: {
    field: string;
    order: string;
  };
  filter: {
    organizationName?: string;
    state?: string;
  };
}
export interface IFetchConfigReturn {
  status: number;
  data?: any;
  error?: any;
}
export interface IAddContactProps {
  getContact: Function;
}
export interface IContactDetailsProps {
  getContact: Function;
  contactData: any;
  requestView: boolean;
}
export interface IAddInstitutionProps {
  getInstitution: Function;
}
export interface ISetAddInstitutionProps {
  setAddInstitution : any;
}

export interface IAutoCompleteWithCreateOption {
  title: string;
  variant: "standard" | "filled" | "outlined";
  optionData :any;
  type: string;
  onAddOption: (InputData: any, type: string) => void;
  fullWidth: boolean;
  problemStatus: boolean;
  problem: string;
  statusChange :any;
  setPriority:any;
  selectedValue:any;
  setPriorityStatus:any;
}

export interface IInput {
  inputValue?: string;
  value?: string;
  id?: string | number;
  priority?: number;
}
export interface State {
  nbRequestListCount?: number;
  outstandingListCount?: number;
  expiringListCount?: number;
}
export interface IAckProps {
  type:
    | "access_denied"
    | "successfully_filled"
    | "ack_filled"
    | "invalid_token"
    | "empty_request_token"
    | "request_signed"
    | "successfully_signed"
    | "thanks_message"
    | "error_message";
}
export interface IEmptyList {
  title: string;
  buttonTitle: string;
}
export interface IValidationValues {
  field?: string;
  fieldValue?: string;
  status?: string;
  message?: string;
}
export interface Props {
  icon: FC<any>;
  to: string;
  title?: string;
  subtitle?: string | number;
}

export interface IPersonDemographic {
  id?: string | number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  electronicDetails?: string;
  phoneNumber?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  addressZip?: string;
}
export interface ITransaction {
  id?: string;
  transaction_id?: string;
  party_id?: string;
  system_id?: string;
  verification_method_id?: number;
  verification_status?: number;
  verified_at?: string;
  expired_at?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  activity_log?: string;
  deleted_at?: string;
  deleted_by?: string;
  external_system_party_id?: string;
  verification_response?: string;
  transaction_log?: string;
}
export interface IDetails {
  patientExternalRefId?: string;
  partnerSysRequestRefId?: string;
}
export interface IIntegrationProps {
  eachIntegration?: Integration;
  setReloadIntegrations?: (arg0: boolean) => void;
}
export interface IStatusProps {
  transId?: string;
  partyId?: string;
}
export interface ITransSteps {
  stepId?: number;
  stepName?: string;
  timestamp?: string;
  completed?: boolean;
  status?: string;
  statusCode?: string;
  message?: string;
}
export interface IBillingDetails {
  id?: string | number;
  others?: string;
  pan?: string;
  mrn?: string;
  signatureId?: string;
  attachmentId?: string;
  sourceNatureId?: number;
  deliverFrom?: number;
  assignToPersonId?: string;
  billingRequestCategoryId?: number;
  billingLocationPhysicianId?: string;
  contactData?: string;
  partyId?: string;
  billingRequestTypeId?: string;
  createdat?: string;
  requestType?: string;
  name?: string;
  institutionName?: string;
  requestCategoryName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  channelName?: string;
  electronicDetails?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
  addressZip?: string;
}
export interface IImageStack {
  disorderDisclosureAuthorizationFileId?: string;
  hipaaAuthorizationFileId?: string;
  medicalRequestFormFileId?: string;
  addendumRequestFileId?: string;
  editedImageId?: string;
  signatureId?: string;
  proxyDocument?: string;
  attachmentId?: string;
  attachment?: string;
}
export interface IAuthorizationComponent {
  requestDetails: IRequestPayload;
  patientRelationStatus: boolean;
  setRepresentative: (RepData: IRepData) => void;
  setpatientRelationStatus:any;
}
export interface RecordInterface {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IRepData {
  patientRepresentative: string;
  patientRelation: string | number;
  date: string;
  valid: boolean;
  error: boolean;
}
export interface PageProps {
  style?: object;
  divider?: boolean;
}
export interface IRepRelation {
  relation?: string;
  id: string | number;
}

export interface IGenericType {
  id: string | number;
  code?: string;
  value?: string;
}
export interface ICopyType {
  id: string | number;
  code?: string;
  value?: string;
  recordStatusValue?: string;
  recordStatusId?: number;
}
export interface Category extends RaRecord {
  name: string;
}
export interface IAuthorizationProps {
  formType: string;
  token: string;
}
export interface IAddendumRequestFormProps {
  id?: number | string;
}
export interface ISignupProps {
  enrollToken?: number | string;
}
export interface IGenericType {
  id: string | number;
  code?: string;
  value?: string;
}

export interface IAlreadyLoggedIn {
  alreadyThere: boolean;
  userName: string;
  role: string;
  email: string;
}

export interface IRequestPayload {
  id?: string | number;
  requestTypeId?: number;
  patientId?: number;
  requestPriorityId?: number;
  noOfDays?: number;
  requestStatusId?: number;
  issueImpactMasterId?: number;
  impactSeverityId?: number;
  issueDescriptionMasterId?: number;
  sourceNatureId?: number;
  destinationNatureId?: number;
  deliverFrom?: number;
  deliverTo?: number;
  departmentId?: number;
  durationOfProblemEncountering?: string;
  disorderDisclosureAuthorizationFile?: string;
  hipaaAuthorizationFile?: string;
  medicalRequestFormFile?: string;
  assignToPersonId?: number;
  mrn?: string;
  hasSensitiveInformation?: true;
  contactPersonallyValue?: number;
  contactByMailValue?: number;
  contactByPhoneValue?: number;
  contactBySmsValue?: number;
  hasSignedRequest?: true;
  recordsRequestedFrom?: string;
  recordsRequestedTo?: string;
  type?: string;
  createdat?: string;
  requesttype?: string;
  requestpriority?: string;
  destinationinstitutionname?: string;
  sourceinstitutionname?: string;
  departmentname?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  electronicDetails?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  addressZip?: string;
  issueImpactMasterValue?: string;
  requeststatus?: string;
  createdfname?: string;
  createdmname?: string;
  createdlastname?: string;
  persontype?: number;
  requestCategoryName?: string;
}

export interface IRequestToken {
  id?: string | number;
  requestId?: string;
  partyId?: string;
  token?: string;
  authFormType?: number;
  isFilled?: boolean;
  isResend?: boolean;
}

export interface Customer extends RaRecord {
  first_name: string;
  last_name: string;
  address: string;
  stateAbbr: string;
  city: string;
  zipcode: string;
  avatar: string;
  birthday: string;
  first_seen: string;
  last_seen: string;
  has_ordered: boolean;
  latest_purchase: string;
  has_newsletter: boolean;
  groups: string[];
  nb_commands: number;
  total_spent: number;
}

export type OrderStatus = "ordered" | "delivered" | "cancelled";

export interface IFileResponse {
  name?: string;
  response?: any;
  fileStatus?: string;
  index?: number;
}
export interface filterOptions {
  organizationName?: string;
  state?: string;
}
export interface IIntegrationError {
  systemName: {
    status: boolean;
    message: string;
  };
  description: {
    status: boolean;
    message: string;
  };
  logoFileId: {
    status: boolean;
    message: string;
  };
  recordStatusId: {
    status: boolean;
    message: string;
  };
  systemCode: {
    status: boolean;
    message: string;
  };
}
export interface IEmailVerify {
  emailVerified?: boolean;
  emailVerifiedAt?: string;
}
export interface IInitialType {
  id: string;
  value?: string;
}
export interface ICatchActivity {
  eventType: IEventType;
  eventBy?: IUser;
  eventStatus: boolean;
}

interface IEventType {
  activityName: string;
  activityUrl: string;
}
export interface IUser {
  userName: string;
}

export interface userInfo {
  id?: string | number;
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  groups: string;
  role: string;
  emailVerified: boolean;
  profilePicId: string;
}

export interface Order extends RaRecord {
  status: OrderStatus;
  basket: BasketItem[];
  date: Date;
  total: number;
}

export interface BasketItem {
  product_id: Identifier;
  quantity: number;
}

export type Invoice = RaRecord;

export type ReviewStatus = "accepted" | "pending" | "rejected";

export interface Review extends RaRecord {
  date: Date;
  status: ReviewStatus;
  customer_id: Identifier;
  product_id: Identifier;
}

export interface ChangeStatus {
  to: string;
  from: string;
}
export interface feedback {
  feedbackData: string;
  rating: number;
}

export interface ITheme {
  spacing: (arg0: number) => string;
}

declare global {
  interface Window {
    restServer: any;
  }
}

export interface IContactDetails {
  contactName: string;
  email: string;
  phone: string;
  error: IContactError;
}
export interface IProviderDetails {
  id: string | number;
  name?: string;
}
export interface ISignupDetails {
  token: string;
  fName: string;
  lName: string;
  emailAddress: string;
  password: string;
  roleName: string;
  categoryId: number;
  mName: string;
  orgName: string;
  medicalGroup: number;
  orgWebsite: string;
  orgEmail: string;
  orgPhone: string;
  orgFax: string;
  orgAddress: string;
  city: string;
  stateId: number;
  countryId: number;
  phoneNumber: string;
  orgZipcode: string;
  providerPartyId: string;
}
export interface IInstitutionDetails {
  companyName: string;
  website: string;
  addressCountryRegion: string;
  addressHouseBuilding: string;
  addressStateProvince: string;
  addressTownCity: string;
  addressZipPostalCode: string;
  workEmail: string;
  workPhone: string;
  companyType: string;
  faxNumber?: string;
  companyTypeId?: number;
  companyDescription: string;
  directAddress?: string;
}
export interface IInstitutionData {
  id: string;
  institutionName: string;
  website: string;
  country: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  institutionEmail: string;
  institutionDescription?: string;
  phoneNumber: string;
  faxNumber: string;
  institutionType: string;
  institutionTypeId: number;
  status: string;
  directAddress: string;
}
export interface IInstitution {
  Name: string;
  Website: string;
  Country: string;
  Address: string;
  State: string;
  City: string;
  Zipcode: string;
  phone: string;
  Fax: string;
  timeOfSubmission: number;
}

export interface IInstitutionError {
  companyName: {
    status: boolean;
    message: string;
  };
  workEmail: {
    status: boolean;
    message: string;
  };
  directAddress: {
    status: false;
    message: "";
  };
  workPhone: {
    status: boolean;
    message: string;
  };
  website: {
    status: boolean;
    message: string;
  };
  addressHouseBuilding: {
    status: boolean;
    message: string;
  };
  addressTownCity: {
    status: boolean;
    message: string;
  };
  addressStateProvince: {
    status: boolean;
    message: string;
  };
  addressCountryRegion: {
    status: boolean;
    message: string;
  };
  addressZipPostalCode: {
    status: boolean;
    message: string;
  };
  faxNumber: {
    status: boolean;
    message: string;
  };
  companyDescription: {
    status: boolean;
    message: string;
  };
  companyType: {
    status: boolean;
    message: string;
  };
}
export interface IProfileError {
  firstName: {
    status: boolean;
    message: string;
  };
  middleName: {
    status: boolean;
    message: string;
  };
  lastName: {
    status: boolean;
    message: string;
  };
  preferredLanguageId: {
    status: boolean;
    message: string;
  };
  preferredPronouns: {
    status: boolean;
    message: string;
  };
  birthDate: {
    status: boolean;
    message: string;
  };
  electronicDetails: {
    status: boolean;
    message: string;
  };
  directAddress: {
    status: boolean;
    message: string;
  };
  number: {
    status: boolean;
    message: string;
  };
  ssn: {
    status: boolean;
    message: string;
  };
  sex: {
    status: boolean;
    message: string;
  };
  gender: {
    status: boolean;
    message: string;
  };
  sexOthers: {
    status: boolean;
    message: string;
  };
  genderOthers: {
    status: boolean;
    message: string;
  };
  addressLine1: {
    status: boolean;
    message: string;
  };
  addressLine2: {
    status: boolean;
    message: string;
  };
  city: {
    status: boolean;
    message: string;
  };
  state: {
    status: boolean;
    message: string;
  };
  addressZip: {
    status: boolean;
    message: string;
  };
}

export interface IInviteError {
  fName: {
    status: boolean;
    message: string;
  };
  mName: {
    status: boolean;
    message: string;
  };
  lName: {
    status: boolean;
    message: string;
  };
  emailAddress: {
    status: boolean;
    message: string;
  };
  phoneNumber: {
    status: boolean;
    message: string;
  };
  groupId: {
    status: boolean;
    message: string;
  };
  providerName: {
    status: boolean;
    message: string;
  };
}
export interface PatientDetails {
  id: string;
  suffix: string | null;
  ssn: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  previousSuffix: string | null;
  previousFirstName: string | null;
  previousMiddleName: string | null;
  previousLastName: string | null;
  previousName: string;
  directAddress: string;
  sexId: number;
  sex: string;
  gender: string;
  preferredLanguageId: number;
  preferredLanguage: string;
  preferredPronounsId: number;
  prefferedPronouns: string;
  email: string;
  birthDate: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  stateId: number;
  country: string;
  countryId: number;
  zip: string;
  previousAddress: string;
  personType: string;
  recordStatusId: number;
  recordStatus: string;
  registrationStatus: string;
  phoneNumber: string;
  inviteDetails: string;
  relatedPersonRelationshipId: number;
  __typename: string;
}
export interface LocationState {
  patientDetails: PatientDetails; // Replace with the actual type
  isForEdit: boolean;
  type: string;
}
export interface institutionData {
  institutionDetails: IInstitutionData;
}
export interface IRegisterError {
  fName: {
    status: boolean;
    message: string;
  };
  mName: {
    status: boolean;
    message: string;
  };
  lName: {
    status: boolean;
    message: string;
  };
  emailAddress: {
    status: boolean;
    message: string;
  };
  phoneNumber: {
    status: boolean;
    message: string;
  };
  password: {
    status: boolean;
    message: string;
  };
  confirmPassword: {
    status: boolean;
    message: string;
  };
  orgName: {
    status: boolean;
    message: string;
  };
  orgWebsite: {
    status: boolean;
    message: string;
  };
  orgEmail: {
    status: boolean;
    message: string;
  };
  orgPhone: {
    status: boolean;
    message: string;
  };
  orgFax: {
    status: boolean;
    message: string;
  };
  orgAddress: {
    status: boolean;
    message: string;
  };
  city: {
    status: boolean;
    message: string;
  };
  orgZipcode: {
    status: boolean;
    message: string;
  };
}
interface IContactError {
  contactName: {
    status: boolean;
    message: string;
  };
  email: {
    status: boolean;
    message: string;
  };
  phone: {
    status: boolean;
    message: string;
  };
}

export interface IDoctorDetails {
  name: string;
  institution: string;
  address: string;
  phone: string;
  error: IDoctorError;
}

interface IDoctorError {
  name: {
    status: boolean;
    message: string;
  };
  institution: {
    status: boolean;
    message: string;
  };
  address: {
    status: boolean;
    message: string;
  };
  phone: {
    status: boolean;
    message: string;
  };
}
export interface ILoginParams {
  username: string;
  password: string;
}
export interface IAuthResponse {
  state: boolean;
  message: string;
}
export interface IEmptyValidationReturn {
  fieldName?: string;
  status?: string;
}
export interface userRoleInfo {
  role: string;
}
export interface IGenericType {
  id: string | number;
  code?: string;
  value?: string;
}

export interface IIssueDescriptionMaster {
  id: string | number;
  value?: string;
  prioriy?: number;
}
export interface IOrganization {
  id: string | number;
  organizationName?: string;
  parentOrgId?: number;
}
export interface IHowLongVal {
  howLong: string;
  howLongUnit: string;
}
export type IsValid = "valid" | "invalid";

export interface ICheckPatientValidatorProps {
  isValid: boolean;
  isInit: boolean;
}
export interface IPatientParams {
  patientFirstName?: string;
  patientMiddleName?: string;
  patientLastName?: string;
  patientEmail?: string;
  patientDOB?: string;
  patientPhone?: string;
  street?: string;
  addressLine2?: string;
  ssn?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  relationshipId?: number;
  suffix?: string;
  previousSuffix?: string;
  preferredLanguageId?: string;
  preferredPronouns?: string;
  sex: {
    id?: number;
    value?: string;
    otherValue?: string;
    other?: boolean;
  };
  gender: {
    id?: number;
    value?: string;
    otherValue?: string;
    other?: boolean;
  };
  previousFirstName?: string;
  previousLastName?: string;
  previousMiddleName?: string;
  previousAddressLine1?: string;
  previousAddressLine2?: string;
  previousCity?: string;
  previousState?: string;
  previousCountry?: string;
  previousAddressZip?: string;
  isPreviousAddress?: boolean;
  stateValue?: string;
  countryValue?: string;
}
export interface IProfile {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  electronicDetails?: string;
  birthDate?: string;
  number?: string;
  suffix?: string;
  personType?: number;
  addressLine1?: string;
  addressLine2?: string;
  ssn?: string;
  city?: string;
  state?: number;
  country?: number;
  // stateValue?: string;
  countryValue?: string;
  addressZip?: string;
  // directAddress?: string;
  previousFirstName?: string;
  previousMiddleName?: string;
  previousLastName?: string;
  preferredLanguageId?: number;
  preferredPronouns?: number;
  isPreviousAddress?: boolean;
  previousAddressLine1?: string;
  previousAddressLine2?: string;
  previousCity?: string;
  previousState?: string;
  previousCountry?: string;
  previousAddressZip?: string;
  relationshipId?: string;
  sex: {
    id?: number;
    value?: string;
    otherValue?: string;
    other?: boolean;
  };
  gender: {
    id?: number;
    value?: string;
    otherValue?: string;
    other?: boolean;
  };
}
export interface IAddPatientProps {
  checkPatientValidator: ({
    isValid,
    isInit,
  }: ICheckPatientValidatorProps) => void;
  getpatient: Function;
  alertAddPatient: boolean;
  requestData :any;
  requestView?: boolean;
  type?: string;
  dependentData : any;
  setDisableSelection: Function;
}

export interface IHowLongVal {
  howLong: string;
  howLongUnit: string;
}

export interface IBillingOrganization {
  id: string | number;
  organization?: string;
  organizationGroupId?: number;
}

export interface IContactType {
  isPhone?: boolean;
  istext?: boolean;
  contactDataTitle?: string;
  isEmail?: boolean;
}

export interface IPatientSet {
  city: string;
  street: string;
  state: string;
  country: string;
  zipCode: string;
  patientDOB: string;
  patientEmail: string;
  patientPhone: string;
  patientFirstName: string;
  patientLastName: string;
  patientMiddleName: string;
}
