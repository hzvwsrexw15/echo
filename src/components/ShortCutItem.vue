<script setup>
import { defineEmits, defineProps } from "vue";
import { IMenu, IEdit, ITag, ITagFilled } from "./icons";

const props = defineProps({
  icon: Object,
  name: String,
  item: Object,
  topped: Boolean,
});
const emit = defineEmits();
const handleClickItem = () => {
  emit("click");
};
const handleEdit = () => {
  emit("edit", props.item);
};
const handleTopped = () => {
  emit("topped", props.item);
};
</script>
<template>
  <div class="item" @click="handleClickItem('zhaiyao')">
    <span class="action-btn">
      <span class="box-drag-handle action-btn dragActionBtn">
        <IMenu width="16" height="16"></IMenu>
      </span>
    </span>
    <span class="label-wrapper">
      <component :is="icon" :width="16" :height="16" />
      <span class="label">{{ name }}</span>
    </span>
    <span class="action-btn auto-hide" @click.stop="handleEdit">
      <IEdit width="16" height="16"></IEdit>
    </span>
    <span class="action-btn pin" v-if="topped" @click.stop="handleTopped">
      <ITagFilled width="16" height="16"></ITagFilled>
    </span>
    <span class="action-btn pin auto-hide" v-else @click.stop="handleTopped">
      <ITag width="16" height="16"></ITag>
    </span>
  </div>
</template>
<style scoped>
.action-btn {
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
.item {
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  padding: 0 5px;
  background: #fff;
  color: #333;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-items: flex-start;
  gap: 2px;
}
.item:hover {
  background-color: #3366ff14;
}
.item .pin {
  width: 16px;
  height: 30px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  margin-left: 2px;
}
.item .action-btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  color: #888;
  background: transparent;
}
.item .dragActionBtn {
  cursor: grab;
}
.item .label-wrapper {
  flex: 1;
  cursor: pointer;
  user-select: none;
  min-width: 0;
  gap: 4px;
  display: flex;
  align-items: center;
}
.item .label-wrapper .label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  flex: 1;
  min-width: 0;
}
.item .action-btn.auto-hide {
  visibility: hidden;
}
.item:hover .action-btn.auto-hide {
  visibility: visible;
}
</style>
