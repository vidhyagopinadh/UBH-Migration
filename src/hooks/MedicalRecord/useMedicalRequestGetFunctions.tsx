import { useState } from "react";
import { useDataProvider } from "react-admin";
import type {
  ICopyType,
  IGenericType,
  IIssueDescriptionMaster,
  IOrganization,
} from "../../types";
import { perPageMax } from "../../utils/pageConstants";
import type { RequestObtainRecordType } from "../../__generated__/typescript-operations_all";
import { getImagesByFileUploadId } from "../../service/restConfig";
const useMedicalrequestGetFunctions = () => {
  const dataProvider = useDataProvider();
  const [requestData, setRequestData] = useState([]);
  const [impactingsOnPatientsList, setImpactingsOnPatientsList] = useState<
    IGenericType[]
  >([]);
  const [problemsFacedList, setProblemsFacedList] = useState<
    IIssueDescriptionMaster[]
  >([]);
  const [languageList, setLanguageList] = useState<IGenericType[]>([]);
  const [pronounList, setPronounList] = useState<IGenericType[]>([]);
  const [obtainData, setObtainData] = useState<RequestObtainRecordType[]>([]);
  const [priorityList, setPriorityList] = useState<IGenericType[]>([]);
  const [obtainRecordList, setObtainRecordList] = useState<ICopyType[]>([]);
  const [contactData, setContactData] = useState([]);
  const [impactFacedList, setImpactFacedList] = useState<IGenericType[]>([]);
  const [organizationList, setOrganizationList] = useState<IOrganization[]>([]);
  const [assignToList, setAssignedList] = useState<IGenericType[]>([]);
  const [requestTypeList, setRequestTypeList] = useState<IGenericType[]>([]);
  const [institutionList, setInstitutionList] = useState([]);
  const [sourcesNatureList, setSourcesNatureList] = useState<IGenericType[]>(
    [],
  );
  const [relationList, setRelationList] = useState<IGenericType[]>([]);
  const [sensitiveInfoList, setSensitiveInfoList] = useState<IGenericType[]>(
    [],
  );
  const [countryList, setCountryList] = useState<IGenericType[]>([]);
  const [stateList, setStateList] = useState<IGenericType[]>([]);
  const [sexList, setSexList] = useState<IGenericType[]>([]);
  const [genderList, setGenderList] = useState<IGenericType[]>([]);
  const [disorderFileData, setDisorderFileData] = useState<File>();
  const [hipaaFileData, setHipaaFileData] = useState<File>();
  const [medicalFileData, setMedicalFileData] = useState<File>();
  const [personalRepData, setPersonalRepData] = useState<File>();

  const blobToFile = function (blob, name, fieldName) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    if (fieldName === "disorderDisclosureAuthorizationFileId") {
      setDisorderFileData(blob);
    }
    if (fieldName === "hipaaAuthorizationFileId") {
      setHipaaFileData(blob);
    }
    if (fieldName === "medicalRequestFormFileId") {
      setMedicalFileData(blob);
    }
    if (fieldName === "proxyDocument") {
      setPersonalRepData(blob);
    }
  };

  const queryOption = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "value", order: "ASC" },
    filter: {},
  };
  const queryOptionType = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: {},
  };
  function getPronounList(): void {
    dataProvider
      .getList("preferredPronounsMaster", queryOption)
      .then(({ data }) => {
        setPronounList(data);
      })
      .catch((error) => error);
  }
  function getLanguageList(): void {
    const languages = [];
    dataProvider
      .getList("preferredLanguageMasterV1", queryOption)
      .then(({ data }) => {
        data.map((indv) => {
          if (indv.value === "English") languages.push(indv);
        });
        data.map((indv) => {
          if (indv.value !== "English") languages.push(indv);
        });
        setLanguageList(languages);
      })

      .catch((error) => error);
  }
  function getCountryList(): void {
    dataProvider
      .getList("countryMasterV1", queryOption)
      .then(({ data }) => {
        setCountryList(data);
      })
      .catch((error) => error);
  }
  function getStateList(): void {
    dataProvider
      .getList("stateMasterV1", queryOption)
      .then(({ data }) => {
        setStateList(data);
      })
      .catch((error) => error);
  }
  function getSexList(): void {
    dataProvider
      .getList("sexMasterV1", queryOptionType)
      .then(({ data }) => {
        setSexList(data);
      })
      .catch((error) => error);
  }
  function getGenderList() {
    dataProvider
      .getList("genderMasterV1", queryOptionType)
      .then(({ data }) => {
        setGenderList(data);
      })
      .catch((error) => error);
  }

  function getProblemsFaced(requestId: string | number) {
    const queryOptionIssue = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "value", order: "ASC" },
      filter: { requestTypeId: requestId },
    };
    dataProvider
      .getList("issueDescriptionMastersMedical", queryOptionIssue)
      .then(({ data }) => {
        setProblemsFacedList(data);
      })
      .catch((error: any) => error);
  }
  function getReqStat(mounted) {
    dataProvider
      .getList("requestTypeMasters", queryOptionType)
      .then(({ data }) => {
        if (mounted) {
          setRequestTypeList(data);
          getProblemsFaced(Number(data[0].id));
        }
      })
      .catch((error: any) => error);
  }
  function getRequestData(requestId) {
    const queryOptionRequest = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { trackId: requestId },
    };
    dataProvider
      .getList("requests", queryOptionRequest)
      .then(({ data }) => {
        setRequestData(data);
      })
      .catch((error: any) => error);
  }
  function getImpactings(mounted) {
    dataProvider
      .getList("impactSeverityMasters", queryOption)
      .then(({ data }) => {
        if (mounted) {
          setImpactingsOnPatientsList(data);
        }
      })
      .catch((error: any) => error);
  }
  function getImpactFaced(mounted) {
    dataProvider
      .getList("issueImpactMasters", queryOption)
      .then(({ data }) => {
        if (mounted) {
          setImpactFacedList(data);
        }
      })
      .catch((error: any) => error);
  }
  function getContactData(requestId) {
    dataProvider
      .getList("requestContactDetails", {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: { requestId: requestId },
      })
      .then(({ data }) => {
        setContactData(data);
      });
  }

  function getObtainRecordDetails(requestId) {
    dataProvider
      .getList("requestObtainRecordTypes", {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: { requestId: requestId },
      })
      .then(({ data }) => {
        setObtainData(data);
      });
  }
  function getSourcesNature(mounted) {
    dataProvider
      .getList("sourceNatureMasters", queryOption)
      .then(({ data }) => {
        if (mounted) {
          setSourcesNatureList(data);
        }
      })
      .catch((error: any) => error);
  }
  function getOrganization(mounted) {
    const queryOptionOrg = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "organizationName", order: "ASC" },
      filter: {},
    };

    dataProvider
      .getList("organizationMaster", queryOptionOrg)
      .then(({ data }) => {
        if (mounted) {
          const curOrg = [];
          setOrganizationList(data);
          const elseDept = [];
          for (const key in data) {
            if (data[key].parentOrgId === null) {
              curOrg.push(data[key]);
            } else {
              elseDept.push(data[key]);
            }
          }
          setInstitutionList(curOrg);
        }
      })
      .catch((error) => error);
  }
  function getPriorityList(mounted) {
    dataProvider
      .getList("requestPriorityMasters", queryOption)
      .then(({ data }) => {
        if (mounted) {
          setPriorityList(data);
        }
      })
      .catch((error: any) => error);
  }
  const queryCopyOption = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "sortOrder", order: "ASC" },
    filter: {},
  };
  function getObtainRecord(mounted) {
    dataProvider
      .getList("obtainTypeMasterV1s", queryCopyOption)
      .then(({ data }) => {
        if (mounted) {
          setObtainRecordList(data);
        }
      })
      .catch((error: any) => error);
  }
  function getSensitiveInfoOption(mounted) {
    dataProvider
      .getList("substanceDisorderInformationMasterV1", queryOptionType)
      .then(({ data }) => {
        if (mounted) {
          setSensitiveInfoList(data);
        }
      })
      .catch((error: any) => error);
  }
  function getDepartmentHeadsId(organizationId: string | number) {
    const queryDeptHeadOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "firstName", order: "ASC" },
      filter: { depId: organizationId },
    };
    dataProvider
      .getList("departmentHeadMasterDetailsV1", queryDeptHeadOption)
      .then(({ data }) => {
        if (data.length > 0) {
          getAssigned(data);
        }
      })
      .catch((error: any) => error);
  }
  function getAssigned(depHeads) {
    const samArr = [];
    for (const key in depHeads) {
      samArr.push(depHeads[key]);
    }
    setAssignedList(samArr);
  }
  function getFileDetails(fileId, fileName) {
    const queryOptionFile = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: fileId,
      },
    };
    dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
      if (data.length > 0) {
        getImagesByFileUploadId({
          fileName: data[0].fileName,
        }).then((res: Blob) => {
          blobToFile(res, data[0].fileName, fileName);
        });
      }
    });
  }
  const queryOptionRelation = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "value", order: "ASC" },
    filter: { recordStatusId: 1 },
  };
  function getRelationList() {
    dataProvider
      .getList("relatedPersonRelationshipMasters", queryOptionRelation)
      .then(({ data }) => {
        setRelationList(data);
      })
      .catch((error) => error);
  }

  return {
    setAssignedList,
    impactingsOnPatientsList,
    problemsFacedList,
    getImpactFaced,
    getSourcesNature,
    priorityList,
    getContactData,
    obtainRecordList,
    impactFacedList,
    organizationList,
    assignToList,
    requestTypeList,
    institutionList,
    sourcesNatureList,
    sensitiveInfoList,
    getProblemsFaced,
    getReqStat,
    getImpactings,
    getCountryList,
    getStateList,
    getSexList,
    countryList,
    sexList,
    genderList,
    stateList,
    getGenderList,
    getOrganization,
    getPriorityList,
    getObtainRecord,
    getFileDetails,
    getSensitiveInfoOption,
    getDepartmentHeadsId,
    getAssigned,
    getRequestData,
    requestData,
    obtainData,
    getObtainRecordDetails,
    contactData,
    disorderFileData,
    hipaaFileData,
    medicalFileData,
    personalRepData,
    getPronounList,
    getLanguageList,
    pronounList,
    languageList,
    relationList,
    getRelationList,
  };
};

export default useMedicalrequestGetFunctions;
