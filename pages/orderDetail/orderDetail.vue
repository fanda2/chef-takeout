<template>
	<view class="content">
		<view class="order-content">
			<view class="top-msg">
				<view class="order-status">
					{{formatStatus(orderInfo.orderStatus)}}
				</view>
			</view>
			<view class="order-message">
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
				<view class="price list-item">
					<view class="label-box">
						订单编号：
					</view>
					<view class="input-box">
						{{orderInfo.orderNo}}
					</view>
				</view>
				<view class="price list-item">
					<view class="label-box">
						订单总价：
					</view>
					<view class="input-box">
						{{orderInfo.orderPrice}}
					</view>
				</view>
				<view class="tel list-item">
					<view class="label-box">
						联系电话：
					</view>
					<view class="input-box">
						{{orderInfo.orderConnectTel}}
					</view>
				</view>
				<view class="service list-item">
					<view class="label-box">
						服务地址：
					</view>
					<view class="input-box" id="address-detail">
						{{orderInfo.orderAddress}}
					</view>
				</view>
				<view class="address list-item">
					<view class="label-box">
						预约时间：
					</view>
					<view class="input-box">
						{{orderInfo.orderSubscribeTime}}
					</view>
				</view>
				<view class="address list-item">
					<view class="label-box">
						订单创建时间：
					</view>
					<view class="input-box">
						{{orderInfo.orderCreateTime}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<!-- 处于未支付状态 -->
			<view class="btn-box one" v-if="orderInfo.orderStatus==0">
				<view class="empty-box">
				</view>
				<view class="btn-item ">
					<u-button shape="circle" @click="cancleOrder">取消订单</u-button>
				</view>
				<view class="btn-item">
					<u-button shape="circle" type="success" @click="payOrder">支付订单</u-button>
				</view>
			</view>
			<!-- 处于已支付状态 -->
			<view class="btn-box two" v-if="orderInfo.orderStatus==1">
				<view class="empty-box">
				</view>
				<view class="btn-item ">
					<u-button shape="circle" @click="cancleOrder">取消订单</u-button>
				</view>
			</view>
			<!-- 处于已完成状态 -->
			<view class="btn-box two" v-if="orderInfo.orderStatus==2">
				<view class="empty-box">
				</view>
				<view class="btn-item ">
					<u-button shape="circle" type="success" @click="goRate">评价订单</u-button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading type="pulse" v-if="loading"></zero-loading>
		<u-keyboard mode="number" v-model="popupShowPay" tips="-" @change="keyChange" @cancel="keyCancel"
			@confirm="keyConfirm" @backspace="backspace">
			<view class="input-pwd">请输入支付密码</view>
			<u-message-input mode="box" :maxlength="6" :dot-fill="true" v-model="payPassword" :disabled-keyboard="true"
				@finish="finish"></u-message-input>
		</u-keyboard>
		<!-- 模态框 -->
		<u-modal v-model="dialogShow" :content="content" :mask-close-able="true" @confirm="modelConfirm"
			:show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				loading: false,
				orderInfo: "",
				orderId: 0,
				chefInfo: "",

				//跳转来的订单属于哪一页
				orderType: 0,
				//支付密码
				payPassword: "",
				popupShowPay: false,

				//模态框展示
				dialogShow: false,
				content: "",

				//当前订单ID
				currentOrderId: 0,
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.orderType = option.orderType;
			this.getOrderInfo()

		},
		watch: {
			popupShowPay(newVal, oldVal) {
				if (!newVal) {
					this.payPassword = "";
				}
			}
		},
		methods: {
			//获取该订单信息/users/GetuserOrderList
			//获取厨师详细信息
			async getOrderInfo() {
				let result = await request("/users/GetUserOrder", {
					orderId: this.orderId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `获取信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.orderInfo = result.data.orderInfo;
					this.chefInfo = result.data.orderInfo.chefInfo;
				}
			},
			//根据订单的不同状态返回不同的文字
			formatStatus(val) {
				switch (val) {
					case 0:
						return "未支付";
					case 1:
						return "已支付"
					case 2:
						return "待评价"
					case 3:
						return "已完成"
					default:
						return "---"
				}
			},
			//取消订单
			async cancleOrderAip() {
				let result = await request("/users/CancelUserOrder", {
					orderId: this.orderId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `取消订单失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `取消成功：${result.msg}`,
						type: 'success',
						url: '/pages/order/order?tabType=0'
					})
				}
			},
			//支付订单接口
			async payOrderApi() {
				let result = await request("/users/Pay", {
					orderId: this.orderId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `支付失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `支付成功：${result.msg}`,
						type: 'success',
						url: '/pages/order/order?tabType=0'
					})
				}
			},
			//确认框确认按钮
			modelConfirm() {
				this.cancleOrderAip();
			},
			//点击取消订单按钮
			cancleOrder() {
				this.dialogShow = true;
				this.content = "是否取消该订单？";
			},
			//点击支付订单按钮
			payOrder() {
				this.popupShowPay = true;
			},
			//点击关闭支付键盘
			keyCancel() {
				console.log("点击关闭支付键盘")
			},
			//发生变化
			keyChange(val) {
				this.payPassword = this.payPassword + val;
			},
			//键盘点击确认
			keyConfirm() {
				if (this.payPassword.length !== 6) {
					this.popupShowPay = true;
					this.$refs.uToast.show({
						title: `请填写完整密码`,
						type: 'warning',
					})
				} else {
					this.payOrderApi();
				}
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if (this.payPassword.length)
					this.payPassword = this.payPassword.substr(0, this.payPassword.length - 1);
			},
			//进入订单评价界面
			goRate(){
				uni.navigateTo({
					url:`/pages/orderRate/orderRate?orderId=${this.orderId}`
				})
			}



		}
	}
</script>

<style lang="less" scoped>
	.order-content {
		width: 100%;

		.top-msg {
			width: 100%;
			height: 300px;
			background: #f55353;

			.order-status {
				width: 96%;
				margin: 0 auto;
				height: 100px;
				color: white;
				font-size: 32px;
				font-weight: bold;
				letter-spacing: 3px;
				padding: 20px;

			}
		}

		.order-message {
			width: 94%;
			position: absolute;
			top: 100px;
			left: 3%;
			min-height: 450px;
			background: #f5f5f5;
			border: 1px solid #f5f5f5;
			border-radius: 6px;

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

			.list-item {
				display: flex;
				min-height: 36px;
				padding: 4px 5px;
				box-sizing: content-box;
				border-bottom: 1px dotted rgba(0, 0, 0, 0.2);

				.label-box {
					height: 36px;
					line-height: 36px;
					width: 35%;
					padding-left: 10px;
				}

				#address-detail {
					font-size: 14px;
					height: auto;

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
	}

	// 底部操作按钮
	.bottom-btn {
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #e6e6e6;
	    .btn-box{
			display: flex;
			justify-content: space-between;
			padding: 10px 5px;
			.empty-box {
				width: 30%;
			}
			.btn-item {
				width: 34%;
				margin-right: 15px;
			}
		}
	
	}

	//输入密码
	.input-pwd {
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 100%;

	}
</style>