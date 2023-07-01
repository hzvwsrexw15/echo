<script setup>
import { ref, reactive, defineEmits } from "vue";
import { Input, Button, message } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { IClose, IGithub } from "./icons";
import {
  fetchLogin,
  fetchRegister,
  fetchUpdateUser,
  fetchSendSms,
} from "../api/user";

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
  code: "",
});
const updateFormState = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  code: "",
});
const cur_tab = ref("login");
const registercCodetText = ref("获取验证码");
const registerDisabledCode = ref(false);
const registercCodetTimes = ref(59);
const handleClose = () => {
  emit("close");
};
const handlelogin = () => {
  if (!formState.username) {
    message.error("请输入手机号");
    return;
  }
  // 校验手机号
  const phoneReg = /^1[3456789]\d{9}$/;
  if (!phoneReg.test(formState.username)) {
    message.error("请输入正确的手机号");
    return;
  }
  if (!formState.password) {
    message.error("请输入密码");
    return;
  }
  fetchLogin({
    username: formState.username,
    password: formState.password,
  })
    .then((res) => {
      message.info("登录成功！");
      emit("success");
    })
    .catch((e) => {
      message.error(e.message);
    });
};
const handleRegister = () => {
  if (!registerFormState.username) {
    message.error("请输入手机号");
    return;
  }
  // 校验手机号
  const phoneReg = /^1[3456789]\d{9}$/;
  if (!phoneReg.test(registerFormState.username)) {
    message.error("请输入正确的手机号");
    return;
  }
  if (!registerFormState.code) {
    message.error("请输入验证码");
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
  fetchRegister({
    username: registerFormState.username,
    password: registerFormState.password,
    code: registerFormState.code,
  })
    .then((res) => {
      message.info("注册成功！");
      emit("success");
    })
    .catch((e) => {
      message.error(e.message);
    });
};
const handleUpdatePwd = () => {
  if (!updateFormState.username) {
    message.error("请输入手机号");
    return;
  }
  // 校验手机号
  const phoneReg = /^1[3456789]\d{9}$/;
  if (!phoneReg.test(updateFormState.username)) {
    message.error("请输入正确的手机号");
    return;
  }
  if (!updateFormState.code) {
    message.error("请输入验证码");
    return;
  }
  if (!updateFormState.password) {
    message.error("请输入密码");
    return;
  }
  if (updateFormState.confirmPassword !== updateFormState.password) {
    message.error("两次密码不一致");
    return;
  }
  fetchUpdateUser({
    username: updateFormState.username,
    password: updateFormState.password,
    code: updateFormState.code,
  })
    .then((res) => {
      message.info("密码修改成功！");
      emit("success");
    })
    .catch((e) => {
      message.error(e.message);
    });
};
const handleGetVerifyCode = (type) => {
  const username =
    type === "register" ? registerFormState.username : updateFormState.username;
  if (!username) {
    message.error("请输入手机号");
    return;
  }
  // 校验手机号
  const phoneReg = /^1[3456789]\d{9}$/;
  if (!phoneReg.test(username)) {
    message.error("请输入正确的手机号");
    return;
  }
  let timer = setInterval(() => {
    registercCodetTimes.value--;
    if (registercCodetTimes.value === 0) {
      clearInterval(timer);
      registercCodetText.value = "获取验证码";
      registerDisabledCode.value = false;
      registercCodetTimes.value = 59;
    } else {
      registercCodetText.value = `${registercCodetTimes.value}秒后重试`;
      registerDisabledCode.value = true;
    }
  }, 1000);
  fetchSendSms({
    phone: username,
  })
    .then(() => {
      message.info("验证码已发送");
    })
    .catch((e) => {
      message.error(e.message);
    });
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
        <div style="margin-bottom: 10px">
          <Button type="link" @click="cur_tab = 'register'">注册</Button>
        </div>
        <div>
          <Button type="link" @click="cur_tab = 'forget'">忘记密码</Button>
        </div>
      </div>
    </div>
    <div class="login" v-else-if="register">
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
          <div class="flex">
            <Input
              v-model:value="registerFormState.code"
              placeholder="验证码"
              class="code-inp"
              size="large"
            >
            </Input>
            <div style="width: 105px">
              <Button
                type="link"
                :disabled="registerDisabledCode"
                @click="handleGetVerifyCode('register')"
                >{{ registercCodetText }}</Button
              >
            </div>
          </div>
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
    <div class="login" v-else>
      <div class="container">
        <div class="form-item">
          <Input
            v-model:value="updateFormState.username"
            placeholder="手机号"
            size="large"
          >
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>
        <div class="form-item">
          <div class="flex">
            <Input
              v-model:value="updateFormState.code"
              placeholder="验证码"
              class="code-inp"
              size="large"
            >
            </Input>
            <div style="width: 105px">
              <Button
                type="link"
                :disabled="registerDisabledCode"
                @click="handleGetVerifyCode('forget')"
                >{{ registercCodetText }}</Button
              >
            </div>
          </div>
        </div>
        <div class="form-item">
          <Input
            v-model:value="updateFormState.password"
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
            v-model:value="updateFormState.confirmPassword"
            type="password"
            placeholder="确认密码"
            size="large"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </Input>
        </div>

        <div class="login-btn" @click="handleUpdatePwd">
          <span>修改密码</span>
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
.flex {
  display: flex;
  align-items: center;
}
.mr-5 {
  margin-right: 5px;
}
.code-inp {
  width: 110px;
}
</style>
