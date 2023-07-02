<template>
	<view class="videoWrap">
		<video class="videoPlay" id="videoPlay" :src="livePlayUrl" object-fit="fill" show-mute-btn="false"
			:controls="controlsFlag" autoplay :muted="isMuted" show-play-btn="false" @play="playEvent"
			@pause="pauseEvent" @fullscreenchange="fullscreenchangeEvent">
			<cover-view class="ctrlToggle" @click="switchToggle"></cover-view>
			<cover-view :class="toggleFlag ? 'opacityShow ctrlToggle' : 'opacityHide ctrlToggle'" v-if="toggleFlag"
				@click="switchToggle"></cover-view>
			<cover-image class="playBtn" v-if="toggleFlag" :src="playBtn.src" @click="playVideoEvent" />
			<cover-image class="settingBtn" v-if="toggleFlag" :src="controlImg.settingImg" @click="toSkipSettingPage" />
			<cover-image class="switchAroundBtn" v-if="toggleFlag" :src="switchImg[switchIdx]"
				@click="swithBeforeEvent" />
			<cover-image class="muteBtn" v-if="toggleFlag" :src="muteImg[muteIdx]" @click="mutedEvent" />
			<cover-image class="fullScreenBtn" v-if="toggleFlag" :src="controlImg.fullScreenImg"
				@click="fullScreenEvent" />
		</video>
	</view>
</template>

<script>
	export default {
		name: "livePlayVideo",
		data() {
			return {
				videoSrc: "rtsp://admin:admin123@192.168.10.10/camera1/main", // rtsp://admin:admin123@192.168.10.10/camera1/main
				// 控制按钮toggle
				toggleFlag: false,
				toggleTimer: null,
				controlsFlag: false,
				// 视频组件
				video: {
					context: null,
				},
				// 播放状态
				statusEnum: {
					PLAY: "0",
					PAUSE: "1",
					LOADING: "2",
				},
				// 播放按钮
				playBtn: {
					status: "0",
					src: "/static/videoIcon/play-white.png",
				},
				// 图片资源
				controlImg: {
					playImg: "/static/videoIcon/play-white.png",
					pauseImg: "/static/videoIcon/pause-white.png",
					settingImg: "/static/videoIcon/shezhi-white.png",
					fullScreenImg: "/static/videoIcon/fullScreen-white.png",
				},
				switchImg: ["/static/videoIcon/after-switch.png", "/static/videoIcon/before-switch.png"],
				switchIdx: 0,
				muteImg: ["/static/videoIcon/jingyin-white.png", "/static/videoIcon/horn.png"],
				muteIdx: 0,
				isMuted: true //是否静音播放
			};
		},
		props: {
			deviceName: {
				type: String,
				default: ""
			},
			livePlayUrl: {
				type: String,
				default: ""
			}

		},
		mounted() {
			this.video.context = uni.createVideoContext("videoPlay");
		},
		methods: {
			playEvent() {
				this.switchPlayStatus(this.statusEnum.PLAY, this.controlImg.pauseImg);
			},
			pauseEvent() {
				this.switchPlayStatus(this.statusEnum.PAUSE, this.controlImg.playImg);
			},
			fullscreenchangeEvent(e) {
				this.controlsFlag = e.detail.fullScreen;
			},
			playVideoEvent() {
				if (!this.isLoading()) {
					if (this.isPlay()) {
						this.video.context.pause();
					} else {
						this.video.context.play();
					}
				}
			},
			// 视频全屏事件
			fullScreenEvent() {
				this.video.context.requestFullScreen();
			},
			isPlay() {
				return this.playBtn.status == this.statusEnum.PLAY;
			},
			isPause() {
				return this.playBtn.status == this.statusEnum.PAUSE;
			},
			isLoading() {
				return this.playBtn.status == this.statusEnum.LOADING;
			},
			switchPlayStatus(status, src) {
				this.playBtn.status = status;
				this.playBtn.src = src;
			},
			switchToggle() {
				this.toggleFlag = !this.toggleFlag;
				if (this.toggleFlag) {
					this.openTimer();
				} else {
					this.closeTimer();
				}
			},
			closeToggle() {
				this.toggleFlag = false;
				this.closeTimer();
			},
			openTimer() {
				this.toggleTimer = setTimeout(() => {
					this.closeToggle();
				}, 3000);
			},
			closeTimer() {
				if (this.toggleTimer) {
					clearTimeout(this.toggleTimer);
				}
			},
			// 前路图标事件
			swithBeforeEvent() {
				if (this.switchIdx === 0) { // 由前路切换后路
					this.switchIdx = 1
					this.videoSrc = ""
				} else {
					this.switchIdx = 0
					this.videoSrc = "rtsp://admin:admin123@192.168.10.10/camera1/main"
				}
			},
			// 静音事件
			mutedEvent() {
				if (this.muteIdx === 0) {
					this.isMuted = false
					this.muteIdx = 1
				} else {
					this.isMuted = true
					this.muteIdx = 0
				}

			},
			// 设置图标事件
			toSkipSettingPage() {
				this.$uniapi.goGavigate(`../setting/setting?deviceName=${this.deviceName}`)
			}
		}
	}
</script>

<style lang="less" scoped>
	// 播放器样式
	.videoWrap {
		width: 100%;

		.videoPlay {
			width: 100%;
			height: 450rpx;

			.ctrlToggle {
				height: 100%;
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}

			.opacityShow {
				background-color: rgba(0, 0, 0, 0.3);
			}

			.opacityHide {
				background-color: rgba(0, 0, 0, 0);
			}

			.playBtn {
				position: absolute;
				left: 50%;
				top: 50%;
				height: 100rpx;
				width: 100rpx;
				margin-left: -50rpx;
				margin-top: -50rpx;
				border-radius: 50%;
			}

			.settingBtn {
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				height: 50rpx;
				width: 50rpx;
			}

			.switchAroundBtn {
				position: absolute;
				right: 30rpx;
				top: 50%;
				margin-top: -25rpx;
				height: 50rpx;
				width: 50rpx;
			}

			.muteBtn {
				position: absolute;
				right: 120rpx;
				bottom: 30rpx;
				height: 50rpx;
				width: 50rpx;
			}

			.fullScreenBtn {
				position: absolute;
				right: 30rpx;
				bottom: 30rpx;
				height: 50rpx;
				width: 50rpx;
			}
		}
	}
</style>
