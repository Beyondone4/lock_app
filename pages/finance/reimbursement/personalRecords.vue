<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 items-center flex-clz">
			<image src="https://YourWebsite.cn/static/gonggao.png" class="image1-size diygw-image diygw-col-0" mode="widthFix"></image>
			<text class="flex icon2 diygw-col-0 icon2-clz diy-icon-right"></text>
			<view class="diygw-col-24 text18-clz diygw-ellipsis"> 报销之后记得保存原始票据(税法要求)。 </view>
		</view>
		<view v-for="(item, index) in reimbursementData.rows" :key="index" class="flex flex-wrap diygw-col-24 flex12-clz">
			<view class="flex flex-wrap diygw-col-24 items-center flex1-clz">
				<view class="diygw-col-0"> 项目： </view>
				<view class="diygw-col-0 text1-clz">
					{{ item.project }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex14-clz">
				<view class="diygw-col-0"> 原始票据： </view>
				<view class="diygw-col-0 text27-clz">
					{{ item.yuanshipiaoju }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center title-clz">
				<view class="diygw-col-0"> 标题： </view>
				<view class="diygw-col-0 text24-clz">
					{{ item.title }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex2-clz">
				<view class="diygw-col-0"> ID： </view>
				<view class="diygw-col-0">
					{{ item.id }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex4-clz">
				<view class="diygw-col-0"> 费用分类： </view>
				<view class="diygw-col-0">
					{{ item.class }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex8-clz">
				<view class="diygw-col-0"> 数据创建时间： </view>
				<view class="diygw-col-0 text17-clz">
					{{ item.createTime }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 flex3-clz">
				<view class="diygw-col-0"> 经手人： </view>
				<view class="diygw-col-0">
					{{ item.supervisor }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex6-clz">
				<view class="diygw-col-0"> 报销人： </view>
				<view class="diygw-col-0 text16-clz">
					{{ item.reimburser }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex5-clz">
				<view class="diygw-col-0"> 总价： </view>
				<view class="diygw-col-0 text14-clz">
					{{ item.priceAll }}
				</view>
				<view class="diygw-col-0 text4-clz"> 元 </view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex7-clz">
				<view class="diygw-col-0"> 审批状态： </view>
				<view class="diygw-col-0 text13-clz">
					{{ item.flowname }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex11-clz">
				<view class="diygw-col-0"> 费用产生日期： </view>
				<view class="diygw-col-0 text25-clz">
					{{ item.orderTime }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex9-clz">
				<view class="diygw-col-0"> 事件描述： </view>
				<view class="diygw-col-0 text19-clz">
					{{ item.remarks }}
				</view>
			</view>
			<view v-if="item.remarksBack !== null" class="flex flex-wrap diygw-col-24 items-center flex10-clz">
				<view class="diygw-col-0"> 退回原因： </view>
				<view class="diygw-col-0 text22-clz">
					{{ item.remarksBack }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex13-clz">
				<view class="flex diygw-col-7">
					<button @tap="navigateTo" data-type="showdetailmodelFunction" :data-index="index" class="diygw-btn blue radius-xl margin-xs button-button-clz">查看详情</button>
				</view>
				<view v-if="item.flow == '0'" class="flex flex-wrap diygw-col-9 quanxianflow-clz">
					<view class="flex diygw-col-12">
						<button @tap="navigateTo" data-type="editFunction" :data-index="index" class="diygw-btn green radius-xl margin-xs button1-button-clz">修改</button>
					</view>
					<view class="flex diygw-col-12">
						<button @tap="navigateTo" data-type="deldataApi" :data-id="item.id" class="diygw-btn red radius-xl margin-xs button-button-clz">删除</button>
					</view>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="showdetailed" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-showdetailed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 查看详情 </view>
					<view class="action" data-type="closemodal" data-id="showdetailed" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view class="flex diygw-dialog-content">
						<u-form-item class="diygw-col-24" label="收据号码" prop="receiptNum">
							<u-input :focus="receiptNumFocus" :disabled="receiptNumDisabled" class="" placeholder="" v-model="receiptNum" type="text"></u-input>
						</u-form-item>
						<image :src="form.receiptImg" class="response diygw-col-24" mode="heightFix"></image>
						<u-form-item class="diygw-col-24" label="发票号码" prop="invoiceNum">
							<u-input :focus="invoiceNumFocus" :disabled="invoiceNumDisabled" class="" placeholder="" v-model="invoiceNum" type="text"></u-input>
						</u-form-item>
						<image :src="form.invoiceImg" class="response diygw-col-24" mode="heightFix"></image>
						<u-form-item class="diygw-col-24" label="付款凭证" prop="invoiceNum">
							<u-input :focus="invoiceNumFocus" :disabled="invoiceNumDisabled" class="" placeholder="" v-model="invoiceNum" type="text"></u-input>
						</u-form-item>
						<image :src="form.payImg" class="response diygw-col-24" mode="scaleToFill"></image>
					</view>
				</view>
				<view class="flex justify-end">
					<button data-type="closemodal" @tap="navigateTo" data-id="showdetailed" class="diygw-btn red flex1 margin-xs">关闭窗口</button>
				</view>
			</view>
		</view>
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<view class="diygw-modal basic" :class="modalx" style="z-index: 900">
				<view class="diygw-dialog diygw-dialog-modalx basis-lg">
					<view class="justify-end diygw-bar">
						<view class="content"> 修改编辑 </view>
						<view class="action" data-type="closemodal" data-id="modalx" @tap="navigateTo">
							<i class="diy-icon-close"></i>
						</view>
					</view>
					<view>
						<view class="flex diygw-dialog-content">
							<u-form-item class="diygw-col-24" label="ID" prop="id">
								<u-input :focus="formData.idFocus" :disabled="formData.idDisabled" class="" placeholder="请输入名称" v-model="form.id" type="number"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="项目" prop="idProject">
								<u-input @click="formData.showIdProject = true" class="" placeholder="默认无需修改" v-model="form.idProjectLabel" type="select"></u-input>
								<u-select mode="single-column" valueName="id" labelName="title" :list="projectData.rows" :defaultValue="[form.idProjectIndex]" v-model="formData.showIdProject" @confirm="changeFormIdProject"></u-select>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="费用分类" prop="idCostClass">
								<u-input @click="formData.showIdCostClass = true" class="" placeholder="默认无需修改" v-model="form.idCostClassLabel" type="select"></u-input>
								<u-select mode="single-column" valueName="id" labelName="costClass" :list="costClass.rows" :defaultValue="[form.idCostClassIndex]" v-model="formData.showIdCostClass" @confirm="changeFormIdCostClass"></u-select>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="名称" prop="title">
								<u-input :focus="formData.titleFocus" class="" placeholder="请输入名称" v-model="form.title" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="报销人" prop="reimburser">
								<u-input :focus="formData.reimburserFocus" class="" placeholder="请填写报销人" v-model="form.reimburser" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="总价" prop="priceAll">
								<u-input :focus="formData.priceAllFocus" class="" placeholder="请输入总价" v-model="form.priceAll" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="事件描述" prop="remarks">
								<u-input :autoHeight="false" maxlength="200" height="60px" class="" placeholder="请输入事件描述" v-model="form.remarks" type="textarea"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="收据号码" prop="receiptNum">
								<u-input :focus="formData.receiptNumFocus" class="" placeholder="请输入收据号码" v-model="form.receiptNum" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="收据图" prop="receiptImg">
								<u-upload width="200" height="200" maxCount="6" @on-success="uploadFormReceiptImg" @on-remove="delFormReceiptImg" action="/sys/storage/upload" :file-list="formData.receiptImgListDatas"> </u-upload>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="发票号码" prop="invoiceNum">
								<u-input :focus="formData.invoiceNumFocus" class="" placeholder="请输入收据号码" v-model="form.invoiceNum" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="发票图" prop="invoiceImg">
								<u-upload width="200" height="200" maxCount="6" @on-success="uploadFormInvoiceImg" @on-remove="delFormInvoiceImg" action="/sys/storage/upload" :file-list="formData.invoiceImgListDatas"> </u-upload>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="付款凭证" prop="payImg">
								<u-upload width="200" height="200" maxCount="6" @on-success="uploadFormPayImg" @on-remove="delFormPayImg" action="/sys/storage/upload" :file-list="formData.payImgListDatas"> </u-upload>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="起点" prop="placeStart">
								<u-input :focus="formData.placeStartFocus" class="" placeholder="请输入起点" v-model="form.placeStart" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="终点" prop="placeEnd">
								<u-input :focus="formData.placeEndFocus" class="" placeholder="请输入终点" v-model="form.placeEnd" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="同行人" prop="personnel">
								<u-input :autoHeight="false" maxlength="200" height="100px" class="solid" placeholder="请输入同行人员" v-model="form.personnel" type="textarea"></u-input>
							</u-form-item>
						</view>
					</view>
					<view class="flex justify-end">
						<button @click="submitForm" class="diygw-btn green flex1 margin-xs">提交修改</button>
						<button data-type="closemodal" @tap="navigateTo" data-id="modalx" class="diygw-btn red flex1 margin-xs">关闭</button>
					</view>
				</view>
			</view>
		</u-form>
		<view class="clearfix"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//用户全局信息
				userInfo: {},
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: { iduser: '' },
				reimbursementData: {
					rows: [],
					code: 0,
					msg: ''
				},
				projectData: {
					rows: [
						{
							id: 0,
							sort: 0,
							title: '',
							describe: '',
							startTime: '',
							endTime: null,
							createTime: null,
							updateTime: '',
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				costClass: {
					rows: [
						{
							id: 0,
							sort: 0,
							describe: null,
							costClass: '',
							createTime: null,
							updateTime: null,
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				deldata: {
					code: 0,
					msg: ''
				},
				reimbursementUpdate: {
					code: 0,
					msg: ''
				},
				showdetailed: '',
				receiptNumDisabled: true,
				receiptNumFocus: false,
				receiptNum: '',
				invoiceNumDisabled: true,
				invoiceNumFocus: false,
				invoiceNum: '',
				invoiceNumDisabled: true,
				invoiceNumFocus: false,
				invoiceNum: '',
				modalx: '',
				form: {
					id: '',
					idProjectIndex: -1,
					idProject: '',
					idProjectLabel: '',
					idCostClassIndex: -1,
					idCostClass: '',
					idCostClassLabel: '',
					title: '',
					reimburser: '',
					priceAll: '',
					remarks: '',
					receiptNum: '',
					receiptImg: '',
					invoiceNum: '',
					invoiceImg: '',
					payImg: '',
					placeStart: '',
					placeEnd: '',
					personnel: ''
				},
				formRules: {},
				formData: {
					idDisabled: true,
					idFocus: false,
					showIdProject: false,
					showIdCostClass: false,
					titleFocus: false,
					reimburserFocus: false,
					priceAllFocus: false,
					receiptNumFocus: false,
					receiptImgListDatas: [],
					receiptImgDatas: [],
					invoiceNumFocus: false,
					invoiceImgListDatas: [],
					invoiceImgDatas: [],
					payImgListDatas: [],
					payImgDatas: [],
					placeStartFocus: false,
					placeEndFocus: false
				}
			};
		},

		onShow() {
			this.setCurrentPage(this);
		},
		onLoad(option) {
			this.setCurrentPage(this);
			if (option) {
				this.setData({
					globalOption: this.getOption(option)
				});
			}

			this.init();
		},
		onReady() {
			this.$refs.formRef?.setRules(this.formRules);
		},
		methods: {
			async init() {
				//获取iduser
				this.getNowUserIdFunction();
				await this.reimbursementDataApi();
				await this.projectDataApi();
				await this.costClassApi();
			},
			// 获取报销数据 API请求方法
			async reimbursementDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.reimbursement/getRtById';
				let http_data = {
					pageSize: param.pageSize || '10000',
					iduser: param.iduser || this.globalData.iduser
				};
				let http_header = {};

				let reimbursementData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.reimbursementData = reimbursementData;
			},
			// 获取项目分类 API请求方法
			async projectDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.project/list';
				let http_data = {
					pageSize: param.pageSize || '1000',
					orderby: param.orderby || 'sort desc'
				};
				let http_header = {};

				let projectData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.projectData = projectData;
			},
			// 报销项分类 API请求方法
			async costClassApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.costClass/list';
				let http_data = {
					orderby: param.orderby || 'sort desc',
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let costClass = await this.$http.get(http_url, http_data, http_header, 'json');

				this.costClass = costClass;
			},
			// 删除报销记录 API请求方法
			async deldataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.reimbursement/del';
				let http_data = {
					id: param.id || this.item.id
				};
				let http_header = {};

				let flag = await this.showModal('是否确认删除？');
				if (!flag) {
					//不删除
					return;
				}
				let deldata = await this.$http.post(http_url, http_data, http_header, 'json');

				this.deldata = deldata;
				this.navigateTo({
					type: 'page',
					url: 'finance/reimbursement/personalRecords'
				});
			},
			// 更新个人报销数据 API请求方法
			async reimbursementUpdateApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.reimbursement/update';
				let http_data = {};
				let http_header = {};

				let reimbursementUpdate = await this.$http.post(http_url, http_data, http_header, 'json');

				this.reimbursementUpdate = reimbursementUpdate;
			},

			// 根据当前用户ID获取报销数据 自定义方法
			async getNowUserIdFunction(param) {
				let thiz = this;
				let userinfo = this.$session.getUser();
				if (!this.$session.getUser()) {
					//比如未登录，转身到其他页面等
					this.showToast('请先登录');

					this.navigateTo({
						type: 'page',
						url: 'login'
					});
					return;
				} else {
					this.userInfo = userinfo;
					this.globalData.iduser = userinfo.id;
				}
			},

			// 修改报销数据 自定义方法
			async editFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';

				this.form = this.reimbursementData.rows[param.index];
				let thisCheckData = this.reimbursementData.rows[param.index];
				console.log(thisCheckData);
				console.log(thisCheckData.id);
				//补全ID
				this.form.id = thisCheckData.id;

				this.formData.receiptImgDatas = thisCheckData.receiptImg.split(',');
				this.formData.invoiceImgDatas = thisCheckData.invoiceImg.split(',');
				this.formData.payImgDatas = thisCheckData.payImg.split(',');

				//this.form.idProject = thisCheckData.idProject.toString()
				//this.form.idCostClass = thisCheckData.idCostClass.toString()
				//this.formData.idProject = thisCheckData.idProject.toString()
				//this.formData.idCostClass = thisCheckData.idCostClass.toString()

				//this.form.idProjectIndex = thisCheckData.idProject
				//console.log(thisCheckData.idCostClass)
				//this.form.idCostClassIndex = 3

				//console.log(this.form)
				//console.log(this.formData)
				this.navigateTo({
					type: 'openmodal',
					id: 'modalx'
				});
			},

			// 查看报销数据 自定义方法
			async showdetailmodelFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				thiz.form = '';
				thiz.form = thiz.reimbursementData.rows[param.index];
				thiz.navigateTo({
					type: 'openmodal',
					id: 'showdetailed'
				});
			},
			changeFormIdProject(evt) {
				evt.map((val, index) => {
					this.form.idProjectLabel = val.label;
					this.form.idProject = String(val.value);
					this.form.idProjectIndex = val.index;
				});
			},
			changeFormIdCostClass(evt) {
				evt.map((val, index) => {
					this.form.idCostClassLabel = val.label;
					this.form.idCostClass = String(val.value);
					this.form.idCostClassIndex = val.index;
				});
			},
			changeFormReceiptImg(lists) {
				let datas = lists
					.filter((item) => {
						return item && item.url;
					})
					.map((item) => {
						return item.url;
					});
				this.formData.receiptImgDatas = datas;
				this.formData.receiptImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.receiptImg = datas.join(',');
			},
			delFormReceiptImg(index, lists) {
				this.changeFormReceiptImg(lists);
			},
			uploadFormReceiptImg(res, index, lists, name) {
				this.changeFormReceiptImg(lists);
			},
			changeFormInvoiceImg(lists) {
				let datas = lists
					.filter((item) => {
						return item && item.url;
					})
					.map((item) => {
						return item.url;
					});
				this.formData.invoiceImgDatas = datas;
				this.formData.invoiceImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.invoiceImg = datas.join(',');
			},
			delFormInvoiceImg(index, lists) {
				this.changeFormInvoiceImg(lists);
			},
			uploadFormInvoiceImg(res, index, lists, name) {
				this.changeFormInvoiceImg(lists);
			},
			changeFormPayImg(lists) {
				let datas = lists
					.filter((item) => {
						return item && item.url;
					})
					.map((item) => {
						return item.url;
					});
				this.formData.payImgDatas = datas;
				this.formData.payImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.payImg = datas.join(',');
			},
			delFormPayImg(index, lists) {
				this.changeFormPayImg(lists);
			},
			uploadFormPayImg(res, index, lists, name) {
				this.changeFormPayImg(lists);
			},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();

				if (valid) {
					//保存数据
					let param = this.form;
					let header = {};
					let url = 'https://YourWebsite.cn/bn/api.reimbursement/update';

					let res = await this.$http.post(url, param, header, 'json');

					if (res.code == 200) {
						this.showToast(res.msg, 'success');
						setTimeout(() => {
							this.navigateTo({ id: 'modalx', type: 'closemodal' });
						}, 1500);
					} else {
						this.showModal(res.msg, '提示', false);
					}
				} else {
					console.log('验证失败');
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex-clz {
		padding-top: 15px;
		border-bottom-left-radius: 15px;
		padding-left: 15px;
		padding-bottom: 15px;
		border-top-right-radius: 15px;
		margin-right: 15px;
		background-color: #ffffff;
		margin-left: 15px;
		box-shadow: 0px 1px 3px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 15px - 15px) !important;
		border-top-left-radius: 15px;
		margin-top: 15px;
		border-bottom-right-radius: 15px;
		margin-bottom: 0px;
		padding-right: 15px;
	}
	.image1-size {
		height: 18px !important;
		width: 32px !important;
	}
	.icon2-clz {
		color: #c2c2c2;
	}
	.icon2 {
		font-size: 16px;
	}
	.text18-clz {
		flex: 1;
	}
	.flex12-clz {
		border-bottom-left-radius: 6px;
		font-size: 14px !important;
		border-top-right-radius: 6px;
		margin-right: 15px;
		background-color: rgba(0, 132, 255, 0.03);
		margin-left: 15px;
		box-shadow: 0px 1px 3px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 15px - 15px) !important;
		border-top-left-radius: 6px;
		margin-top: 15px;
		border-bottom-right-radius: 6px;
		margin-bottom: 20px;
	}
	.flex1-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		border-bottom: 1px solid #0084ff;
		padding-right: 8px;
	}
	.text1-clz {
		color: #0084ff;
	}
	.flex14-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		border-bottom: 1px solid #0084ff;
		padding-right: 8px;
	}
	.text27-clz {
		color: #0084ff;
	}
	.title-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		border-bottom: 1px solid #0084ff;
		padding-right: 8px;
	}
	.text24-clz {
		color: #0084ff;
	}
	.flex2-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex4-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex8-clz {
		border: 1px solid #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text17-clz {
		color: #ff0000;
	}
	.flex3-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex6-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text16-clz {
		color: #0084ff;
	}
	.flex5-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text14-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.text4-clz {
		margin-left: 3px;
	}
	.flex7-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text13-clz {
		color: #f70505;
	}
	.flex11-clz {
		border-top: 1px solid #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text25-clz {
		color: #ff0000;
	}
	.flex9-clz {
		border-top: 1px solid #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text19-clz {
		color: #0084ff;
	}
	.flex10-clz {
		border-top: 1px solid #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text22-clz {
		color: #ff0000;
	}
	.flex13-clz {
		border-top: 1px solid #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.button1-button-clz {
		margin: 3px !important;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.showdetailed-clz {
		z-index: 1000000;
	}
	.diygw-dialog-showdetailed {
	}
	.modalx-clz {
		z-index: 900;
	}
	.diygw-dialog-modalx {
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
