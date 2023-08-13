<script setup>
import { reactive, onMounted } from "vue";
import SideBar from "./components/Sidebar.vue";
import ShortCut from "./components/ShortCut.vue";
import ResultModal from "./components/ResultModal.vue";
import Login from "./components/Login.vue";
import Chat from "./components/Chat/index.vue";
import AddShortCut from "./components/AddShortCut.vue";
import AddApiKey from "./components/AddApiKey.vue";
import { message } from "ant-design-vue";
import { fetchShortCutList, fetchUpdateShortCut } from "./api/shortCut";
import { fetchUserInfo } from "./api/user";
import TextChat from "./pages/TextCaht/index.vue";

const globalState = reactive({
  selectionText: "", // 选中文本
  selectionRect: {}, // 选中区域位置
  resultText: "", // 结果文本
  shortCutList: [], // 快捷键列表
  shortCutTops: [], // 置顶列表
  showResultModel: false, // 展示结果弹窗
  currentShortCut: null, // 当前使用的快捷键
  userInfo: null,
  showLogin: false, // 展示登录
  showChat: false, // 展示聊天
  showShortCutAdd: false,
  curEditShortCut: null,
  showApiKeyAdd: false,
});

const getShortCutList = async () => {
  fetchShortCutList({})
    .then((response) => {
      globalState.shortCutList = [...response];
      globalState.shortCutTops = [...response].filter((item) => {
        return item.topped;
      });
      if (!globalState.shortCutTops.length) {
        globalState.shortCutTops = [...response].slice(0, 2);
      }
    })
    .catch((e) => {
      message.error(e.message);
    });
};

const handleShortCutClick = (item, selectedText) => {
  if (!globalState.userInfo) {
    globalState.showLogin = true;
    return;
  }
  globalState.currentShortCut = item;
  globalState.selectionText = selectedText;
  globalState.showResultModel = true;
};
const handleSelection = (selectionRect, selectedText) => {
  globalState.selectionText = selectedText;
  globalState.selectionRect = selectionRect;
};
const handleLoginSuccess = () => {
  getUserInfo();
  globalState.showLogin = false;
};
const handleAddShortSuccess = () => {
  getShortCutList();
  globalState.showShortCutAdd = false;
  globalState.curEditShortCut = null;
};
const handleEditShortCut = (item) => {
  globalState.curEditShortCut = item;
  globalState.showShortCutAdd = true;
};
const handleToppedShortCut = (item) => {
  fetchUpdateShortCut({
    ...item,
    topped: !item.topped,
    id: item._id,
  })
    .then((response) => {
      getShortCutList();
      if (item.topped) {
        message.success("取消置顶成功");
      } else {
        message.success("置顶成功");
      }
    })
    .catch((e) => {
      message.error(e.message);
    });
};
const getUserInfo = () => {
  fetchUserInfo({})
    .then((response) => {
      globalState.userInfo = response;
      getShortCutList();
    })
    .catch((e) => {
      globalState.showLogin = true;
    });
};
const handleUpdateApiKey = (form) => {
  chrome.runtime.sendMessage(
    {
      type: "post-data",
      url: "/user/updateOpenaiApiKey",
      params: {
        id: globalState.userInfo._id,
        openaiApiKey: form.openaiApiKey,
      },
    },
    (response) => {
      if (!response.status) {
        message.success("更新成功");
        globalState.showApiKeyAdd = false;
        getUserInfo();
      } else {
        message.error(response.message);
      }
    }
  );
};
const handleLogout = () => {
  chrome.runtime.sendMessage(
    {
      type: "user-logout",
      params: {},
    },
    (response) => {
      // 登出成功
      if (!response.status) {
        message.info("退出成功！");
        globalState.showChat = false;
      }
    }
  );
};
onMounted(async () => {
  getUserInfo();
});
</script>

<template>
  <div class="content-root">
    <SideBar @click="globalState.showChat = true"></SideBar>
    <ShortCut
      :shortCutList="globalState.shortCutList"
      :shortCutTops="globalState.shortCutTops"
      @selection="handleSelection"
      @shortCutClick="handleShortCutClick"
      @editShortCut="handleEditShortCut"
      @toppedShortCut="handleToppedShortCut"
      @addShortCut="globalState.showShortCutAdd = true"
    ></ShortCut>
    <ResultModal
      :input="globalState.selectionText"
      :selectionRect="globalState.selectionRect"
      :shortCut="globalState.currentShortCut"
      :shortCutList="globalState.shortCutList"
      @close="globalState.showResultModel = false"
      v-if="globalState.showResultModel"
    ></ResultModal>
    <Login
      v-if="globalState.showLogin"
      @close="globalState.showLogin = false"
      @success="handleLoginSuccess"
    ></Login>
    <Chat
      v-if="globalState.showChat"
      @close="globalState.showChat = false"
      @updateApiKey="globalState.showApiKeyAdd = true"
      @logout="handleLogout"
    ></Chat>
    <AddShortCut
      :shortCut="globalState.curEditShortCut"
      v-if="globalState.showShortCutAdd"
      @close="globalState.showShortCutAdd = false"
      @success="handleAddShortSuccess"
    ></AddShortCut>
    <AddApiKey
      v-if="globalState.showApiKeyAdd"
      @close="globalState.showApiKeyAdd = false"
      @submit="handleUpdateApiKey"
    ></AddApiKey>
    <TextChat></TextChat>
  </div>
</template>

<style scoped>
.content-root {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2147483647;
}
</style>
