// API 请求封装 — 对接 NestJS 后端
const BASE_URL = "http://139.155.139.83:3001";

const request = (options) => {
  const token = uni.getStorageSync("token");
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          uni.reLaunch({ url: "/pages/index/index" });
          reject(res.data);
        } else {
          const msg = res.data?.message || res.data?.msg || "请求失败";
          uni.showToast({ title: msg, icon: "none" });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({ title: "网络异常，请检查后端服务", icon: "none" });
        reject(err);
      },
    });
  });
};

export const api = {
  get: (url, data) => request({ url, method: "GET", data }),
  post: (url, data) => request({ url, method: "POST", data }),
  put: (url, data) => request({ url, method: "PUT", data }),
  delete: (url, data) => request({ url, method: "DELETE", data }),
};

// 上传文件
export const uploadFile = (filePath) => {
  const token = uni.getStorageSync("token");
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + "/upload/image",
      filePath,
      name: "file",
      header: { Authorization: `Bearer ${token}` },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve(data);
        } catch (e) { reject(res.data); }
      },
      fail: reject,
    });
  });
};