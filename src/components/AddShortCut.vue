<script setup>
import { ref, reactive, defineEmits, defineProps } from "vue";
import { Input, Textarea } from "ant-design-vue";
import { IClose, IMenu, ICode } from "./icons";
import maps from "./icons/map";
import { message } from "ant-design-vue";

const iconList = reactive(Object.keys(maps));
const emit = defineEmits();
const props = defineProps({
  shortCut: Object,
});
const form = reactive({
  name: "",
  icon: "menu",
  prompt: "",
  id: "",
  topped: false,
});
if (props.shortCut) {
  form.name = props.shortCut.name;
  form.icon = props.shortCut.icon;
  form.prompt = props.shortCut.prompt;
  form.topped = props.shortCut.topped;
  form.id = props.shortCut._id;
}
const showIconPicker = ref(false);
const handleShowIconPicker = () => {
  showIconPicker.value = true;
};
const handleSelectIcon = (icon) => {
  form.icon = icon;
  showIconPicker.value = false;
};
const handleColse = () => {
  emit("close");
};
const add = () => {
  chrome.runtime.sendMessage(
    {
      type: "post-data",
      url: "/echo/shortcut/add",
      params: {
        ...form,
      },
    },
    (response) => {
      if (!response.status) {
        emit("success");
        message.success("添加快捷键成功");
      } else {
        message.error(response.message);
      }
    }
  );
};
const update = () => {
  chrome.runtime.sendMessage(
    {
      type: "post-data",
      url: "/echo/shortcut/update",
      params: {
        ...form,
      },
    },
    (response) => {
      if (!response.status) {
        emit("success");
        message.success("修改快捷键成功");
      } else {
        message.error(response.message);
      }
    }
  );
};
const handleSubmit = () => {
  if (!form.name) {
    message.error("请输入名称");
    return;
  }
  if (!form.prompt) {
    message.error("请输入提示词");
    return;
  }
  if (form.id) {
    update();
  } else {
    add();
  }
};
</script>
<template>
  <div class="echo-modal-wrapper black-mask" style="position: fixed">
    <div class="echo-modal" style="width: 420px">
      <div class="close" @click="handleColse">
        <IClose width="20" height="20"></IClose>
      </div>
      <div class="prompt-operation">
        <div class="header">新增快捷键</div>
        <div class="content">
          <div class="item">
            <div class="label">图标</div>
            <div class="echo-popover">
              <span class="trigger-node" @click="handleShowIconPicker"
                ><div class="icon-picker">
                  <component
                    :is="maps[form.icon]"
                    :width="16"
                    :height="16"
                  /></div
              ></span>
              <div
                class="mask"
                style="inset: 0px"
                v-show="showIconPicker"
              ></div>
              <div
                class="content content-animate content-animate-bottom"
                :class="{ show: showIconPicker }"
                style="top: 45px; left: 0px"
              >
                <div class="icons-content">
                  <div class="icons-header">
                    图标<span
                      class="icons-close"
                      @click="showIconPicker = false"
                      ><IClose width="16" height="16"></IClose
                    ></span>
                  </div>
                  <div class="icon-list">
                    <div
                      class="icon"
                      v-for="icon in iconList"
                      :key="icon"
                      @click="handleSelectIcon(icon)"
                    >
                      <component :is="maps[icon]" :width="16" :height="16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="label">名称</div>
            <div class="input">
              <Input
                placeholder="操作的名称"
                v-model:value="form.name"
                class="input-overwrite"
              />
            </div>
          </div>
          <div class="item">
            <div class="label">提示词</div>
            <p class="description">您可以自定义您的提示词格式。</p>
            <div class="input">
              <Textarea
                placeholder="提示词的完整内容"
                v-model:value="form.prompt"
                class="textarea"
              ></Textarea>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="right"
            ><div
              class="btn echo-btn no-border primary-outline-button"
              @click="handleColse"
            >
              取消
            </div>
            <div class="btn echo-btn primary-button" @click="handleSubmit">
              保存
            </div></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.echo-modal-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  user-select: text;
  text-align: left;
  font-weight: 400;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 5;
  background: transparent;
}
.echo-modal-wrapper.black-mask {
  background: rgba(0, 0, 0, 0.1);
}
.echo-modal {
  position: relative;
  background: #ffffff;
  box-shadow: 0 0 1px #00000014, 1px 2px 14px 1px #73727826;
  border-radius: 8px;
}
.echo-modal .close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  font-size: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
  z-index: 2;
  transition: color 0.2s, background-color 0.2s;
  border-radius: 4px;
}
.prompt-operation {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.prompt-operation .header {
  width: 100%;
  padding: 18px 0;
  font-size: 16px;
  color: #212b36;
  line-height: 20px;
  text-align: center;
  font-weight: 600;
}
.prompt-operation .content {
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.prompt-operation .content .item {
  display: flex;
  flex-direction: column;
}
.prompt-operation .content .item .label {
  font-size: 14px;
  color: #212b36;
  font-weight: 600;
  display: flex;
  align-items: center;
  height: 20px;
  margin-bottom: 4px;
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
.icon-picker {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: #f4f6f8;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #212b36;
}
.echo-popover .mask {
  position: fixed;
  z-index: 900;
  background-color: transparent;
  cursor: default;
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
.echo-popover .content.show {
  visibility: visible;
}
.echo-popover .content-animate.show {
  transform: scaleY(1);
  opacity: 1;
}
.echo-popover .icons-content {
  background: #ffffff;
  box-shadow: 0 5px 25px #0000000a, 0 3.2px 12px #00000014;
  border-radius: 8px;
  padding: 10px 16px;
  width: 272px;
  flex-direction: column;
  gap: 10px;
  display: flex;
}
.echo-popover .icons-content .icons-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  align-items: center;
  color: #00000073;
}
.echo-popover .icons-close {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #00000040;
}
.echo-popover .icons-content .icon-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  max-height: 204px;
  overflow-y: overlay !important;
  margin-right: -12px;
  padding-right: 12px;
}
.echo-popover .icons-content .icon-list .icon {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  color: #212b36;
  border: 1px solid transparent;
  background-color: #fff;
  width: 20px;
  height: 20px;
}
.echo-popover .icons-content .icon-list .icon:hover {
  background: rgba(145, 158, 171, 0.08);
}
.prompt-operation .content .item {
  display: flex;
  flex-direction: column;
}
.prompt-operation .content .item .label {
  font-size: 14px;
  color: #212b36;
  font-weight: 600;
  display: flex;
  align-items: center;
  height: 20px;
  margin-bottom: 4px;
}
.prompt-operation .content .item .input {
  flex: 1;
  width: 100%;
}
.prompt-operation .content .item .input-overwrite {
  word-wrap: break-word;
  white-space: pre-wrap;
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  box-shadow: unset !important;
  padding: 4px 12px;
  outline: 0;
  font-size: 14px;
  color: #212b36;
}
.prompt-operation .content .item .description {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #212b36;
  margin-top: -2px;
  margin-bottom: 4px;
}
.prompt-operation .content .item .textarea {
  overflow-y: overlay !important;
  word-wrap: break-word;
  white-space: pre-wrap;
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  box-shadow: unset !important;
  padding: 8px 12px;
  outline: 0;
  font-size: 14px;
  color: #212b36;
  line-height: 1.7;
  min-height: 80px;
}
.prompt-operation .footer {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
}
.prompt-operation .footer .right {
  gap: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
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
.echo-btn.no-border {
  border: none !important;
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
</style>
