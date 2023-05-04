export function fetchAddShortCut(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/shortcut/add",
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

export function fetchShortCutList() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/shortcut/list",
        params: {},
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

export function fetchShortCutDetail(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/shortcut/detail",
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

export function fetchUpdateShortCut(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/shortcut/update",
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
