<script setup>
import { ref, defineEmits } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { Modal } from "ant-design-vue";
import { IClose, ISet, IExit } from "../icons";

import Chat from "./chat.vue";
import Knowledge from "./Knowledge.vue";

const emit = defineEmits();
const icon = chrome.runtime.getURL("images/echo.png");
const curTab = ref("chat");

const handleClose = () => {
  emit("close");
};

const handleUpdateApiKey = () => {
  chrome.runtime.sendMessage({
    type: "goto-page",
    url: "set.html",
  });
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
const handleChangeTab = (type) => {
  curTab.value = type;
};
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
          /><span class="title">Echo </span></a
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
        <div
          class="tab-item"
          :class="{ 'tab-item-active': curTab === 'chat' }"
          @click="handleChangeTab('chat')"
        >
          <div>聊天</div>
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item-active': curTab === 'knowledge' }"
          @click="handleChangeTab('knowledge')"
        >
          <div>知识库</div>
        </div>
        <div
          class="tab-active-bar"
          :class="{
            'tab-bar-knowledge': curTab === 'knowledge',
            'tab-bar-chat': curTab === 'chat',
          }"
        ></div>
      </div>
    </div>
    <Chat v-if="curTab === 'chat'"></Chat>
    <Knowledge v-if="curTab === 'knowledge'"></Knowledge>
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
.tab-bar-chat {
  left: -1px;
  width: 32px;
}
.tab-bar-knowledge {
  left: 57px;
  width: 45px;
}
</style>
