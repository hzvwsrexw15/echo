export function queryChatList(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/openai/chatList",
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
        url: "/echo/openai/chatContentList",
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

export function queryTextChatCompletion(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/openai/chatTextCompletion",
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
