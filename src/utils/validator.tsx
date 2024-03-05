import moment from "moment";

export const validateString = (input: string | undefined): boolean => {
  const expression = /^[a-zA-Z .]{1,100}$/;
  return expression.test(String(input).toLowerCase().trim());
};
export const validateIntegrationName = (input: string | undefined): boolean => {
  const expression = /^(.*[a-zA-Z]){3,}/;
  return expression.test(String(input).toLowerCase().trim());
};
export const validateAlphaNumeric = (input: string | undefined): boolean => {
  const expression = /^([a-zA-Z0-9 _-]+)$/;
  return expression.test(String(input).toLowerCase().trim());
};
export const validateSentance = (input: string | undefined): boolean => {
  const expression = /^[^<>]+$/;
  return expression.test(String(input).toLowerCase().trim());
};
export const validateSystemCode = (input: string | undefined): boolean => {
  const expression = /^[a-zA-Z0-9_-]+/;
  return expression.test(String(input).trim());
};
export const validateCompanyName = (input: string | undefined): boolean => {
  const expression = /^[^"_]+$/;
  return expression.test(String(input).toLowerCase().trim());
};

export const validateSubjectLine = (input: string | undefined): boolean => {
  if (!input || typeof input !== "string") {
    return false;
  }
  const expression = /^(?![.,_-]*$).{5,255}$/;
  return expression.test(input.trim());
};

export const validateDescription = (input: string | undefined): boolean => {
  if (!input || typeof input !== "string") {
    return false;
  }
  const expression = /^[^<>]{25,}$/;
  return expression.test(input.trim());
};
export const validateWebAddress = (input: string | undefined): boolean => {
  const expression =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return expression.test(String(input).trim());
};
export const validateEmail = (email: string | undefined): boolean => {
  const expression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){1,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return expression.test(String(email).toLowerCase().trim());
};
export const validatePassword = (password: string | undefined): boolean => {
  const expression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return expression.test(String(password).trim());
};

export const validatePhone = (phone: string | undefined): boolean => {
  const expression = /^\+[1-9]{1}[ ]\([0-9]{3}\)[ ][0-9]{3}-[0-9]{4}$/;
  return expression.test(String(phone).trim());
};
export const validateSsn = (ssn: string | undefined): boolean => {
  const expression = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  return expression.test(String(ssn).trim());
};
export const validateZipCode = (
  zipCode: string | undefined,
  countryCode = "US",
): boolean => {
  let zipCodeRegex;

  switch (countryCode) {
    case "US":
      zipCodeRegex = /^\d{5}$/;
      break;
    case "CA":
      zipCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
      break;
    default:
      zipCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?/;
  }
  if (!zipCode) return false;
  return zipCodeRegex.test(zipCode);
};

export const validateMRN = (mrn: string | undefined): boolean => {
  const expression = /^[A-Za-z0-9]+$/;
  return expression.test(String(mrn).trim());
};
export const validateFileName = (fileName: string | undefined): boolean => {
  const expression =
    /^[a-zA-Z0-9\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\%\+\~\_ ]*[.]{1}[a-zA-Z- ]*$/;
  return expression.test(String(fileName));
};
export const validateFirstName = (input: string | undefined): boolean => {
  const expression = /^[a-zA-Z .]{3,100}$/;
  return expression.test(String(input).toLowerCase().trim());
};

export const emptyFieldValidator = (fieldValue: string): boolean => {
  return !fieldValue;
};
export const formatSSN = (ssn): string => {
  const numericSSN = ssn.replace(/\D/g, "");
  let formattedSSN = "";
  for (let i = 0; i < numericSSN.length; i++) {
    if (i === 3 || i === 5) {
      formattedSSN += "-";
    }
    formattedSSN += numericSSN[i];
  }
  return formattedSSN;
};
export const validateDate = (value: string): boolean => {
  const format = "MM/DD/YYYY";
  const formattedValue = moment(value, format).format(format);
  const valid = moment(formattedValue, format, true).isValid();
  return (
    !moment(formattedValue).isBefore("1920-01-01") &&
    !moment(formattedValue, format).isAfter(moment().startOf("day")) &&
    valid
  );
};
export const validateAddPatient = (name: string, value: string): boolean => {
  switch (name) {
    case "patientEmail":
    case "directAddress":
    case "electronicDetails": {
      return validateEmail(value);
    }
    case "patientPhone":
    case "number": {
      return validatePhone(value);
    }
    case "ssn": {
      return validateSsn(value);
    }
    case "zipCode":
    case "addressZip":
    case "previousAddressZip": {
      return validateZipCode(value);
    }
    case "patientFirstName":
    case "patientMiddleName":
    case "patientLastName":
    case "middleName":
    case "lastName":
    case "previousMiddleName":
    case "previousLastName":
    case "previousCity":
    case "suffix":
    case "genderOthers":
    case "sexOthers":
    case "previousSuffix":
    case "city": {
      return validateString(value);
    }
    case "firstName":
    case "previousFirstName": {
      return validateFirstName(value);
    }
    case "street":
    case "addressLine1":
    case "addressLine2":
    case "previousAddressLine1":
    case "previousAddressLine2": {
      return validateSentance(value);
    }
    case "patientDOB": {
      return validateDate(value);
    }
  }
};
