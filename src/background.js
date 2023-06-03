import "regenerator-runtime/runtime.js";
import { fetchUserInfo, loginUser, post, BASE_URL } from "./api";

async function* makeTextFileLineIterator(url, params) {
  const utf8Decoder = new TextDecoder("utf-8");
  let response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    mode: "cors",
  });
  let reader = response.body.getReader();
  let { value: chunk, done: readerDone } = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : "";

  let re = /\r\n|\n|\r/gm;
  let startIndex = 0;

  for (;;) {
    let result = re.exec(chunk);
    if (!result) {
      if (readerDone) {
        break;
      }
      let remainder = chunk.substr(startIndex);
      ({ value: chunk, done: readerDone } = await reader.read());
      chunk =
        remainder + (chunk ? utf8Decoder.decode(chunk, { stream: true }) : "");
      startIndex = re.lastIndex = 0;
      continue;
    }
    yield chunk.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  if (startIndex < chunk.length) {
    // last line didn't end in a newline char
    yield chunk.substr(startIndex);
  }
}

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
  if (message.type === "get-sse") {
    const { url, params, from } = message;
    async function run() {
      const lines = makeTextFileLineIterator(url, params);
      for await (let line of lines) {
        try {
          const text = line.replace("data: ", "");
          const data = JSON.parse(text);
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              if (tabs.length === 0) return;
              chrome.tabs.sendMessage(
                tabs[0].id,
                {
                  from,
                  finish_reason: data.choices[0].finish_reason,
                  text: data.choices[0].delta.content,
                },
                function (response) {}
              );
            }
          );
        } catch (e) {}
      }
      sendResponse(true);
    }
    run();
  }
  return true;
});
