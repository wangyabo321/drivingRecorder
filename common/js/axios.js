// 请求函数
const request = (data) => {
  const method = data.method
  const header = {}
  if (!(method === "login.negotiate" || method === "loagin")) {
    header["Authorization"] = uni.getStorageSync("token")
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: "http://192.168.10.10/RPC",
      // url: "http://10.35.36.83/RPC",
      method: "POST",
      data,
      header,
			timeout: 30000,
      success: (data) => {
        resolve(data)
      },
      fail: (err) =>  {
        reject(err)
      }
    })
  })
}



module.exports = {
  request
}