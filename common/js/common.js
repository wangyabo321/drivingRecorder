import JSEncrypt from '../../jsencrypt/index.js';

// 密码加密
const generateKey = (params) => {
  let { authorization, password } = params
  let encrypt =new JSEncrypt()
  // 公钥
  let pubKey = `-----BEGIN PUBLIC KEY-----
  MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALEomrkYHBtwDpl++GPN7O7fcZxbKxOJ
  Erae49FVfXc4Kavz3bfllExeNbZBbVYYf1Znuq35GNOkwop9id53jn8CAwEAAQ==
  -----END PUBLIC KEY-----`
  
  if (authorization) {
          pubKey = `-----BEGIN PUBLIC KEY-----
  ${authorization}
  -----END PUBLIC KEY-----`
        }
  encrypt.setPublicKey(pubKey)
  return encrypt.encryptLong(password)
}

// 获取当前时间 format: even: 2021-09-06, odd: 2021-9-6
const timer = (format, picker, type) => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (picker === "picker") {
    if (type === "start") {
      year = year - 60
    } else if (type === "end") {
      year = year + 2
    }
  }
  if (format === "even") {
    month = month > 9 ? month : "0" + month
    day = day > 9 ? day : "0" + day
  }
  
  return `${year}-${month}-${day}`
}

// 打开手机 wifi 列表界面
const openAppWifi = () => {
  if (plus.os.name === "Android") { // Android 平台
    let main = plus.android.runtimeMainActivity()
    let Intent = plus.android.importClass("android.content.Intent")
    let mIntent = new Intent('android.settings.WIFI_SETTINGS')
    main.startActivity(mIntent)
  } else { // ios 平台
    let UIApplication = plus.ios.import("UIApplication")
    let NSURL = plus.ios.import("NSURL")
    let setting = NSURL.URLWithSting("app-setting:")
    let application = UIApplication.shareApplication()
    application.openURL(setting)
    plus.ios.deleteObject(setting)
    plus.ios.deleteObject(application)
  }
}


// 密码验证(8-16位数字、字母、特殊字符组合)
const passwordVarify = (pwd) => {
  return new RegExp("^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,16}$").test(pwd)
}

// 读取手机app文件
const getAppFile = (filePath) => {
	return new Promise((resolve, reject) => {
		plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
		  let directoryReader = entry.createReader() // 获取读取目录对象
		  directoryReader.readEntries((entries) => { // 遍历子目录
		    resolve(entries)
		  }, (err) => {
		    console.log(err)
		  })
		}, (err) => {
		  console.log(err)
		})
	})
}
// 获取文件的后缀名
const getFileSuffix = (name) => {
	let dotLastIndex = name.lastIndexOf('.')
	return name.slice(dotLastIndex)
}
// 通过文件名获取文件信息 (图片) Camera4_20211025_13.37.35_13.37.35_00:00_76.88K.jpeg, file:////storage/emulated/0/DCIM/360/image/Camera4_20211025_13.37.35_13.37.35_00:00_76.88K.jpeg
const getImageInfoByFileName = (name, fullPath) => {
	const dotLastIdx = name.lastIndexOf(".")
	const strFileName = name.slice(0, dotLastIdx) // Camera4_20211025_13.37.35_13.37.35_00:00_76.88K
	const fileNameArr = strFileName.split("_") // ['Camera4', '20211025', '13.37.35', '13.37.35', '00:00', '76.88K']
	const date = fileNameArr[1].slice(0, 4) + '-' + fileNameArr[1].slice(4, 6) + '-' + fileNameArr[1].slice(6, 8) // 2021-09-13
	const timer = fileNameArr[2].replace(/\./g, ':') // 09:43:43
	// const timerEnd = fileNameArr[3].replace(/\./g, ':') // 09.43.42
	return { date, name, timer, fullPath }
}

// // 计算视频大小换算
const computerVideoSize = (size) => {
	if (size >= 1024 * 1024 *1024) {
		size = Number((size / (1024 * 1024 *  1024)).toFixed(2)) + "G"
	} else if (size >= 1024 * 1024) {
		size = Number((size / (1024 * 1024)).toFixed(2)) + "M"
	} else if (size >= 1024) {
		size = Number((size / (1024)).toFixed(2)) + "K"
	}
	return size
}

module.exports = {
  generateKey,
  timer,
  openAppWifi,
  passwordVarify,
	getAppFile,
	getFileSuffix,
	getImageInfoByFileName,
	computerVideoSize
}