import "regenerator-runtime/runtime.js";
import { fetchUserInfo, loginUser, post } from "./api";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 用户登录
  if (message.type === "user-login") {
    const { params } = message;
    loginUser({
      ...params,
    })
      .then(async (response) => {
        const txt = await response.text();
        const res = JSON.parse(txt);
        sendResponse(res);
      })
      .catch((e) => {
        sendResponse(e);
      });
  }
  // 用户登出
  if (message.type === "user-logout") {
    post("/user/logout", {})
      .then(async (response) => {
        const txt = await response.text();
        const res = JSON.parse(txt);
        sendResponse(res);
      })
      .catch((e) => {
        sendResponse(e);
      });
  }
  if (message.type === "get-user-data") {
    fetchUserInfo().then(async (res) => {
      try {
        const txt = await res.text();
        const response = JSON.parse(txt);
        sendResponse(response);
      } catch (e) {
        sendResponse(e);
      }
    });
  }
  if (message.type === "post-data") {
    const { url, params } = message;
    post(url, { ...params })
      .then(async (response) => {
        const txt = await response.text();
        const res = JSON.parse(txt);
        sendResponse(res);
      })
      .catch((e) => {
        sendResponse(e);
      });
  }
  if (message.type === "goto-page") {
    const { url } = message;
    chrome.tabs.create({ url: url });
  }
  return true;
});
