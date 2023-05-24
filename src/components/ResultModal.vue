<script setup>
import { ref, onMounted, defineEmits, defineProps, h } from "vue";
import { Textarea, Spin, message } from "ant-design-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import {
  IClose,
  IArrowDown,
  ICopy,
  IRefreshRight,
  IUpdate,
  IArrowUp,
  ICheckOutlined,
  ISet,
  IMoreOutlined,
} from "./icons";
import Maps from "./icons/map";

const icon = chrome.runtime.getURL("images/echo.png");
const props = defineProps({
  input: String,
  selectionRect: Object,
  shortCut: Object,
  shortCutList: Array,
});
const curShortCut = ref(props.shortCut);
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "14px",
    color: "#3872e0",
  },
  spin: true,
});
const showLoading = ref(false);
const inputText = ref(props.input || "");
const emit = defineEmits();
const expand = ref(false);
const showMoreOperate = ref(false);
const resultText = ref("");
const frontShortCutList = ref([...props.shortCutList].slice(0, 3));
const otherShortCutList =
  props.shortCutList.length > 4
    ? ref([...props.shortCutList].slice(4, props.shortCutList.length))
    : ref([]);
const style = ref({
  left: `${(window.innerWidth - 500) / 2}px`,
  top: `${(window.innerHeight - 300) / 2}px`,
});
const getScrollTop = () => {
  var scrollPos;
  if (window.pageYOffset) {
    scrollPos = window.pageYOffset;
  } else if (document.compatMode && document.compatMode != "BackCompat") {
    scrollPos = document.documentElement.scrollTop;
  } else if (document.body) {
    scrollPos = document.body.scrollTop;
  }
  return scrollPos;
};
const genContent = () => {
  const { input } = props;
  const { prompt, _id } = curShortCut.value;
  showLoading.value = true;
  resultText.value = "";
  chrome.runtime.sendMessage(
    {
      type: "post-data",
      url: "/echo/openai/chatCompletion",
      params: {
        prompt,
        content: input,
        shortCutId: _id,
      },
    },
    (response) => {
      showLoading.value = false;
      if (!response.status) {
        resultText.value = response.data;
      } else {
        message.error(response.message);
      }
    }
  );
};
const showCopySuccess = ref(false);
const handleCopySuccess = () => {
  showCopySuccess.value = true;
  message.success("复制成功");
  setTimeout(() => {
    showCopySuccess.value = false;
  }, 3000);
};
const handleClose = () => {
  emit("close");
};
const changeShortCut = (item) => {
  curShortCut.value = item;
  genContent();
};
const handleGotoManage = () => {
  chrome.runtime.sendMessage({
    type: "goto-page",
    url: "set.html",
  });
};
onMounted(async () => {
  const { top } = props.selectionRect;
  style.value = {
    left: `${(window.innerWidth - 500) / 2}px`,
    top: `${getScrollTop() + top + 30}px`,
  };
  await genContent();
});
</script>
<template>
  <div id="echo-lite-window" class="lite-window-wrapper">
    <div class="lite-window" :style="style">
      <header class="header">
        <div class="header-left">
          <img
            :src="icon"
            class="logo-img"
            style="width: 22px; height: 22px; border-radius: 4px"
          />
          <span class="title">{{ curShortCut.name }}</span>
        </div>
        <div class="header-right">
          <div class="icon-btn" @click="handleClose">
            <IClose :width="20" :height="20"></IClose>
          </div>
        </div>
      </header>
      <main class="main">
        <div class="action-bar action-bar-lite-window" style="opacity: 1">
          <div class="box">
            <span
              class="tag-button"
              :class="{ 'tag-button-active': curShortCut._id === item._id }"
              style="opacity: 1; pointer-events: auto"
              v-for="(item, index) in frontShortCutList"
              :key="index"
              @click="changeShortCut(item)"
            >
              <component :is="Maps[item.icon]" :width="16" :height="16" />
              <span class="text-wrapper">
                <span class="text">{{ item.name }}</span>
              </span>
            </span>
          </div>
          <div class="echo-popover">
            <span class="trigger-node">
              <div class="more" @click="showMoreOperate = !showMoreOperate">
                <IMoreOutlined :width="16" :height="16" />
              </div>
            </span>
            <div
              class="content content-animate content-animate-bottom"
              :class="{ show: showMoreOperate }"
              style="top: 20px; right: 0px"
            >
              <div class="more-content">
                <div
                  class="more-item"
                  v-for="(item, index) in otherShortCutList"
                  :key="index"
                >
                  <component :is="Maps[item.icon]" :width="16" :height="16" />
                  <span class="more-item-text">{{ item.name }}</span>
                </div>
                <div
                  class="more-item manage manage-border"
                  @click="handleGotoManage"
                >
                  <ISet :width="16" :height="16"></ISet>
                  管理
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="lite-window-input-fold"
          v-if="!expand"
          @click="expand = true"
        >
          <span class="input-text">{{ inputText }}</span>
          <div class="operation-group">
            <span class="operation-item">
              <IArrowDown :width="16" :height="16"></IArrowDown>
            </span>
          </div>
        </div>
        <div class="lite-window-input" v-if="expand">
          <header class="header">
            <h2 class="title">输入</h2>
            <!-- <div class="operation-group">
              <span class="operation-item">
                <ICopy :width="16" :height="16"></ICopy>
              </span>
              <span class="operation-item">
                <IUpdate :width="16" :height="16"></IUpdate>
              </span>
            </div> -->
          </header>
          <span>
            <Textarea
              placeholder="来自您选择的文本，可以在触发任何操作之前对其进行修改"
              v-model:value="inputText"
              :auto-size="{ minRows: 1, maxRows: 5 }"
              class="ant-input content content-preview css ant-input-disabled"
            ></Textarea>
          </span>
          <footer class="footer">
            <div class="operation-group" style="display: flex">
              <span class="operation-item" @click="expand = false">
                <IArrowUp :width="16" :height="16"></IArrowUp>
              </span>
            </div>
          </footer>
        </div>
        <div class="compose-output compose-output-lite-window">
          <div class="title">
            <span class="title-left">
              结果
              <Spin :indicator="indicator" v-if="showLoading" />
            </span>
            <div class="operation-group">
              <span
                title="复制内容"
                class="operation-item"
                v-if="resultText && !showCopySuccess"
                v-clipboard:copy="resultText"
                v-clipboard:success="handleCopySuccess"
              >
                <ICopy :width="16" :height="16"></ICopy>
              </span>
              <span title="已复制！" v-if="showCopySuccess">
                <ICheckOutlined :width="16" :height="16"></ICheckOutlined>
              </span>
              <span class="operation-item" @click="genContent">
                <IRefreshRight
                  class="octicon octicon-sync"
                  :width="16"
                  :height="16"
                ></IRefreshRight>
              </span>
            </div>
          </div>
          <Textarea
            placeholder=""
            v-model:value="resultText"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            disabled
            class="ant-input textarea css"
          ></Textarea>
          <textarea
            tabindex="2"
            v-model="resultText"
            id="myTextarea"
          ></textarea>
        </div>
      </main>
    </div>
    <div class="lite-window-mask"></div>
  </div>
</template>
<style scoped>
#myTextarea {
  width: 1px;
  height: 1px;
  position: fixed;
  bottom: 0;
  right: 0;
  visibility: hidden;
}
:where(.css).ant-input {
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  color: #212b36;
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
}
textarea:where(.css).ant-input {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  line-height: 1.5714285714285714;
  vertical-align: bottom;
  transition: all 0.3s, height 0s;
  resize: vertical;
}
:where(.css).ant-input-disabled,
:where(.css).ant-input[disabled] {
  color: rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.04);
  border-color: #d9d9d9;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 1;
}
:where(.css).ant-input {
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  color: #212b36;
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
}
textarea:where(.css).ant-input {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  line-height: 1.5714285714285714;
  vertical-align: bottom;
  transition: all 0.3s, height 0s;
  resize: vertical;
}
.lite-window-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  user-select: text;
  text-align: left;
  font-weight: 400;
}
.lite-window {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e8eb;
  z-index: 5;
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 12px;
  overflow: hidden;
  font-size: 14px;
  line-height: normal;
  display: flex;
  flex-direction: column;
  overflow-y: overlay !important;
  width: 500px;
  padding: 12px 16px;
  height: auto;
}
.lite-window .header {
  position: relative;
  width: 100%;
  height: 28px;
  margin-bottom: 12px;
  cursor: grab;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.lite-window .header .header-left {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  justify-content: left;
  flex: 1;
  min-width: 0px;
}
.logo-img {
  -webkit-user-drag: none;
}
.lite-window .header .header-left .title {
  font-weight: 600;
  font-size: 16px;
  color: #212b36;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.lite-window .header .header-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.icon-btn {
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #00000040;
}
.lite-window .main {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.action-bar {
  position: relative;
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: right;
}
.action-bar.action-bar-lite-window,
.action-bar.action-bar-lite-window .box {
  justify-content: left;
}
.action-bar .box {
  min-width: 0;
  display: inline-flex;
  flex-flow: wrap;
  height: 24px;
  gap: 10px;
  align-content: flex-start;
  justify-content: right;
  flex: 1;
}
.tag-button {
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  height: 24px;
  min-height: 24px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(56, 114, 224, 0.48);
  border-radius: 4px;
  font-size: 13px;
  color: #3872e0;
  gap: 4px;
  max-width: 150px;
  background: #fff;
}
.tag-button .text-wrapper {
  flex: 1;
  min-width: 0px;
  display: flex;
  flex-direction: column;
}
.tag-button .text-wrapper .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
}
.tag-button-active {
  background: rgba(51, 102, 255, 0.16);
  border: 1px solid rgba(51, 102, 255, 0.16);
  font-weight: 700;
}
.echo-popover {
  position: relative;
  display: inline-flex;
  cursor: default;
}
.echo-popover .trigger-node {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.action-bar .more {
  width: 24px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #3872e0;
}
.echo-popover .content {
  position: absolute;
  z-index: 901;
  bottom: 25px;
  visibility: hidden;
}
.echo-popover .content-animate {
  transform: scaleY(0.5);
  opacity: 0;
  transition: transform 0.08s, visibility 0.08s, opacity 0.08s;
}
.echo-popover .content-animate-bottom {
  transform-origin: 50% 0;
}
.echo-popover .content-animate-bottom.show {
  transform: scaleY(1);
  opacity: 1;
  visibility: visible;
}
.more-content {
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #e5e8eb;
  overflow: hidden;
}
.more-content .more-item {
  width: 150px;
  height: 28px;
  line-height: 28px;
  color: #333;
  padding: 0 5px 0 8px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #fff;
}
.more-content .more-item:hover {
  background-color: #f0f4fc;
}
.more-content .more-item .more-item-text {
  flex: 1;
  min-width: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 13px;
  font-weight: 400;
}
.more-content .more-item.manage {
  height: 32px;
  line-height: 32px;
}
.more-content .more-item.manage-border {
  border-top: 1px solid #e5e8eb;
}
.lite-window-input-fold {
  padding: 8px;
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  font-size: 14px;
  white-space: pre-wrap;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.lite-window-input-fold .input-text {
  flex: 1;
  min-width: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #737373;
}
.operation-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.operation-group .operation-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #828ca6;
}
.lite-window-input {
  padding: 8px;
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  font-size: 14px;
  white-space: pre-wrap;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lite-window-input .header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
}
.lite-window-input .header .title {
  font-size: 14px;
  font-weight: 600;
  color: #00000040;
}
.operation-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.speak-icon-button {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #828ca6;
}
.operation-group .operation-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #828ca6;
}
.lite-window-input .content {
  line-height: 24px;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  border: none;
  box-shadow: unset;
  padding: 0;
  height: auto;
  resize: none;
  border-radius: unset;
}

.lite-window-input .content-preview {
  color: #737373;
  cursor: text;
  background-color: #fff;
}
.lite-window-input .footer {
  display: flex;
  justify-content: right;
}
.operation-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.operation-group .operation-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #828ca6;
}
.compose-output {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.compose-output .title {
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 24px;
  color: #212b36;
  font-weight: 500;
  justify-content: space-between;
}
.compose-output .title-left {
  display: flex;
  gap: 6px;
  align-items: center;
}
.operation-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.operation-group .operation-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #828ca6;
}

.compose-output-lite-window .textarea {
  overflow-y: overlay !important;
  word-wrap: break-word;
  white-space: pre-wrap;
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  box-shadow: unset !important;
  outline: 0;
  font-size: 14px;
  color: #212b36;
  line-height: 1.7;
  padding: 8px;
}
.lite-window-mask {
  z-index: 1;
  position: fixed;
  inset: 0;
  background-color: transparent;
  cursor: default;
}
</style>
