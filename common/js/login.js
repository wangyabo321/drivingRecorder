import { request } from "./axios.js"

// 获取 authorization
const getAuth = () => {
  const params = {
  	"method": "login.negotiate",
  	"params": {
  		"userName": "admin"
  	},
  	"session": 1234,
  	"id": 123456
  }

  return new Promise((resolve, reject) => {
    request(params).then((res) => {
      if (res.data.result) {
        resolve(res.data.params)
      }
    }).catch((err) => {
			console.log(211, err)
			reject(err)
		})
  })
}

// 获取 token
const getToken = (encryptedPw) => {
  const params = {
  	"method": "login",
  	"params": {
  		"userName": "admin",
  		"password": encryptedPw
  	},
  	"session": 1234,
  	"id": 123456
  }
  return new Promise((resolve, reject) => {
    request(params).then((res) => {
       if (res.data.result) {
        const token = res.header['refresh-token']
        resolve(token)
       } else {
        reject("err")
       }
    })
  })
}
// 获取设备 SSID 名称
const getSSID = () => {
  const params = {
		"method": "RemoteWLanManager.getHostApdConfig",
		"params": null,
		"id": 1284,
		"session": "de804258edea1171ea971f3c32aeef39"
	}
	return new Promise((resolve, reject) => {
		request(params).then((res) => {
			if (res.data.result) {
				const SSID = res.data.params.SSID
				resolve(SSID)
			} else {
				reject("err")
			}
		})
	})
}

// 文件销毁
const destoryFile = () => {
  const params = {
    "method": "mediaFileFind.destory",
    "params": {
      "token": 0,
    },
    "session": 81375,
    "id": 1
  }
  return new Promise((resolve, reject) => {
   request(params).then(res => {
      if (res.data.result) {
        resolve()
      }
    })
  })
}
// 创建文件
const createFile = () => {
  const params = {
    "method": "mediaFileFind.factory.create",
    "params": null,
    "id": 8597,
    "session": "19dd79c0115a980e4db95b0f4be8a902"
  }
  return new Promise((resolve, reject) => {
    request(params).then((res) => {
      if (res.data.result) {
        resolve()
      }
    })
  })
}
// 查找文件
const findFile = (date, type) => {
  const params = {
    "method": "mediaFileFind.findFile",
    "params": {
      "token": 0,
      "condition": {
        "Dirs": ["/mnt/sdcard"],
        "Types": [type],
        "Flags": ["Timing", "Event", "Alarm", "Manual"],
        "StartTime": `${date} 00:00:00`,
        "EndTime": `${date} 23:59:59`
      }
    },
    "id": 8597,
    "session": 123456
  }
  return new Promise((resolve, reject) => {
    request(params).then((res) => {
      if (res.data.result) {
        resolve(res.data.params)
      }
      
    })
  })
}

// 删除文件
const deleteFile = (StartTime, EndTime) => {
	console.log(131, StartTime, EndTime)
	const params = {
	  "method": "storage.deleteFile",
	  "params": {
	    "fileStartTime": StartTime,
	    "fileEndTime": EndTime
	  },
	  "session" : 1234,
	  "id" : 123456
	}
	return new Promise((resolve, reject) => {
		request(params).then((res) => {
			console.log(142142, res)
		  if (res.data.result) {
		    resolve()
		  }
		})
	})
}
// 锁定文件/解锁文件
const isLockOrUnlockFile = (method, StartTime, EndTime) => {
  const params = {
    "method": method,
    "params": {
      "fileStartTime": StartTime,
      "fileEndTime": EndTime
    },
    "session" : 1234,
    "id" : 123456
  }
  
  return new Promise((resolve, reject) => {
    request(params).then((res) => {
      if(res.data.result) {
        resolve()
      }
    })
  })
  
}

module.exports = {
  getAuth,
  getToken,
  getSSID,
	destoryFile,
	createFile,
	findFile,
	deleteFile,
	isLockOrUnlockFile
}