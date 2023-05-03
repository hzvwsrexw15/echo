import { createApp } from "vue";
import App from "./App.vue";
import "ant-design-vue/lib/date-picker/style/css";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/message/style/css";
import "ant-design-vue/lib/modal/style/css";

insertElementToBody(App);

async function insertElementToBody(element) {
  const div = document.createElement("div");
  div.id = "echo-content-root";
  const shadowOpen = div.attachShadow({ mode: "open" });
  document.body.appendChild(div);
  createApp(element).mount(shadowOpen);
  insertStyle(shadowOpen);
}

async function insertStyle(element) {
  const url = chrome.runtime.getURL("scripts/style.css");
  const baseStyle = await fetch(url).then((res) => res.text());
  const cssStyle = document.createElement("style");
  cssStyle.innerHTML = baseStyle;
  element.appendChild(cssStyle);
}
