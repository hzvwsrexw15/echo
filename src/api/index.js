export const BASE_URL = "https://api.yunzhu.info";

export function post(url, params) {
  return fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    mode: "cors",
  });
}

export function fetchUserInfo() {
  return fetch(`${BASE_URL}/user/currentUser`, {
    method: "GET",
    mode: "cors",
  });
}

export function loginUser(params) {
  return fetch(`${BASE_URL}/user/loginByPwd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    mode: "cors",
  });
}
