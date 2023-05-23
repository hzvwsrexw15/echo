<script setup>
import { ref, onMounted } from "vue";
const icon = chrome.runtime.getURL("images/echo.png");
import { message, Modal } from "ant-design-vue";
import { IPlus, IEdit } from "../../components/icons";
import maps from "../../components/icons/map";
import AddShortCut from "../../components/AddShortCut.vue";
import AddApiKey from "../../components/AddApiKey.vue";
import { fetchShortCutList } from "../../api/shortCut";
import { fetchUserInfo } from "../../api/user";
import templates from "./template";

const showShortCutAdd = ref(false);
const shortCutList = ref([]);
const curEditShortCut = ref(null);
const userInfo = ref(null);
const curtab = ref("shortCut");
const showApiKeyAdd = ref(false);
const getShortCutList = async () => {
  fetchShortCutList({})
    .then((response) => {
      shortCutList.value = [...response];
    })
    .catch((e) => {
      message.error(e.message);
    });
};
const getUserInfo = () => {
  fetchUserInfo({}).then((response) => {
    userInfo.value = response;
  });
};
const handleAddShortCut = () => {
  curEditShortCut.value = null;
  showShortCutAdd.value = true;
};
const handleAddShortSuccess = () => {
  getShortCutList();
  showShortCutAdd.value = false;
};
const handleEditShortCut = (item) => {
  curEditShortCut.value = item;
  showShortCutAdd.value = true;
};
const getApiKey = (key) => {
  return key ? key.slice(0, 5) + "****" + key.slice(-5) : "-";
};
const handleUpdateApiKey = (form) => {
  chrome.runtime.sendMessage(
    {
      type: "post-data",
      url: "/user/updateOpenaiApiKey",
      params: {
        id: userInfo.value._id,
        openaiApiKey: form.openaiApiKey,
      },
    },
    (response) => {
      if (!response.status) {
        message.success("更新成功");
        showApiKeyAdd.value = false;
        getUserInfo();
      } else {
        message.error(response.message);
      }
    }
  );
};
const handleShowTemplateDetail = (item) => {
  Modal.info({
    title: item.name,
    content: item.prompt,
    okText: "确认",
    cancelText: "取消",
    zIndex: 2147483650,
  });
};

onMounted(async () => {
  await getShortCutList();
  await getUserInfo();
});
</script>
<template>
  <div class="content-root">
    <div class="inner">
      <div class="menu-wrapper">
        <div class="logo">
          <img
            :src="icon"
            class="logo-img"
            style="width: 32px; height: 32px; border-radius: 4px"
          /><span class="logo-title" style="font-size: 20px">Echo</span>
        </div>
        <ul class="menu">
          <li
            class="menu-item"
            :class="{ menuItemActive: curtab === 'userInfo' }"
            @click="curtab = 'userInfo'"
          >
            用户信息
          </li>
          <li
            class="menu-item"
            :class="{ menuItemActive: curtab === 'shortCut' }"
            @click="curtab = 'shortCut'"
          >
            快捷指令
          </li>
          <li
            class="menu-item"
            :class="{ menuItemActive: curtab === 'template' }"
            @click="curtab = 'template'"
          >
            提示语模版
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="options-content user-info" v-if="curtab === 'userInfo'">
          <h2 class="content-title">用户信息</h2>
          <div class="config-item">
            <div class="user-info-card">
              <div class="user-card">
                <div class="user-card-right">
                  <div class="user-name">
                    <h4>用户名: {{ userInfo ? userInfo.userName : "-" }}</h4>
                    <a rel="noreferrer" @click="showApiKeyAdd = true"
                      >修改APIKEY</a
                    >
                  </div>
                  <span class="user-email-ucVSRY"
                    >APIKEY:
                    {{
                      getApiKey(userInfo ? userInfo.openaiApiKey || "-" : "-")
                    }}</span
                  >
                </div>
              </div>
            </div>
            <AddApiKey
              v-if="showApiKeyAdd"
              @close="showApiKeyAdd = false"
              @submit="handleUpdateApiKey"
            ></AddApiKey>
          </div>
        </div>
        <div class="options-content quick-action" v-if="curtab === 'shortCut'">
          <h2 class="content-title">快捷指令</h2>
          <div class="quick-action-content">
            <div class="action-list">
              <div
                class="action-item"
                v-for="item in shortCutList"
                :key="item._id"
              >
                <header class="action-item-header">
                  <span class="action-name-wrapper">
                    <component :is="maps[item.icon]" :width="16" :height="16" />
                    <span class="action-name">{{ item.name }}</span>
                  </span>
                  <IEdit
                    class="action-edit"
                    @click="handleEditShortCut(item)"
                  />
                </header>
                <article class="action-item-content" :title="item.prompt">
                  {{ item.prompt }}
                </article>
              </div>
              <div
                class="action-item add-new-action"
                style="display: flex"
                @click="handleAddShortCut"
              >
                <IPlus />
                <article class="action-item-content">添加新操作</article>
              </div>
            </div>
          </div>
          <AddShortCut
            :shortCut="curEditShortCut"
            v-if="showShortCutAdd"
            @close="showShortCutAdd = false"
            @success="handleAddShortSuccess"
          ></AddShortCut>
        </div>
        <div class="options-content quick-action" v-if="curtab === 'template'">
          <h2 class="content-title">提示语模版</h2>
          <div class="quick-action-content">
            <div class="action-list">
              <div
                class="action-item"
                v-for="(item, index) in templates"
                :key="index"
              >
                <header class="action-item-header">
                  <span class="action-name-wrapper">
                    <span class="action-name">{{ item.name }}</span>
                  </span>
                </header>
                <article
                  class="action-item-content"
                  :title="item.prompt"
                  style="cursor: pointer"
                  @click="handleShowTemplateDetail(item)"
                >
                  {{ item.prompt }}
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content-root {
  width: 100%;
  height: 100%;
  padding: 48px 0;
}
.inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 100%;
  align-items: flex-start;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px #919eab29;
  margin: auto;
  max-width: 1148px;
  min-width: 720px;
}
.menu-wrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}
.logo-title {
  display: flex;
  align-items: center;
  height: 18px;
  color: #0d1117;
  font-weight: 500;
}
.menu {
  width: 200px;
  padding: 0 10px 0 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.menu-item {
  padding: 0 16px;
  cursor: pointer;
  width: 200px;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #637381;
  display: flex;
  align-items: center;
}
.menuItemActive {
  background: rgba(56, 114, 224, 0.08);
  color: #3872e0;
}
.content {
  min-width: 0px;
  flex: 1;
  padding: 24px 24px 48px 32px;
  height: 100%;
  border-left: 2px solid #eef1f5;
  overflow-y: overlay !important;
}
.options-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 686px;
  align-items: flex-start;
  gap: 32px;
}
.content-title {
  font-size: 32px;
  line-height: 36px;
  font-weight: 600;
}
.quick-action-content {
  box-shadow: 0 0 2px #919eab33, 0 4px 24px #919eab24;
  padding: 16px;
  border-radius: 8px;
}
.action-list {
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
}
.action-item {
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #e6eaf2;
  gap: 4px;
  border-radius: 4px;
  min-width: 318px;
  width: 318px;
}
.action-item-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 16px;
  color: #000000d9;
  gap: 4px;
}
.action-name-wrapper {
  flex: 1;
  min-width: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.action-name {
  flex: 1;
  min-width: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  display: inline-block;
}
.action-edit {
  cursor: pointer;
  display: none;
}
.action-item:hover .action-edit {
  display: block;
}
.action-item-content {
  line-height: 22px;
  color: #737373;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.add-new-action {
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  background: rgba(56, 114, 224, 0.16);
  border: 1px dashed #3469ce;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #3872e0;
}
.add-new-action .action-item-content {
  color: #3872e0;
  text-align: center;
}
.user-info-card {
  box-shadow: 0 0 2px #919eab33, 0 4px 24px #919eab24;
  padding: 16px;
  border-radius: 8px;
}
.user-card {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.user-card-right {
  flex: 1;
  min-width: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.user-name a {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  text-decoration: none;
  color: #3872e0;
  background-color: transparent;
}
.user-email {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.config-item {
  width: 100%;
}
</style>
