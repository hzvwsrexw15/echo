<script setup>
import { ref, reactive, onMounted, h, defineProps, nextTick } from "vue";
import { message, Input, Spin } from "ant-design-vue";
import { queryTextChatCompletion } from "../../api/openAI";
import { LoadingOutlined } from "@ant-design/icons-vue";

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "14px",
    color: "#3872e0",
  },
  spin: true,
});

const props = defineProps({
  shortCutList: Array,
  shortCutTops: Array,
});
const icon = chrome.runtime.getURL("images/echo.png");
const style = ref({
  transform: "translate(-631px, 380px)",
});
const config = ref({
  showTool: false,
});
const value = ref("");
const focusNode = ref(null);
const range = ref(null);
const showLoading = ref(false);
const inp = ref(null);

const whiteList = {
  "shimo.im": {
    domain: "shimo.im",
    getSelection: () => {
      try {
        const selection = document.getSelection();
        const fNode = selection.focusNode;

        if (
          document.querySelector(".ql-editor") &&
          document.querySelector(".ql-editor").contains(fNode)
        ) {
          focusNode.value = fNode;
          try {
            const frange = selection.getRangeAt(0);
            range.value = frange;
          } catch (e) {
            console.log("[echo] Get selection range Error: ", e);
          }
        }
      } catch (e) {
        console.log("[echo] Get selections Error: ", e);
      }
    },
  },
  "docs.qq.com": {
    domain: "docs.qq.com",
    getSelection: () => {
      focusNode.value = document.querySelector("#melo-hidden-editor");
    },
  },
};

const handleFoucsNode = () => {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      clearTimeout(t);
      try {
        var p = focusNode.value,
          s = window.getSelection(),
          r = document.createRange();
        r.setStart(p, range.value ? range.value.startOffset : 0);
        r.setEnd(p, range.value ? range.value.startOffset : 0);
        s.removeAllRanges();
        s.addRange(r);
        resolve();
      } catch (e) {
        console.log("[echo] handleFoucsNode Error: ", e);
        resolve(e);
      }
    }, 100);
  });
};

const handleEnter = async () => {
  if (!focusNode.value) {
    return message.error("请在可编辑区域使用");
  }
  showLoading.value = true;
  await handleFoucsNode();
  chrome.runtime.sendMessage(
    {
      type: "get-sse",
      url: "/echo/openai/chatTextCompletion",
      params: {
        content: value.value,
      },
      from: "chatText",
    },
    () => {}
  );
};

const showTool = () => {
  getSelection();
  if (!focusNode.value) {
    return message.error("请在可编辑区域使用");
  }
  showLoading.value = false;
  config.value.showTool = true;
  nextTick(() => {
    inp.value && inp.value.focus();
  });
};

const hideTool = () => {
  config.value.showTool = false;
};

const getSelection = () => {
  try {
    whiteList[window.location.host].getSelection();
  } catch (e) {
    console.log("[echo] Get selections Error: ", e);
  }
};

onMounted(() => {
  // 如果域名在白名单中，则支持快捷键
  if (!whiteList[window.location.host]) {
    return;
  }

  document.addEventListener("keydown", (event) => {
    // command + m
    if ((event.metaKey || event.ctrlKey) && event.key === "m") {
      showTool();
    }
    // esc
    if (event.key === "Escape") {
      hideTool();
    }
  });
  document.addEventListener("selectionchange", (event) => {
    getSelection();
  });
  document
    .querySelector("#echo-content-root")
    .shadowRoot.addEventListener("mouseup", (event) => {
      event.stopPropagation();
    });
  document
    .querySelector("#echo-content-root")
    .shadowRoot.addEventListener("mouseup", (event) => {
      event.stopPropagation();
    });
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { from, text, finish_reason } = request || {};
    if (from !== "chatText") return;
    if (text) {
      if (focusNode.value) {
        document.execCommand("insertText", false, `${text}`);
      }
    }
    if (finish_reason === "stop") {
      document.execCommand("insertBrOnReturn", false, "\n");
      showLoading.value = false;
      value.value = "";
      hideTool();
    }
    sendResponse(true);
    return true;
  });
});
</script>
<template>
  <div
    id="echo-float-text-btn"
    class="float-shortcut-btn-wrap"
    :data-show="config.showTool"
    :style="style"
    v-show="config.showTool"
  >
    <div class="float-shortcut-btn show-menu">
      <div class="inner">
        <span class="left">
          <span class="logo-btn">
            <img
              :src="icon"
              class="logo-img"
              style="width: 16px; height: 16px; border-radius: 4px"
              @click="hideTool"
            />
          </span>
          <span class="action-btn-box" v-show="!showLoading">
            <Input
              placeholder="输入内容"
              v-model:value="value"
              @pressEnter="handleEnter"
              class="echo-input"
              ref="inp"
            ></Input>
          </span>
          <span
            class="action-btn-box"
            style="margin-left: 5px"
            v-show="showLoading"
          >
            <Spin :indicator="indicator" />
            <span
              style="color: #ccc; flex: 1; font-size: 12px; margin-left: 5px"
              >内容获取中...</span
            >
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.float-shortcut-btn-wrap {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  user-select: text;
  text-align: left;
  font-weight: 400;
  transition: none;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
}
.float-shortcut-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(50%);
}
.float-shortcut-btn .inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 0;
  border: 1px solid #e5e8eb;
  background: white;
  box-shadow: 0 8px 16px #919eab29;
  gap: 0px;
}
.float-shortcut-btn .inner .left,
.float-shortcut-btn .inner .left .action-btn-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 200px;
}
.float-shortcut-btn .logo-btn {
  font-size: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #101010e6;
  border: none;
  font-weight: 400;
  white-space: nowrap;
  font-size: 13px;
  background: #ffffff;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 5px;
  border-radius: 5px 0 0 5px;
  margin-right: -1px;
}
.logo-img {
  -webkit-user-drag: none;
}
.echo-input {
  border: none !important;
  box-shadow: none !important;
}
</style>
