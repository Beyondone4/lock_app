<template>
	<view class="container container15293">
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24 flex-direction-column">
			<view class="flex flex-wrap diygw-col-24 flex-direction-column flex-clz">
				<u-form-item :required="true" class="diygw-col-24" label="选择项目" prop="idProject">
					<u-input @click="formData.showIdProject = true" class="" placeholder="请选择" v-model="form.idProjectLabel" type="select"></u-input>
					<u-select mode="single-column" valueName="id" labelName="title" :list="projectData.rows" :defaultValue="[form.idProjectIndex]" v-model="formData.showIdProject" @confirm="changeFormIdProject"></u-select>
				</u-form-item>
				<u-form-item :required="true" class="diygw-col-24" label="报销分类" prop="idCostClass">
					<u-input @click="formData.showIdCostClass = true" class="" placeholder="请选择" v-model="form.idCostClassLabel" type="select"></u-input>
					<u-select mode="single-column" valueName="id" labelName="costClass" :list="costClass.rows" :defaultValue="[form.idCostClassIndex]" v-model="formData.showIdCostClass" @confirm="changeFormIdCostClass"></u-select>
				</u-form-item>
				<u-form-item class="diygw-col-24" :required="true" label="报销名称" prop="title">
					<u-input :focus="formData.titleFocus" class="" placeholder="请输入报销名称" v-model="form.title" type="text"></u-input>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="数量" prop="quantity">
					<u-input :focus="formData.quantityFocus" class="" placeholder="请输入数量" v-model="form.quantity" type="number"></u-input>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="单价" prop="price">
					<u-input :focus="formData.priceFocus" class="" placeholder="请输入提示信息" v-model="form.price" type="text"></u-input>
				</u-form-item>
				<u-form-item class="diygw-col-24" :required="true" label="总价" prop="priceAll">
					<u-input :focus="formData.priceAllFocus" class="" placeholder="请输入总价（数量x单价）" v-model="form.priceAll" type="text"></u-input>
				</u-form-item>
				<u-form-item :required="true" class="diygw-col-24" label="经手人" prop="idSupervisor">
					<u-input @click="formData.showIdSupervisor = true" class="" placeholder="请选择经手人" v-model="form.idSupervisorLabel" type="select"></u-input>
					<u-select mode="single-column" valueName="id" labelName="name" :list="userControllerData.rows" :defaultValue="[form.idSupervisorIndex]" v-model="formData.showIdSupervisor" @confirm="changeFormIdSupervisor"></u-select>
				</u-form-item>
				<u-form-item class="diygw-col-24" :required="true" label="报销人" prop="reimburser">
					<u-input :focus="formData.reimburserFocus" class="" placeholder="请输入报销人姓名" v-model="form.reimburser" type="text"></u-input>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="订单时间" :required="true" prop="orderTime">
					<u-input @click="formData.showOrderTime = true" class="" placeholder="请选择订单时间" v-model="form.orderTime" type="select"></u-input>
					<u-calendar maxDate="2050-12-31" v-model="formData.showOrderTime" mode="date" @change="changeFormOrderTime"></u-calendar>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="收据号码" prop="receiptNum">
					<u-input :focus="formData.receiptNumFocus" class="" placeholder="请输入收据号码" v-model="form.receiptNum" type="text"></u-input>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="收据图片" prop="receiptImg">
					<u-upload width="200" height="200" margin="0" maxCount="1" @on-success="uploadFormReceiptImg" @on-remove="delFormReceiptImg" action="/sys/storage/upload" :file-list="formData.receiptImgListDatas"> </u-upload>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="发票号码" prop="invoiceNum">
					<u-input :focus="formData.invoiceNumFocus" class="" placeholder="请输入发票号码" v-model="form.invoiceNum" type="text"></u-input>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="发票图片" prop="invoiceImg">
					<u-upload width="200" height="200" margin="0" maxCount="1" @on-success="uploadFormInvoiceImg" @on-remove="delFormInvoiceImg" action="/sys/storage/upload" :file-list="formData.invoiceImgListDatas"> </u-upload>
				</u-form-item>
				<u-form-item labelWidth="auto" class="diygw-col-24" label="付款凭证截图" prop="payImg">
					<u-upload width="200" height="200" margin="0" maxCount="1" @on-success="uploadFormPayImg" @on-remove="delFormPayImg" action="/sys/storage/upload" :file-list="formData.payImgListDatas"> </u-upload>
				</u-form-item>
				<u-form-item v-if="form.idCostClass == 1 || form.idCostClass == 5 || form.idCostClass == 8" class="diygw-col-24" label="起点" prop="placeStart">
					<u-input :focus="formData.placeStartFocus" class="" placeholder="请输入起点名称" v-model="form.placeStart" type="text"></u-input>
				</u-form-item>
				<u-form-item v-if="form.idCostClass == 1 || form.idCostClass == 5 || form.idCostClass == 8" class="diygw-col-24" label="终点" prop="placeEnd">
					<u-input :focus="formData.placeEndFocus" class="" placeholder="请输入终点名称" v-model="form.placeEnd" type="text"></u-input>
				</u-form-item>
				<u-form-item v-if="form.idCostClass == 3 || form.idCostClass == 4" class="diygw-col-24" label="设备编号" prop="idEquipment">
					<u-input @click="formData.showIdEquipment = true" class="" placeholder="请选择" v-model="form.idEquipmentLabel" type="select"></u-input>
					<u-select mode="single-column" valueName="id" labelName="shebeibianhao" :list="equipmentData.rows" :defaultValue="[form.idEquipmentIndex]" v-model="formData.showIdEquipment" @confirm="changeFormIdEquipment"></u-select>
				</u-form-item>
				<u-form-item class="diygw-col-24" label="同行人" prop="personnel">
					<u-input :autoHeight="false" maxlength="500" height="80px" class="" placeholder="请输入同行人员信息" v-model="form.personnel" type="textarea"></u-input>
				</u-form-item>
				<u-form-item v-if="form.idCostClass == 10" class="diygw-col-24" label="公里数" prop="kilometre">
					<u-input :focus="formData.kilometreFocus" class="" placeholder="请输入公里数（数字）" v-model="form.kilometre" type="text"></u-input>
				</u-form-item>
				<u-form-item :required="true" class="diygw-col-24" label="事件描述" prop="remarks">
					<u-input :autoHeight="false" maxlength="500" height="120px" class="" placeholder="请输入报销事件详细信息" v-model="form.remarks" type="textarea"></u-input>
				</u-form-item>
				<view class="flex diygw-col-24 justify-center">
					<button @click="submitForm" class="diygw-btn green radius-xl diygw-shadow flex-sub margin-lg button-button-clz">提交报销</button>
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
				globalData: {},
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
				userControllerData: {
					rows: [
						{
							id: 10,
							name: 'XXXX',
							sort: 999,
							role: 0
						}
					],
					code: 200,
					msg: 'success'
				},
				equipmentData: {
					rows: [
						{
							id: 0,
							title: '',
							remarks: '',
							customNum: 0,
							machineNo: '',
							buyTime: '',
							createTime: '',
							updateTime: '',
							deleteTime: null
						}
					],
					total: 0,
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
				formRules: {
					idProject: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择项目'
						}
					],
					idCostClass: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择报销分类'
						}
					],
					title: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入报销名称'
						}
					],
					quantity: [
						{
							trigger: ['change', 'blur'],
							trigger: ['change', 'blur'],
							message: '请输入数字',
							type: 'number'
						}
					],
					price: [
						{
							trigger: ['change', 'blur'],
							trigger: ['change', 'blur'],
							message: '请输入单价（精确到分位）',
							type: 'number'
						}
					],
					priceAll: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入总价（精确到小数点后两位）'
						}
					],
					idSupervisor: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择经手人'
						}
					],
					reimburser: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入报销人姓名'
						}
					],
					orderTime: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择订单时间'
						}
					],
					remarks: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请填写事件描述'
						}
					]
				},
				form: {
					idProjectIndex: -1,
					idProject: '',
					idProjectLabel: '',
					idCostClassIndex: -1,
					idCostClass: '',
					idCostClassLabel: '',
					title: '',
					quantity: 1,
					price: '0',
					priceAll: '',
					idSupervisorIndex: -1,
					idSupervisor: '',
					idSupervisorLabel: '',
					reimburser: '',
					orderTime: '',
					receiptNum: '',
					receiptImg: '',
					invoiceNum: '',
					invoiceImg: '',
					payImg: '',
					placeStart: '',
					placeEnd: '',
					idEquipmentIndex: -1,
					idEquipment: '',
					idEquipmentLabel: '',
					personnel: '',
					kilometre: '',
					remarks: ''
				},
				formData: {
					showIdProject: false,
					showIdCostClass: false,
					titleFocus: false,
					quantityFocus: false,
					priceFocus: false,
					priceAllFocus: false,
					showIdSupervisor: false,
					reimburserFocus: false,
					showOrderTime: false,
					receiptNumFocus: false,
					receiptImgListDatas: [],
					receiptImgDatas: [],
					invoiceNumFocus: false,
					invoiceImgListDatas: [],
					invoiceImgDatas: [],
					payImgListDatas: [],
					payImgDatas: [],
					placeStartFocus: false,
					placeEndFocus: false,
					showIdEquipment: false,
					kilometreFocus: false
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
				await this.costClassApi();
				await this.userControllerDataApi();
				await this.equipmentDataApi();
				await this.projectDataApi();
				await this.getUserInfoFunction();
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

				let costClass = await this.$http.post(http_url, http_data, http_header, 'json');

				this.costClass = costClass;
			},
			// 获取管理者（报销经手人） API请求方法
			async userControllerDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.user/list';
				let http_data = {
					roleId: param.roleId || '1',
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let userControllerData = await this.$http.get(http_url, http_data, http_header, 'json');

				this.userControllerData = userControllerData;
			},
			// 获取设备编号 API请求方法
			async equipmentDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.equipment/list';
				let http_data = {
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let equipmentData = await this.$http.get(http_url, http_data, http_header, 'json');

				equipmentData.rows.forEach((item) => {
					item.shebeibianhao = item.customNum + '-' + item.title;
				});

				this.equipmentData = equipmentData;
			},
			// 获取项目编号 API请求方法
			async projectDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.project/list';
				let http_data = {
					orderby: param.orderby || 'sort desc',
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let projectData = await this.$http.get(http_url, http_data, http_header, 'json');

				this.projectData = projectData;
			},

			// 验证用户登录 自定义方法
			async getUserInfoFunction(param) {
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
				}
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
			changeFormIdSupervisor(evt) {
				evt.map((val, index) => {
					this.form.idSupervisorLabel = val.label;
					this.form.idSupervisor = String(val.value);
					this.form.idSupervisorIndex = val.index;
				});
			},
			changeFormOrderTime(evt) {
				this.form.orderTime = evt.result;
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
			changeFormIdEquipment(evt) {
				evt.map((val, index) => {
					this.form.idEquipmentLabel = val.label;
					this.form.idEquipment = String(val.value);
					this.form.idEquipmentIndex = val.index;
				});
			},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();

				if (valid) {
					//保存数据
					let param = this.form;
					let header = {};
					let url = '/bn/api.reimbursement/add';

					let res = await this.$http.post(url, param, header, 'json');
					this.navigateTo({
						type: 'tip',
						tip: '已提交'
					});
					if (res.code == 200) {
						this.showToast(res.msg, 'success');
						setTimeout(() => {
							this.navigateTo({ type: 'page', url: '/pages/index' });
						}, 1500);
					} else {
						this.showModal(res.msg, '提示', false);
					}
				} else {
					console.log('验证失败');
				}
			},
			resetForm() {
				this.navigateTo({ type: 'page', url: '/pages/reimbursementAll' });
			}
		}
	};
</script>

<style lang="scss" scoped>
	.button-button-clz {
		margin: 30px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
