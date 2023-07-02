<template>
	<view class="homePage">
		<!--未添加过设备-->
		<view class="deviceNone" v-if="deviceList.length === 0">
			<view class="deviceIcon">
				<image class="deviceImg" src="/static/index/noConnect.png" mode="widthFix"></image>
				<view class="deviceText">请添加设备</view>
			</view>
		</view>
		<!--添加过设备-->
		<view class="deviceListWrap" v-if="deviceList.length !== 0">
			<view class="deviceItemWrap" v-for="(item, index) in deviceList" :key="index" @click="toSkipLivePlay(item)">
				<view class="deviceLeft">
					<image class="icon" src="../../static/index/deviceIcon.png" mode="widthFix"></image>
				</view>
				<view class="deviceRight">
					<view class="deleteIcon">
						<image src="../../static/index/delete.png" mode="widthFix"
							@click.stop="deleteDevice(item, index)"></image>
					</view>
					<view class="deviceName">
						<view class="deviceNameTitle">{{item.deviceName}}</view>
						<view class="deviceStatus">
							<view :class="['cirle', item.status ? 'isOnline' : 'noOnline']"></view>
							<text class="statusTitle">{{item.status ? '在线' : '离线'}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<button class="addDeviceBtn" type="primary" @click="addDeviceBtn">添加设备</button>

		<!--删除提示信息-->
		<uni-popup ref="popup" type="center">
			<uni-popup-dialog type="warn" title="删除" mode="base" :content="content" :before-close="true"
				@close="closePopup" @confirm="confirmPopup"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	const FvvUniWifiHelper = uni.requireNativePlugin("Fvv-UniWifiHelper")
	export default {
		data() {
			return {
				deviceList: [],
				idx: null, // 要删除设备索引,
				content: "", // 要删除设备名称
				tokenInfo: null,
				deviceWifiName: '',
				appWifiName: ""
			}
		},
		async onShow() {
			// 显示 tabber 导航栏
			uni.showTabBar()
			try {
				// 获取当前 app 连接的 wifi名称
				this.appWifiName = await this.getAppLinkWifiName()
				// 获取设备 wifi 名称
				this.getLoginInfo()
			} catch (err) {
				// 获取本地存储的设备列表
				this.getLocalStroageDeviceList()
			}

		},
		mounted() {
			// 每30分钟获取一次 token
			setInterval(() => {
				this.getDeviceLoginInfo()
			}, 1000)
			// 1000 * 60 * 29 = 29分钟
		},
		methods: {
			
			// 获取当前 app 连接的 wifi 名称
			getAppLinkWifiName() {
				return new Promise((resolve, reject) => {
					FvvUniWifiHelper.init((res) => {
						FvvUniWifiHelper.getWifiInfo((res) => {
							const SSID = res.sSID.replace(/\"/g, "")
							if (SSID.includes("<unknown ssid>")) {
								reject("err")
							} else {
								resolve(SSID)
							}
						})
					})
				})
			},

			
			// 获取登录信息
			async getLoginInfo() {
				const tokenInfo = await this.$login.getAuth()
				const { authorization, random } = tokenInfo
				const params = { authorization, password: `${random}admin123`}
				const encryptedPw = this.$common.generateKey(params) // 加密后的密码
				const token = await this.$login.getToken(encryptedPw)
				uni.setStorageSync('token', token)
				this.deviceWifiName = await this.$login.getSSID() // 获取设备名称(判断设备名称是否与连接的手机 wifi 名称是否一致)
				this.getAppWifiName(this.deviceWifiName)
			},

			// 获取登录信息 (死循环判断是否有网络, 以及获取 token值)
			getDeviceLoginInfo() {
				try {
					const params = {
						"method": "login.negotiate",
						"params": {
							"userName": "admin"
						},
						"session": 1234,
						"id": 123456
					}
					this.$axios(params).then((res) => {
						this.tokenInfo = res.data.params
						this.toLoginDevice(this.tokenInfo)
					}).catch((err) => { // 没网
						this.deviceList.forEach((item) => {
							item.status = false
						})
						uni.setStorageSync("deviceInfo", JSON.stringify(this.deviceList))
					})
				} catch (err) {
					console.log(161, err)
				}

			},
			// 登录信息(密码加密)
			async toLoginDevice(tokenInfo) {
				const { authorization, random } = tokenInfo
				const params = { authorization, password: `${random}admin123` }
				const encryptedPw = this.$common.generateKey(params) // 加密后的密码
				const token = await this.$login.getToken(encryptedPw)
				uni.setStorageSync('token', token)
			},

			// 登录信息结束
			getAppWifiName(deviceWifiName) {
				if (this.appWifiName === deviceWifiName) {
					// 获取wifi名称, wifi密码, 设备名称
					this.getDeviceInfo()
				} else {
					this.getLocalStroageDeviceList()
				}

			},
			// 获取本地存储的设备列表
			getLocalStroageDeviceList() {
				const deviceList = JSON.parse(uni.getStorageSync("deviceInfo"))
				deviceList.forEach((item) => {
					item.status = false
				})
				this.deviceList = [...deviceList]
			},
			// 获取设备名称
			getDeviceInfo() {
				const params = {
					method: "configManager.getConfig",
					params: {
						name: "General",
					},
					id: 1080,
					session: 123
				}

				this.$axios(params).then((res) => {
					if (res.data.result) {
						const machineName = res.data.params.table.MachineName
						this.getDevicePasswordInfo(machineName)
					}
				})
			},

			getDevicePasswordInfo(machineName) {
				const param = {
					"method": "RemoteWLanManager.getHostApdConfig",
					"params": null,
					"id": 1284,
					"session": "de804258edea1171ea971f3c32aeef39"
				}

				this.$axios(param).then((res) => {
					if (res.data.result) {
						const password = res.data.params.Password
						const SSID = res.data.params.SSID
						this.getDeviceInfoArr(machineName, password, SSID)
					}

				})
			},

			// 获取设备信息数组
			getDeviceInfoArr(deviceName, password, SSID) {

				let deviceInfo = []
				const keys = uni.getStorageInfoSync().keys
				if (!(keys.includes("deviceInfo"))) {
					deviceInfo.push({
						deviceName,
						password,
						SSID,
						status: true
					})
					this.deviceList = [...deviceInfo] // 设备数据
					uni.setStorageSync("deviceInfo", JSON.stringify(deviceInfo))
				} else {
					deviceInfo = JSON.parse(uni.getStorageSync("deviceInfo"))
					const isfind = deviceInfo.find((item) => {
						return item.SSID === SSID
					})
					if (isfind) {
						deviceInfo.forEach((item) => {
							if (item.SSID === SSID) {
								item.status = true
								item.deviceName = deviceName
							} else {
								item.status = false
							}
						})
					} else {
						deviceInfo.forEach((item) => {
							item.status = false
						})
						deviceInfo.push({
							deviceName,
							password,
							SSID,
							status: true
						})
					}
					this.deviceList = [...deviceInfo] // 设备数据
					uni.setStorageSync("deviceInfo", JSON.stringify(deviceInfo))
				}
			},
			// 删除设备
			deleteDevice(item, index) {
				this.idx = index
				this.content = `是否要删除该${item.deviceName}设备?`
				this.$refs.popup.open()
			},
			closePopup() {
				this.$refs.popup.close()
			},
			// 删除弹窗事件
			confirmPopup() {
				this.deviceList.splice(this.idx, 1)
				uni.setStorageSync("deviceInfo", JSON.stringify(this.deviceList))
				FvvUniWifiHelper.closeWifi()
				this.$refs.popup.close()
			},
			// 跳转直播
			toSkipLivePlay(item, index) {
				const { deviceName, SSID, password, status } = item

				// console.log(12333, deviceName, SSID, password, status)

				if (status) { // item.status 状态判断跳转
					this.$uniapi.goGavigate(`../livePlay/livePlay?deviceName=${deviceName}`)
				} else { // 直接连接 wifi (搜索设备, 并连接设备)
				
					if (FvvUniWifiHelper.isWifiEnable()) {
						FvvUniWifiHelper.getWifiList((res) => {
							let appWifiList = []
							res.forEach((item) => {
								appWifiList.push(item.ssid)
							})
							appWifiList = Array.from(new Set(appWifiList))
							if (appWifiList.includes(SSID)) {
								setTimeout(() => {
									this.deviceList.forEach((it) => {
										if (it.deviceName === deviceName) {
											it.status = true
										} else {
											it.status = false
										}
									})
									uni.setStorageSync("deviceInfo", JSON.stringify(this.deviceList))
								}, 5000)

								FvvUniWifiHelper.closeWifi()
								FvvUniWifiHelper.connectWifi({
									ssid: SSID,
									password
								})
							}
						});
					} else {
						setTimeout(() => {
							this.deviceList.forEach((it) => {
								if (it.deviceName === deviceName) {
									it.status = true
								} else {
									it.status = false
								}
							})
							uni.setStorageSync("deviceInfo", JSON.stringify(this.deviceList))
						}, 5000)

						FvvUniWifiHelper.closeWifi()
						FvvUniWifiHelper.connectWifi({
							ssid: SSID,
							password
						})
					}
				}
				FvvUniWifiHelper.openWifi();
			},
			// 添加设备
			addDeviceBtn() {
				this.$common.openAppWifi()
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 未添加过设备样式 */
	.deviceNone {
		display: flex;
		justify-content: center;

		.deviceIcon {
			width: 580rpx;
			height: 380rpx;
			margin-top: 40rpx;
			border-radius: 10px;
			text-align: center;
			background-color: #ffffff;

			.deviceImg {
				width: 320rpx;
			}

			.deviceText {
				font-size: 13px;
				color: #666
			}
		}
	}

	/* 添加设备按钮样式 */
	.addDeviceBtn {
		margin-top: 40rpx;
		transform: scale(0.85);
		border-radius: 25px;
		background-color: #DC851F;
	}

	/* 添加过设备样式 */
	.deviceItemWrap {
		width: 750rpx;
		height: 190rpx;
		background-color: #fff;
		display: flex;
		margin-top: 20rpx;

		.deviceLeft {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			.icon {
				width: 160rpx;
			}
		}

		.deviceRight {
			flex: 2;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			.deleteIcon {
				position: absolute;
				top: 15rpx;
				right: 15rpx;
				box-sizing: border-box;

				image {
					width: 40rpx;
				}
			}

			.deviceName {

				// text-align: center;
				.deviceNameTitle {
					font-size: 20px;
					color: #000;
				}

				.deviceStatus {
					.cirle {
						display: inline-block;
						width: 16rpx;
						height: 16rpx;
						border-radius: 100%;
						margin-right: 10rpx;
					}

					.statusTitle {
						font-size: 12px;
						color: #333;
					}
				}
			}
		}
	}

	/* 在线样式 */
	.isOnline {
		background-color: #DC851F;
		border: 1px solid #DC851F;
	}

	/* 离线样式 */
	.noOnline {
		background-color: #fff;
		border: 1px solid #333;
	}
</style>
