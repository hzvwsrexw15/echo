<script setup>
import { ref } from "vue";
import { defineEmits } from "vue";
const emit = defineEmits();
const icon = chrome.runtime.getURL("images/echo.png");
const hover = ref(false);
const handleClick = () => {
  emit("click");
};
</script>
<template>
  <div
    class="sidebar-entry-btn sidebar-entry-btn-right"
    :class="{
      'sidebar-entry-btn-hovered': hover,
    }"
    data-id="0"
    style="bottom: 58.4673px; display: flex"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="handleClick"
  >
    <img
      :src="icon"
      class="logo-img"
      style="width: 24px; height: 24px; border-radius: 4px"
    />
    <span class="shortcut">⌘M</span>
  </div>
</template>
<style scoped>
.sidebar-entry-btn {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  user-select: text;
  text-align: left;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: left;
  gap: 6px;
  bottom: 100px;
  border: 1px solid #e6eaf2;
  box-shadow: 0 5px 25px #0000000a, 0 3.2px 12px #00000014;
  background-color: #fff;
  height: 40px;
  padding: 0 8px;
  border-radius: 32px;
  transition: all 0.2s ease-in-out, bottom 0s;
  transform: translateX(128px);
}
.sidebar-entry-btn-right {
  right: 0;
  padding-right: 100px;
}
.sidebar-entry-btn-hovered {
  border-color: #ffffff40;
  background-color: #3872e0;
  transform: translateX(88px);
}
.logo-img {
  -webkit-user-drag: none;
}
.sidebar-entry-btn .shortcut {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}
.sidebar-entry-btn .close-wrapper {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  position: absolute;
  top: -8px;
  background: rgba(103, 103, 103, 0.7);
  display: flex;
  color: #fff;
  transition: all 0.2s ease-in-out;
}
.sidebar-entry-btn-right .close-wrapper {
  left: 0;
}
</style>
