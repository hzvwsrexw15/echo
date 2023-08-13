export function queryModelList() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/embedding/modelList",
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

export function queryChatList(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/embedding/chatList",
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

export function queryChatContentList(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/embedding/chatContentList",
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
