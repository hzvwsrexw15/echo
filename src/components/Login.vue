<script setup>
import { ref, reactive, defineEmits } from "vue";
import { Input, Button, message } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { IClose, IGithub } from "./icons";

const emit = defineEmits();
const icon = chrome.runtime.getURL("images/echo.png");
const formState = reactive({
  username: "",
  password: "",
});
const registerFormState = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});
const cur_tab = ref("login");
const handleClose = () => {
  emit("close");
};
const handlelogin = () => {
  if (!formState.username) {
    message.error("请输入手机号");
    return;
  }
  if (!formState.password) {
    message.error("请输入密码");
    return;
  }
  chrome.runtime.sendMessage(
    {
      type: "user-login",
      params: {
        username: formState.username,
        password: formState.password,
      },
    },
    (response) => {
      // 登录成功
      if (!response.status) {
        message.info("登录成功！");
        emit("success");
      }
    }
  );
};
const handleRegister = () => {
  if (!registerFormState.username) {
    message.error("请输入手机号");
    return;
  }
  if (!registerFormState.password) {
    message.error("请输入密码");
    return;
  }
  if (registerFormState.confirmPassword !== registerFormState.password) {
    message.error("两次密码不一致");
    return;
  }
  chrome.runtime.sendMessage(
    {
      type: "post-data",
      url: "/user/register",
      params: {
        username: registerFormState.username,
        password: registerFormState.password,
      },
    },
    (response) => {
      // 注册成功
      if (!response.status) {
        message.info("注册成功！");
        emit("success");
      } else {
        message.error(response.message);
      }
    }
  );
};
</script>
<template>
  <div
    id="echo-main-window-root"
    class="main-window mode-sidebar"
    style="width: 420px"
  >
    <header class="header">
      <div class="header-left">
        <a class="logo-wrapper" target="_blank" rel="noreferrer"
          ><img
            :src="icon"
            class="logo logo-img"
            style="width: 22px; height: 22px; border-radius: 4px"
          /><span class="title"
            >{{ cur_tab === "login" ? "登录" : "注册" }} Echo</span
          ></a
        >
      </div>
      <div class="header-center"></div>
      <div class="header-right">
        <div class="operation-item" @click="handleClose">
          <IClose :width="16" :height="16"></IClose>
        </div>
      </div>
    </header>
    <div class="login" v-if="cur_tab === 'login'">
      <div class="container">
        <div class="form-item">
          <Input
            v-model:value="formState.username"
            placeholder="手机号"
            size="large"
          >
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>
        <div class="form-item">
          <Input
            v-model:value="formState.password"
            type="password"
            placeholder="密码"
            size="large"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>

        <div class="login-btn" @click="handlelogin">
          <span>使用账号登录</span>
        </div>
        <div>
          <Button type="link" @click="cur_tab = 'register'">注册</Button>
        </div>
      </div>
    </div>
    <div class="login" v-else>
      <div class="container">
        <div class="form-item">
          <Input
            v-model:value="registerFormState.username"
            placeholder="手机号"
            size="large"
          >
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>
        <div class="form-item">
          <Input
            v-model:value="registerFormState.password"
            type="password"
            placeholder="密码"
            size="large"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>
        <div class="form-item">
          <Input
            v-model:value="registerFormState.confirmPassword"
            type="password"
            placeholder="确认密码"
            size="large"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>

        <div class="login-btn" @click="handleRegister">
          <span>注册账号</span>
        </div>
        <div>
          <Button type="link" @click="cur_tab = 'login'">登录</Button>
        </div>
      </div>
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
.login {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -12%;
}
.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}
.logo .title {
  display: flex;
  align-items: center;
  height: 18px;
  color: #0d1117;
  font-weight: 500;
}
.login .container .login-btn {
  width: 160px;
  display: flex;
  align-items: center;
  height: 44px;
  background: #3872e0;
  border-radius: 8px;
  color: #fff;
  gap: 8px;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  margin-bottom: 20px;
  margin-top: 20px;
}
.login .container .login-img {
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background-color: #fff;
  overflow: hidden;
}
.form-item {
  margin-bottom: 20px;
}
</style>
