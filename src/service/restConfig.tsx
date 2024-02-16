export function getImagesByFileUploadId({ fileName }: { fileName: string }): Promise<Blob> {
    const authHeader = localStorage.getItem("access_token");
    const url = import.meta.env.VITE_POSTGRAPHILE_BASEURL + "/" + fileName;
    return new Promise((res) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.setRequestHeader("authorization", "Bearer " + authHeader);
      xhr.setRequestHeader("auth-strategy", "next");
      xhr.setRequestHeader("auth-cookie", "1");
      xhr.setRequestHeader("appid", "contact-orchestrator");
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          res(xhr.response);
        }
      };
      xhr.send(null);
    });
  }
  
  const RestConfig = {
    getImagesByFileUploadId,
  };
  
  export default RestConfig;
  