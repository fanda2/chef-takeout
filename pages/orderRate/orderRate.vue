<template>
	<view class="content">
		<view class="rate-content">
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
			<view class="rate-box">
				<view class="rate-star">
					<view class="list-item">
						菜品味道: <u-rate count="count" current="5"></u-rate>
					</view>
					<view class="list-item">
						服务态度: <u-rate count="count" current="5"></u-rate>
					</view>
					<view class="list-item">
						出餐速度: <u-rate count="count" current="5"></u-rate>
					</view>
					<view class="list-item">
						整体评分: <u-rate count="count" current="5"></u-rate>
					</view>
				</view>
				<view class="rate-input">
					<u-input v-model="rateContent" type="textarea" :border="true" height="200"  placeholder="请输入评价内容"/>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<!-- 处于已完成状态 -->
			<view class="btn-box two">
				<view class="empty-box">
				</view>
				<view class="btn-item ">
					<u-button shape="circle" type="success" @click="createRate">发表评价</u-button>
				</view>
			</view>
		</view>
		
		<u-toast ref="uToast" />
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
				orderId:"",
				chefInfo:'',
				orderInfo:"",
				
				count: 5,
				// 评价内容
				rateContent:"",
				
				//模态框
				dialogShow:false,
				content:"",
				
			}
		},
		onLoad(option){
			this.orderId=option.orderId;
			this.getOrderInfo();
		},
		methods: {
			// 获取订单信息
			//获取订单详细信息
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
			//发布评价
			async createRateApi() {
				let result = await request("/users/CreateComment", {
					orderId: this.orderId,
					comment:this.rateContent
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `评价发布失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `订单评价成功：${result.msg}`,
						type: 'success',
						url:"/pages/order/order?tabType=2"
					})
				}
			},
			//点击发布评价，校验内容
			createRate(){
				if(this.rateContent.trim()==''){
					this.$refs.uToast.show({
						title: "请将评价信息填写完整",
						type: 'warning',
					})
				}else{
					this.dialogShow=true;
					this.content="是否发布评价？发布后不可修改";
				}
				
			},
			//点击确认按钮
			modelConfirm(){
				this.createRateApi();
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.rate-content {
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
		.rate-box{
			width: 90%;
			margin: 20px auto;
			.rate-star{
				.list-item{
					height: 30px;
					line-height: 30px;
					display: flex;
				}
			}
			.rate-input{
				
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
</style>
