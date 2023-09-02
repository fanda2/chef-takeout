<template>
	<view class="content">
		<view class="container-msg">
			<view class="dish-form">
				<u-form :model="form" ref="dishForm">
					<u-form-item label="菜品名称" prop="dishName" label-width="80px">
						<u-input v-model="form.dishName" />
					</u-form-item>
					<u-form-item label="菜品简介" prop="dishDesc" label-width="80px">
						<u-input v-model="form.dishDesc" />
					</u-form-item>
					<u-form-item label="所需材料" prop="dishMaterial" label-width="80px">
						<u-input v-model="form.dishMaterial" />
					</u-form-item>
					<u-form-item label="菜品类别" prop="dishImg" label-width="80px">
						<picker @change="bindPickerChange" :value="selectType" :range="typeList"
							:range-key="'classifyName'">
							<view v-if="typeList.length!==0" class="uni-input">{{typeList[selectType]['classifyName']}}
							</view>
						</picker>
					</u-form-item>
				</u-form>
			</view>
			<view class="cover-img">
				<view class="label-text">
					上传封面
				</view>
				<view class="choose-img" @click="chooseImg(1)">
					<image class="choose-box" v-if="dishImg.length==0" src="../../static/ico/upload-img.png"
						mode="aspectFill"></image>
					<image v-else :src="dishImg" mode="aspectFill"></image>
				</view>
			</view>
			<view class="step-list">
				<view class="list-title">
					菜品步骤
				</view>
				<view class="list-item" v-for="(item,index) in stepList" :key="index">
					<view class="item-left">
						<view class="choose-img" @click="chooseImg(2,index)">
							<image class="choose-box" v-if="item.imgUrl.length==0" src="../../static/ico/upload-img.png"
								mode="aspectFill"></image>
							<image v-else :src="item.imgUrl" mode="aspectFill"></image>
						</view>
					</view>
					<view class="item-right">
						<textarea class="textarea" v-model="item.title" placeholder="请输入步骤描述"></textarea>
						<!-- <textare  v-model="item.title" placeholder="请输入步骤描述" ></textarea> -->
					</view>
					<view class="item-control">
						<view class="btn1">
							<u-button shape="circle" type="error" size="mini" @click="deleteStep(index)">删除</u-button>
						</view>
						<view v-show="index==stepList.length-1" class="btn2">
							<u-button shape="circle" type="success" size="mini" @click="addStep">添加</u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="btn-item ">
				<u-button shape="circle" type="primary" @click="resetForm()">重置表单</u-button>
			</view>
			<view class="btn-item">
				<u-button shape="circle" type="success" @click="shareDish()">发布信息</u-button>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading type="pulse" v-if="loading"></zero-loading>
	</view>
</template>

<script>
	import {
		request,
		request_avatar
	} from "../../common/request.js"
	export default {
		data() {
			return {
				form: {
					dishName: "",
					dishDesc: "",
					dishType: "",
					dishMaterial: "",
					dishCover: "",
				},
				dishImg: "",
				stepList: [{
					title: "",
					imgUrl: ""
				}],
				loading: false,
				//菜品类别列表
				typeList: [],
				// 选中菜品
				selectType: 0,
				rules: {
					dishName: [{
						required: true,
						message: '请输入菜品名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					dishDesc: [{
						required: true,
						message: '请输入菜品描述',
						trigger: 'blur'
					}],
					dishMaterial: [{
						required: true,
						message: '请输入所需材料',
						trigger: 'blur'
					}]
				}

			}
		},
		onLoad(option) {
			this.getClassifyList();
			this.userType=option.userType;
		},
		methods: {
			//选择文件
			chooseImg(type, index) {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.uploadFile(res.tempFilePaths[0], type, index)
					}
				})
			},
			//获取分类列表
			async getClassifyList() {
				this.loading = true;
				let result = await request("/common/GetClassifyList");
				this.loading = false;
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败：' + result.msg,
						type: 'error',
					})
				} else {
					this.typeList = result.data.classifyList;
				}
			},
			//上传文件
			async uploadFile(file, type, index) {
				this.loading = true;
				const res = await request_avatar('/users/UploadFile', file);
				this.loading = false;
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: `图片上传失败：${res.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `图片上传成功：${res.msg}`,
						type: 'success',
					});
					let url = res.data.fileInfo.url;
					console.log("获取路径", url)
					//上传封面图
					if (type == 1) {
						this.dishImg = url;
					} else {
						this.stepList[index].imgUrl = url;
					}
				}
			},

			//删除步骤
			deleteStep(index) {
				if (this.stepList.length !== 1) {
					this.stepList = this.stepList.filter((item, indey) => {
						return indey !== index;
					});
				} else {
					this.$refs.uToast.show({
						title: '至少保留一个步骤',
						type: 'warning',
					})
				}
			},
			//选择器改变
			bindPickerChange(e) {
				this.selectType = e.target.value
				this.form.dishType = this.typeList[this.selectType];
			},
			//添加步骤
			addStep() {
				let obj = {
					imgUrl: "",
					title: ""
				}
				this.stepList.push(obj);
			},
			//发布菜品的API
			async shareDish() {
				if (this.checkForm()) {
					let result = await request("/users/CreateDish", {
						dishName: this.form.dishName,
						dishDesc: this.form.dishDesc,
						dishImg: this.dishImg,
						dishMaterial: this.form.dishMaterial,
						dishDetail: JSON.stringify(this.stepList),
						dishClassify: this.selectType,
						dishType:this.dishType
					});
					if(result.code!==200){
						this.$refs.uToast.show({
							title: '信息发布失败',
							type: 'error',
						})
					}else{
						this.resetForm();
						this.$refs.uToast.show({
							title: '发布成功',
							type: 'success',
							url:"/pages/index/index",
							isTab:true,
						})
					}
				} else {
					this.$refs.uToast.show({
						title: '请确保信息填写完整',
						type: 'warning',
					})
				}

			},
			//检测表单
			checkForm() {
				let flag = true;
				//表单内容校验
				this.$refs.dishForm.validate(valid => {
					if (!valid) {
						flag = false;
					}
				});
				//图片校验
				if (this.dishImg == "") {
					flag = false;
				};
				//步骤校验
				if (!this.checkStepList()) {
					flag = false;
				}
				return flag;

			},

			//遍历检查步骤是否为空
			checkStepList() {
				let flag = true;
				for (let item in this.stepList) {
					if (
						this.stepList[item].imgUrl == "" ||
						this.stepList[item].title == ""
					) {
						flag = false;
					}
				}
				return flag;
			},

			//重置表单
			resetForm() {
				this.$refs.dishForm.resetFields();
				this.stepList = [{
					imgUrl: "",
					title: ""
				}];
				this.dishImg="";
			},


		}
	}
</script>

<style lang="less" scoped>
	.container-msg {
		width: 96%;
		margin: 0 auto
	}

	.cover-img {
		width: 100%;
		height: 100px;
		margin: 10px auto;
		display: flex;

		.label-text {
			width: 80px;
			line-height: 80px;
		}

		.choose-img {
			width: 100px;
			height: 100px;
			background: #ccc;
			border-radius: 6px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.step-list {
		margin: 10px auto;

		.list-title {
			height: 50px;
			line-height: 50px;
			text-align: center;
			font-size: 28rpx;
		}

		.list-item {
			width: 98%;
			height: 120px;
			margin: 6px auto;
			border-radius: 6px;
			border: 1px solid #ccc;
			padding: 5px;
			display: flex;
			justify-content: space-between;

			.item-left {
				width: 100px;
				height: 100%;

				.choose-img {
					width: 100%;
					height: 100%;
					background: #f4f4f4;
					border-radius: 6px;
					overflow: hidden;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}

			.item-right {
				width: 50%;

				textarea {
					width: 100%;
					max-height: 100%;
					font-size: 24rpx;
				}
			}

			.item-control {
				width: 60px;
				height: 100%;
				text-align: center;
				background: #f4f4f4;
				border-radius: 4px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.btn1,
				.btn2 {
					width: 100%;
					height: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
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
		padding: 10px 20px;
		.btn-item {
			margin-right: 15px;
		}
	}
</style>