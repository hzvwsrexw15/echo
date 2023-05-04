<script setup>
import { ref, reactive, defineEmits, onMounted, h } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { message, Spin, Modal } from "ant-design-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { IClose, IPlus, IHistory, ISend, IEdit, ISet, IExit } from "./icons";
import { fetchShortCutDetail } from "../api/shortCut";
import {
  queryChatList,
  queryChatContentList,
  queryChatCompletion,
} from "../api/openAI";

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "14px",
    color: "#3872e0",
  },
  spin: true,
});

const emit = defineEmits();
const icon = chrome.runtime.getURL("images/echo.png");

const historyVisible = ref(false);
const historys = ref([]);
const curChat = ref(null);
const chatContentList = ref([]);
const textareaContent = ref("");
const showLoading = ref(false);
const fetchChatList = async () => {
  try {
    const response = await queryChatList();
    historys.value = response;
    if (response && response.length) {
      curChat.value = response[0];
    }
  } catch (e) {
    message.error(e.message);
  }
};
const fetchChatContentList = async () => {
  if (!curChat.value) return;
  try {
    const response = await queryChatContentList({
      chat_id: curChat.value._id,
    });
    chatContentList.value = response || [];
    chatContentList.value.reverse();
  } catch (e) {
    message.error(e.message);
  }
};
const handleClose = () => {
  emit("close");
};
const showHistoryDrawer = () => {
  historyVisible.value = true;
};
const handleChangeChat = (item) => {
  curChat.value = item;
  historyVisible.value = false;
  fetchChatContentList();
};
const handleEnter = async () => {
  const content = textareaContent.value;
  if (!content) {
    return message.error("请输入内容");
  }
  chatContentList.value.push({
    chat_id: curChat.value._id,
    content,
    gmt_create: Date.now(),
    gmt_update: Date.now(),
    item_type: "intent",
    userid: curChat.value.userid,
    _id: Date.now(),
  });
  textareaContent.value = "";
  document
    .querySelector("#echo-content-root")
    .shadowRoot.querySelector(".chat-container").scrollTop = 9999;
  showLoading.value = true;

  try {
    let prompt = "";
    if (curChat.value.short_cut_id) {
      const shortCut = await fetchShortCutDetail({
        id: curChat.value.short_cut_id,
      });
      prompt = shortCut.prompt || "";
    }

    const response = await queryChatCompletion({
      prompt,
      content,
      shortCutId: curChat.value.short_cut_id,
    });
    chatContentList.value.push({
      chat_id: curChat.value._id,
      content: response,
      gmt_create: Date.now(),
      gmt_update: Date.now(),
      item_type: "reply",
      userid: curChat.value.userid,
      _id: Date.now(),
    });
    showLoading.value = false;
    await initData();
  } catch (e) {
    message.error(e.message);
    showLoading.value = false;
  }
};
const handleUpdateApiKey = () => {
  emit("updateApiKey");
};
const handleLogout = () => {
  Modal.confirm({
    title: "确认退出登录？",
    content: "退出登录后，将无法使用Echo",
    okText: "确认",
    cancelText: "取消",
    zIndex: 2147483650,
    onOk() {
      emit("logout");
    },
  });
};
const handleNewChat = () => {
  curChat.value = {
    gmt_create: Date.now(),
    gmt_update: Date.now(),
    last_message: "",
    short_cut_id: "",
    title: "新会话",
    userid: "",
    _id: Date.now(),
  };
  chatContentList.value = [];
};
const initData = async () => {
  await fetchChatList();
  await fetchChatContentList();
};
onMounted(async () => {
  await initData();
});
</script>
<template>
  <div
    id="echo-main-window-root"
    class="main-window mode-sidebar"
    style="width: 420px; height: 100vh"
  >
    <header class="header">
      <div class="header-left">
        <a class="logo-wrapper" target="_blank" rel="noreferrer"
          ><img
            :src="icon"
            class="logo logo-img"
            style="width: 22px; height: 22px; border-radius: 4px"
          /><span class="title"
            >Echo
            {{ `${curChat && curChat.title ? "-" + curChat.title : ""}` }}</span
          ></a
        >
      </div>
      <div class="header-center"></div>
      <div class="header-right">
        <div class="operation-item" @click="handleUpdateApiKey">
          <ISet></ISet>
        </div>
        <div class="operation-item" @click="handleLogout">
          <IExit></IExit>
        </div>
        <div class="operation-item" @click="handleClose">
          <IClose :width="16" :height="16"></IClose>
        </div>
      </div>
    </header>
    <div class="tabs-wrapper">
      <div class="main-window-tabs">
        <div class="tab-item tab-item-active">
          <div>聊天</div>
        </div>
        <div class="tab-active-bar" style="left: -1px; width: 32px"></div>
      </div>
    </div>
    <div class="chat-wrapper" style="display: flex">
      <div class="chat chat_light">
        <div class="chat-box">
          <div class="wrapper">
            <div class="chat-container" style="padding-bottom: 194px">
              <template v-for="item in chatContentList" :key="item._id">
                <div
                  class="chat-item chat-question"
                  v-if="item.item_type === 'intent'"
                >
                  <div class="feedback message-content-wrap">
                    <div class="chat-content">
                      <p>
                        {{ item.content }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="chat-item chat-reply" v-else>
                  <div class="feedback message-content-wrap">
                    <div class="chat-content markdown-body gpt-markdown">
                      <div class="markdown __markdown light">
                        <p>
                          {{ item.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="chat-item chat-reply" v-if="showLoading">
                <div class="feedback message-content-wrap">
                  <div class="chat-content markdown-body gpt-markdown">
                    <div class="markdown __markdown light">
                      <Spin :indicator="indicator" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="input-panel">
            <div class="toolbar">
              <div class="lt">
                <div
                  class="btn echo-btn toolbar-btn primary-button small-button"
                  style="font-weight: normal"
                  @click="handleNewChat"
                >
                  <IPlus :width="14" :height="14"></IPlus><span>新会话</span>
                </div>
                <div
                  class="btn echo-btn toolbar-btn outline primary-outline-button small-button"
                  style="font-weight: normal"
                  @click="showHistoryDrawer"
                >
                  <IHistory width="15" height="15"></IHistory>
                  <span>会话记录</span>
                </div>
              </div>
            </div>
            <div class="input-box">
              <div class="input">
                <div class="input-container">
                  <div class="input-msg-content">
                    <div class="textarea">
                      <div
                        class="mirror-node"
                        style="max-height: 100px; min-height: 32px"
                      >
                        <span></span>
                      </div>
                      <textarea
                        placeholder="问我任何问题...(ctrl+enter发送)"
                        @keypress.enter.ctrl="handleEnter"
                        v-model="textareaContent"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="input-toolbar">
                  <div class="input-msg-btn send" @click="handleEnter">
                    <ISend width="16" height="16"></ISend>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="drawer"
      :class="{ show: historyVisible }"
      style="height: 80%; max-height: 680px"
    >
      <div class="drawer-header">
        <div class="drawer-title">会话历史记录</div>
        <IClose
          class="drawer-close"
          width="24"
          height="24"
          @click="historyVisible = false"
        ></IClose>
      </div>
      <div class="drawer-body">
        <div class="conv-history-drawer">
          <div class="conv-list">
            <div>
              <div class="conv-item-wrapper">
                <div
                  class="conv-item"
                  v-for="item in historys"
                  :key="item._id"
                  @click="handleChangeChat(item)"
                >
                  <div class="conv-item-header">
                    <span class="title"
                      ><span class="title-text"
                        ><span class="">{{ item.title }}</span></span
                      ><span class="edit">
                        <IEdit width="16" height="16"></IEdit> </span></span
                    ><span class="date">{{
                      dayjs(item.gmt_update).toNow()
                    }}</span>
                  </div>
                  <div class="conv-item-content">
                    <span class="conv-item-content-text">{{
                      item.last_message
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-mask" v-show="historyVisible">
      <div class="drawer-close-area" @click="historyVisible = false"></div>
    </div>
  </div>
</template>
<style scoped>
.main-window {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  user-select: text;
  text-align: left;
  font-weight: 400;
  position: fixed;
  background: #ffffff;
  border: 1px solid #e5e8eb;
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 5;
  overflow: hidden;
  font-size: 14px;
  line-height: normal;
}
.main-window.mode-sidebar {
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 0;
  border-top: none;
  border-bottom: none;
}
.main-window .header {
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  border-bottom: 1px solid #f2f2f2;
  padding: 0 16px;
  user-select: none;
}
.main-window .header .header-left {
  display: flex;
  align-items: center;
  height: 22px;
}
.main-window .header .header-left .logo-wrapper {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  text-decoration: none;
  color: #3872e0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.logo-img {
  -webkit-user-drag: none;
}
.main-window .header .header-left .logo-wrapper .logo {
  margin-right: 8px;
  margin-top: -2px;
  margin-left: -2px;
}
.main-window .header .header-left .logo-wrapper .title {
  font-weight: 600;
  font-size: 16px;
  color: #000;
}
.main-window .header .header-center {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.header-right {
  user-select: text;
  display: flex;
  align-items: center;
  height: 22px;
  gap: 12px;
}
.header-right .operation-item {
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #838ba7;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}
.main-window .tabs-wrapper {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  box-shadow: 0 4px 4px -2px #0000000d;
  height: 39px;
  min-height: 39px;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 16px;
  position: relative;
}
.main-window-tabs {
  position: relative;
  display: flex;
  align-items: center;
  gap: 28px;
}
.main-window-tabs .tab-item {
  font-weight: 500;
  font-size: 15px;
  color: #637381;
  display: flex;
  align-items: center;
  height: 39px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.main-window-tabs .tab-item-active {
  color: #212b36;
}
.main-window-tabs .tab-active-bar {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #3872e0;
  transition: left 0.32s;
}
.chat-wrapper {
  visibility: visible;
  position: relative;
  height: 100%;
}
.chat {
  visibility: visible;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.chat .chat-box {
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.chat .chat-box .wrapper {
  height: 100%;
  position: relative;
  box-sizing: border-box;
}
.chat .chat-box .wrapper .chat-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible auto;
  box-sizing: border-box;
  max-height: 100%;
  width: 100%;
  height: calc(100vh - 235px);
  padding: 16px 13px 20px 16px;
  scrollbar-gutter: stable;
  font-size: 14px;
}
.chat .chat-box .wrapper .chat-container .chat-item {
  margin-bottom: 16px;
  position: relative;
}
.chat .chat-box .wrapper .chat-container .chat-question {
  text-align: right;
}
.feedback {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.chat .chat-box .wrapper .chat-container .chat-item .chat-content {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;
  box-sizing: border-box;
  padding: 8px 12px;
  max-width: 100%;
}
.chat .chat-box .wrapper .chat-container .message-content-wrap .chat-content {
  transition: box-shadow 0.1s ease;
}
.chat .chat-box .wrapper .chat-container .chat-question .chat-content {
  border-radius: 8px 8px 0;
  background: #6e819c;
  color: #fff;
  text-align: left;
}
.chat .chat-box .wrapper .chat-container .chat-item .chat-content p {
  margin: 0;
  white-space: pre-wrap;
}
.chat .chat-box .wrapper .chat-container .chat-question .chat-content p {
  white-space: pre-wrap;
}
.chat .chat-box .wrapper .chat-container .chat-reply {
  text-align: left;
}
.chat .chat-box .wrapper .chat-container .chat-reply .chat-content {
  border-radius: 8px 8px 8px 0;
  background: #f6f8fa;
  color: #000;
}
.chat .chat-container .chat-reply .chat-content.markdown-body.gpt-markdown {
  font-size: 15px;
  line-height: 1.6;
}
.chat .chat-box .input-panel {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  z-index: 501;
  background: #f4f6f8;
  border-top: 1px solid rgba(145, 158, 171, 0.05);
}
.chat .chat-box .input-panel .toolbar {
  height: 44px;
  display: flex;
  align-items: center;
  position: relative;
}
.chat .chat-box .input-panel .toolbar .lt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}
.echo-btn {
  box-sizing: border-box;
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  white-space: nowrap;
}
.primary-button.btn {
  background: #3872e0;
  border: 1px solid #3872e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  height: 36px;
  font-weight: 700;
  font-size: 14px;
  justify-content: center;
  color: #fff;
  line-height: 24px;
}
.echo-btn.small-button {
  display: flex;
  align-items: center;
  height: 24px;
  font-size: 12px;
  padding: 0 8px;
  font-weight: 400;
}
.chat .chat-box .input-panel .toolbar .lt .toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  height: 26px;
  padding: 0 6px;
  border-radius: 4px;
}
.primary-outline-button.btn {
  background: #ffffff;
  border: 1px solid rgba(56, 114, 224, 0.48);
  border-radius: 6px;
  align-items: center;
  height: 36px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #3872e0;
  line-height: 24px;
}
.chat .input-panel .toolbar .lt .toolbar-btn.outline {
  border: 1px solid rgba(56, 114, 224, 0.48);
}
.chat .chat-box .input-panel .input-box {
  width: 100%;
  position: relative;
  padding-bottom: 16px;
}
.chat .chat-box .input-panel .input-box .input {
  width: 100%;
  min-height: 78px;
  background: white;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.chat .chat-box .input-panel .input-box .input-container {
  flex: 1;
  display: flex;
  margin-bottom: 5px;
  padding-top: 7px;
}
.chat .input-container .input-msg-content {
  flex: 1;
  position: relative;
}
.textarea {
  visibility: visible;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  font-family: Courier New, Courier, monospace;
}
.textarea .mirror-node {
  width: 100%;
  min-height: 32px;
  pointer-events: none;
  box-sizing: border-box;
  padding: 2px;
  visibility: hidden;
}
.textarea textarea {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  font-size: 14px;
  overflow: hidden auto;
  box-shadow: none;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  outline: none;
}
.input-panel .input-box .input .input-toolbar {
  height: 24px;
  display: flex;
  user-select: none;
  justify-content: end;
}

.input-toolbar .input-word-limit {
  flex: 1;
  line-height: 24px;
  font-size: 12px;
  color: #737373;
  visibility: hidden;
}
.input-panel .input-box .input .input-toolbar .input-msg-btn {
  width: 30px;
  height: 30px;
  font-size: 18px;
  color: #737373;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  position: relative;
  right: -6px;
  top: -2px;
}
.input-box .input .input-toolbar .input-msg-btn.send {
  opacity: 0.8;
}
.chat .input .input-toolbar .input-msg-btn:hover {
  background: #ededef;
}
.drawer-container {
  height: 100%;
  width: 100%;
  position: absolute;
}
.drawer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -6px 20px -4px #919eab26;
  filter: drop-shadow(0px 0px 2px rgba(145, 158, 171, 0.2));
  z-index: 802;
  transition: transform 0.2s ease-in-out;
  transform: translateY(150%);
}
.drawer.show {
  transform: translateY(0);
}
.drawer .drawer-header {
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
}
.drawer .drawer-header .drawer-title {
  font-size: 16px;
  color: #0d1117;
  font-weight: 600;
}
.drawer .drawer-header .drawer-close {
  opacity: 0.45;
  position: absolute;
  right: 12px;
  top: 16px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.drawer .drawer-body {
  flex: 1;
  min-height: 0px;
  position: relative;
  overflow-y: overlay !important;
}
.conv-history-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.conv-history-drawer .conv-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0px;
  overflow-y: overlay !important;
}
.conv-history-drawer .conv-list .conv-item-wrapper {
  padding: 0 16px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.conv-history-drawer .conv-list .conv-item {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.conv-history-drawer .conv-item .conv-item-header {
  display: flex;
  align-items: center;
  height: 18px;
  min-height: 18px;
  justify-content: space-between;
  gap: 8px;
}
.conv-history-drawer .conv-item .conv-item-header .title {
  color: #0d1117;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;
}
.conv-history-drawer .conv-item .conv-item-header .title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.conv-history-drawer .conv-item-header .title .edit {
  opacity: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  width: 16px;
  height: 16px;
  margin-left: 5px;
  color: #a6a6a6;
}
.conv-history-drawer .conv-item-header .date {
  font-weight: 400;
  font-size: 13px;
  color: #00000040;
}
.conv-history-drawer .conv-item-content {
  display: flex;
  align-items: center;
  line-height: 16px;
  justify-content: space-between;
  gap: 8px;
  color: #595959;
}
.conv-history-drawer .conv-item-content-text {
  font-weight: 500;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.drawer-mask {
  z-index: 801;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.drawer-close-area {
  z-index: 800;
  position: absolute;
  inset: 10px;
  background-color: transparent;
}
</style>
