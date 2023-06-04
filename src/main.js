import { createApp } from "vue";
import App from "./App.vue";

import { VueClipboard } from "@soerenmartius/vue3-clipboard";

import "./assets/main.css";
import "./assets/markdown.css";
import "ant-design-vue/lib/date-picker/style/index.css";
import "ant-design-vue/lib/tag/style/index.css";
import "ant-design-vue/lib/button/style/index.css";
import "ant-design-vue/lib/input/style/index.css";
import "ant-design-vue/lib/message/style/index.css";
import "ant-design-vue/lib/modal/style/index.css";
import "ant-design-vue/lib/tag/style/index.css";

insertElementToBody(App);

async function insertElementToBody(element) {
  const div = document.createElement("div");
  div.id = "echo-content-root";
  const shadowOpen = div.attachShadow({ mode: "open" });
  document.body.appendChild(div);
  createApp(element).use(VueClipboard).mount(shadowOpen);
  insertStyle(shadowOpen);
}

async function insertStyle(element) {
  const url = chrome.runtime.getURL("scripts/style.css");
  const baseStyle = await fetch(url).then((res) => res.text());
  const cssStyle = document.createElement("style");
  cssStyle.innerHTML = baseStyle;
  element.appendChild(cssStyle);
}
