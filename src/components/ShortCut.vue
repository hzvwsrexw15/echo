<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import ShortCutItem from "./ShortCutItem.vue";
import Maps from "./icons/map";

const props = defineProps({
  shortCutList: Array,
  shortCutTops: Array,
});
const emit = defineEmits();
const show = ref(false);
const showMenu = ref(false);
const icon = chrome.runtime.getURL("images/echo.png");
const selectedText = ref("");
const selectioning = ref(false);
const selectionRect = ref({});
const style = ref({
  transform: "translate(-631px, 380px)",
});
const shortcutIsTop = ref(false);
const form = ref({
  name: "",
  icon: "",
});

const handleShowMenu = () => {
  showMenu.value = !showMenu.value;
};
const handleClickItem = (item) => {
  emit("shortCutClick", item, selectedText.value);
};
const handleAddShortCut = () => {
  emit("addShortCut");
};
const handleEdit = (item) => {
  emit("editShortCut", item);
};
const handleTopped = (item) => {
  emit("toppedShortCut", item);
};
onMounted(() => {
  document.addEventListener("mouseup", () => {
    if (selectioning.value) {
      selectioning.value = false;
      if (selectedText.value) {
        const { left, top, width } = selectionRect.value;
        if (left && top) {
          style.value = {
            transform: `translate(-${window.innerWidth - left - width / 2}px, ${
              top + 30
            }px)`,
          };
        }
        if (top < window.innerHeight / 2) {
          shortcutIsTop.value = false;
        } else {
          shortcutIsTop.value = true;
        }
        show.value = true;
      }
      if (!selectedText.value && show.value) {
        show.value = false;
        showMenu.value = false;
      }
    }
  });
  document
    .querySelector("#echo-content-root")
    .shadowRoot.addEventListener("mouseup", (event) => {
      event.stopPropagation();
    });
  document.addEventListener("selectionchange", (event) => {
    const selection = document.getSelection();
    const text = selection.toString();
    const oRange = selection.getRangeAt(0); //get the text range
    const oRect = oRange.getBoundingClientRect();
    selectionRect.value = oRect;
    selectioning.value = true;
    selectedText.value = text;
    emit("selection", selectionRect.value, selectedText.value);
  });
});
</script>
<template>
  <div
    v-if="show"
    id="echo-float-shortcut-btn"
    class="float-shortcut-btn-wrap"
    :style="style"
  >
    <div
      class="float-shortcut-btn show-menu"
      :class="{ 'menu-on-top': shortcutIsTop }"
    >
      <div class="inner">
        <span class="left">
          <span class="logo-btn">
            <img
              :src="icon"
              class="logo-img"
              style="width: 16px; height: 16px; border-radius: 4px"
            />
          </span>
          <span class="action-btn-box">
            <div
              class="btn echo-btn action-btn primary-outline-button"
              v-for="(item, index) in shortCutTops"
              @click="handleClickItem(item)"
              :key="index"
            >
              <component :is="Maps[item.icon]" :width="14" :height="14" />
              {{ item.name }}
            </div>
          </span>
        </span>
        <span class="more" @click="handleShowMenu">
          <svg
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 32 32"
            style="min-width: 12px; min-height: 12px"
          >
            <g>
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="3"
                stroke="currentColor"
                d="M26.666 10.667 16 21.333 5.333 10.667"
                data-follow-stroke="#595959"
              ></path>
            </g>
          </svg>
        </span>
      </div>
      <div class="action-menu" v-show="showMenu">
        <div class="menu-inner">
          <div class="user-prompt">
            <div class="header">
              <span class="title">快捷指令</span>
              <span class="control" @click="handleAddShortCut">
                <svg
                  class="icon"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 17 16"
                  style="min-width: 18px; min-height: 18px"
                >
                  <g>
                    <path
                      data-follow-stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="1.2"
                      stroke="#3872e0"
                      d="M8.5 14.667a6.667 6.667 0 1 0 0-13.334 6.667 6.667 0 0 0 0 13.334Z"
                    ></path>
                    <path
                      data-follow-stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-width="1.2"
                      stroke="#3872e0"
                      d="M8.5 5.333v5.334M5.833 8h5.334"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
            <div class="content">
              <div class="prompt-menu">
                <ShortCutItem
                  :icon="Maps[item.icon]"
                  :name="item.name"
                  :topped="item.topped"
                  :item="item"
                  @click="handleClickItem(item)"
                  @edit="handleEdit(item)"
                  @topped="handleTopped(item)"
                  v-for="(item, index) in shortCutList"
                  :key="index"
                ></ShortCutItem>
              </div>
            </div>
          </div>
        </div>
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
.echo-btn {
  box-sizing: border-box;
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  white-space: nowrap;
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
.float-shortcut-btn .action-btn {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #101010e6;
  padding: 0 5px;
  height: 28px;
  border: none;
  font-weight: 400;
  white-space: nowrap;
  font-size: 13px;
  border-radius: 5px;
  background: #ffffff;
  gap: 2px;
}
.float-shortcut-btn .action-btn:hover {
  background-color: #3366ff14;
}

.float-shortcut-btn .inner .action-btn {
  height: 28px;
  position: relative;
  padding: 0 8px;
  border-radius: 0;
}
.float-shortcut-btn .inner .more {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #101010e6;
  padding: 0 5px;
  border: none;
  font-weight: 400;
  white-space: nowrap;
  font-size: 13px;
  background: #ffffff;
  height: 28px;
  border-radius: 0 5px 5px 0;
  align-items: center;
  display: flex;
  margin-left: -1px;
}
.float-shortcut-btn.show-menu .action-menu {
  transform: scaleY(1);
  opacity: 1;
  pointer-events: all;
}
.float-shortcut-btn .action-menu {
  transition: all 0.05s ease;
  transform-origin: 50% 0;
  transform: scaleY(0.5);
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 100%;
  right: -5px;
  padding: 2px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.float-shortcut-btn.menu-on-top .action-menu {
  bottom: 30px;
  top: auto;
  transform-origin: 50% 100%;
}
.float-shortcut-btn .action-menu .menu-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.user-prompt {
  position: relative;
  min-width: 165px;
  max-width: 220px;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background: #fff;
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 5px;
  z-index: 900;
  border: 1px solid #e5e8eb;
}
.user-prompt .header {
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  padding: 0 5px 0 8px;
  color: #637381;
  display: flex;
  font-size: 13px;
  user-select: none;
}
.user-prompt .header .title {
  flex: 1;
}
.user-prompt .header .control {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.user-prompt .header .icon {
  opacity: 0.7;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.user-prompt .content {
  flex: 1;
  min-height: 0;
  display: flex;
}
.prompt-menu {
  width: 100%;
  position: relative;
  padding-bottom: 5px;
  overflow-y: overlay !important;
}
.float-shortcut-btn .action-menu .menu-inner .footer {
  margin-top: -5px;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.float-shortcut-btn .action-menu .menu-inner .disable-button {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 8px 5px 8px 8px;
  gap: 4px;
  z-index: 1;
}
.float-shortcut-btn .action-menu .menu-inner .disable-button .text {
  flex: 1;
  white-space: nowrap;
}
.float-shortcut-btn .action-menu .menu-inner .disable-button .arrow {
  opacity: 0.6;
}
</style>
