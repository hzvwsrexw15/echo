export function fetchUserInfo() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "get-user-data",
      },
      (response) => {
        if (response && !response.status) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }
    );
  });
}

export function fetchLogin(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "user-login",
        params,
      },
      (response) => {
        if (!response.status) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }
    );
  });
}

export function fetchRegister(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/user/register",
        params,
      },
      (response) => {
        if (response && !response.status) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }
    );
  });
}

export function fetchSendSms(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/user/sendSms",
        params,
      },
      (response) => {
        if (response && !response.status) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }
    );
  });
}

export function queryAppVersion(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/checkVersion",
        params,
      },
      (response) => {
        if (!response.status) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }
    );
  });
}
