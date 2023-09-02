<template>
	<view class="content">
		<view class="order-content">
			<view class="top-content">
				<view class="chef-img">
					<view class="img-box">
						<image :src="chefInfo.chefImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="chef-msg">
					<view class="chef-name">
						厨师姓名：{{chefInfo.chefName}}
					</view>
					<view class="chef-desc">
						厨师介绍：{{chefInfo.chefDesc}}
					</view>
					<view class="chef-time">
						注册时间：{{chefInfo.chefCreateTime}}
					</view>
				</view>
			</view>
			<view class="order-message">
				<view class="price list-item">
					<view class="label-box">
						厨师价格：
					</view>
					<view class="input-box">
						{{chefInfo.chefPrice}}
					</view>
				</view>
				<view class="tel list-item">
					<view class="label-box">
						联系电话：
					</view>
					<view class="input-box">
						<input type="text" v-model="userPhone" placeholder="请输入联系电话">
					</view>
				</view>
				<view class="service list-item">
					<view class="label-box">
						服务地址：
					</view>
					<view class="input-box">
						<uni-data-picker v-slot:default="{data, error}" v-model="userArea" :localdata="aCityData"
							popup-title="请选择所在地区">
							<view v-if="error" class="error">
								<text class="l-list-text">{{ error }}</text>
							</view>
							<view v-else-if="data.length" class="selected">
								<view v-for="(item,index) in data" :key="index" class="selected-item">
									<text>{{ item.text }}</text>
								</view>
							</view>
							<view v-else>
								<text class="l-list-text">{{defaultText}}</text>
							</view>
						</uni-data-picker>
					</view>
				</view>
				<view class="privace list-item">
					<view class="label-box">
						详细地址：
					</view>
					<view class="input-box">
						<input type="text" v-model="addressDetail" placeholder="请输入详细地址">
					</view>
				</view>
				<view class="address list-item">
					<view class="label-box">
						预约时间：
					</view>
					<view class="input-box" @click.stop="chooseTimeBtn">
						<div>{{dayTime}}</div>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="btn-left">
				<view class="chef-price">
					<view class="inner-box">
						总价：{{chefInfo.chefPrice}} 元
					</view>
				</view>
			</view>
			<view class="btn-right">
				<view class="btn-item chat-btn">
					<u-button shape="circle" size="mini" @click="cancelBack">取消下单</u-button>
				</view>
				<view class="btn-item create-order">
					<u-button shape="circle" type="success" size="mini" @click="createOrder">立即下单</u-button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading type="pulse" v-if="loading"></zero-loading>

		<liu-delivery-time @change="changeTime" ref="chooseTime" title="请选择预约时间"></liu-delivery-time>
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	import {
		formatDate
	} from "../../common/formatdate.js"
	import aCityData from "@/common/city-china.json";
	export default {
		data() {
			return {
				// 订单对应的厨师ID
				chefId: 0,
				loading: false,
				//厨师信息
				chefInfo: "",
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},

				//地址选择器
				//地址选择器需要数据
				index: "",
				aCityData,
				defaultText: "请选择",
				addType: 0,


				//用户需要的信息
				userArea: "",
				userPhone: "",
				userAddress: "",
				addressDetail: "",
				dayTime: '',

			}
		},
		onLoad(option) {
			this.chefId = option.chefId;
			this.getChefInfo();
			this.getCurrentTime();
		},
		watch: {
			userArea(newVal, oldVal) {
				this.getAddresstext()
			}
		},
		methods: {
			//picker选择器
			bindPickerChange(e) {
				this.index = e.detail.value
			},
			//获取当前时间
			getCurrentTime() {
				let current = +new Date();
				let day = formatDate(current).split(' ')[0];
				this.dayTime = day + " 06:00-08:00"
			},
			//遍历JSOn数组获取值
			getAddresstext() {
				const s = this.userArea.substr(0, 2);
				const c = this.userArea.substr(0, 4);
				const q = this.userArea.substr(0, 6);
				const ss = aCityData.find(item => item.value === s);
				const cc = ss.children.find(item => item.value === c);
				const qq = cc.children.find(item => item.value === q);
				this.userAddress = ss.text + cc.text + qq.text
			},
			//创建订单信息
			async createOrder() {
				if (this.checkValue()) {
					const res = await request('/users/CreateOrder', {
						chefId: this.chefId,
						orderSubscribeTime: this.dayTime,
						orderConnectTel:this.userPhone,
						orderAddress:this.userAddress+" "+this.addressDetail,
					});
					if (res.code !== 200) {
						this.$refs.uToast.show({
							title: '订单创建失败',
							type: 'error',
							duration: '2000',
						})
					} else {
						this.$refs.uToast.show({
							title: '订单创建成功，即将跳转支付',
							type: 'success',
							duration: '2000',
						})
						let orderId=res.data.orderInfo.orderId;
						setTimeout(()=>{
							uni.navigateTo({
								url:`/pages/orderDetail/orderDetail?orderId=${orderId}`
							})
						},1000)
					}
				}else{
					this.$refs.uToast.show({
						title: '请完善订单信息',
						type: 'warning',
						duration: '2000',
					})
				}

			},
			//获取厨师详细信息
			async getChefInfo() {
				let result = await request("/common/GetChef", {
					chefId: this.chefId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `获取信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.chefInfo = result.data.chefInfo;
				}
			},
			//选择时间
			chooseTimeBtn() {
				this.$refs.chooseTime.open();
			},
			//选择器返回值
			//选择的时间
			changeTime(e) {
				this.dayTime = e.value
			},
			//检查表单值是否展示完整
			checkValue() {
				
				if (this.dayTime == "" || this.userAddress == '' || this.addressDetail == '' || this.userPhone=="") {
					return false;
				} else {
					return true;
				}
			},
			//返回厨师详情
			cancelBack() {
				uni.navigateBack();
			}

		}
	}
</script>

<style lang="less" scoped>
	.order-content {
		width: 98%;
		margin: 6px auto;

		.top-content {
			width: 100%;
			height: 160px;
			display: flex;
			justify-content: space-between;
			border: 1px solid #ccc;
			border-radius: 6px;

			.chef-img {
				width: 30%;
				height: 160px;
				display: flex;
				justify-content: center;
				align-items: center;

				.img-box {
					width: 100px;
					height: 150px;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.chef-msg {
				width: 68%;
				color: #333;

				.chef-name {
					height: 30px;
					line-height: 30px;
					font-size: 18px;
					font-weight: 550;
				}

				.chef-desc {
					padding: 0 5px;
					line-height: 20px;
					min-height: 80px;
					margin: 6px auto;
					display: -webkit-box;
					-webkit-line-clamp: 4;
					-webkit-box-orient: vertical;
					/*没置超出部分显示省略号 */
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.chef-time {
					padding: 4px 0;
				}
			}
		}
	}

	// 底部操作按钮
	.bottom-btn {
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #e6e6e6;
		display: flex;
		justify-content: space-between;

		.btn-left {
			height: 100%;
			width: 55%;
			display: flex;
			justify-content: space-around;

			.chef-price {
				width: 75%;
				height: 60px;
				display: flex;
				justify-content: center;
				align-items: center;

				.inner-box {
					width: 80%;
					height: 40px;
					line-height: 40px;
				}
			}
		}

		.btn-right {
			height: 100%;
			width: 44%;
			display: flex;
			justify-content: center;
			align-items: center;

			.btn-item {
				margin-right: 15px;
			}

		}
	}

	.order-message {
		width: 98%;
		margin: 20px auto;
		border-radius: 6px;
		border: 1px solid #ccc;

		.list-item {
			display: flex;
			height: 36px;
			padding: 4px 5px;
			box-sizing: content-box;
			border-bottom: 1px dotted rgba(0, 0, 0, 0.2);

			.label-box {
				height: 36px;
				line-height: 36px;
				width: 35%;
				padding-left: 10px;
			}

			.input-box {
				width: 65%;
				height: 36px;
				line-height: 36px;

				input {
					height: 36px;
				}

				.selected {
					height: 30px !important;
					width: 100%;
					display: flex;

					.selected-item {
						line-height: 36px;
					}
				}
			}
		}
	}
</style>