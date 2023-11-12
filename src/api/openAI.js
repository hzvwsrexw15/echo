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

export function createChat() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/openai/createChat",
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
        url: "/echo/openai/chatContentListByPage",
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

export function queryPlugins() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/openai/plugins",
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

export function updateChatAiPlugin(params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "post-data",
        url: "/echo/openai/updateChatAiPlugin",
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
