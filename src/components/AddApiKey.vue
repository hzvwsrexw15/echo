<script setup>
import { ref, reactive, defineEmits } from "vue";
import { Input } from "ant-design-vue";
import { IClose } from "./icons";
import { message } from "ant-design-vue";

const emit = defineEmits();
const form = reactive({
  openaiApiKey: "",
});
const handleColse = () => {
  emit("close");
};
const handleSubmit = () => {
  if (!form.openaiApiKey) {
    message.error("请输入API KEY");
    return;
  }
  emit("submit", form);
};
</script>
<template>
  <div class="echo-modal-wrapper black-mask" style="position: fixed">
    <div class="echo-modal" style="width: 420px">
      <div class="close" @click="handleColse">
        <IClose width="20" height="20"></IClose>
      </div>
      <div class="prompt-operation">
        <div class="header">修改API KEY</div>
        <div class="content">
          <div class="item">
            <div class="label">API KEY</div>
            <div class="input">
              <Input
                placeholder="Openapi API KEY"
                v-model:value="form.openaiApiKey"
                class="input-overwrite"
              />
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
