<template>
	<view class="container container15293">
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<u-form-item :required="true" class="diygw-col-24" label="供应商" prop="supplier">
				<u-input @click="formData.showSupplier = true" class="" placeholder="请选择供应商" v-model="form.supplierLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.supplier" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="title" :list="supplierData.data.data" v-model="formData.showSupplier" @confirm="changeFormSupplier"></diy-select>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="项目" prop="idProject">
				<u-input @click="formData.showIdProject = true" class="" placeholder="请选择项目" v-model="form.idProjectLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.idProject" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="title" :list="projectData.rows" v-model="formData.showIdProject" @confirm="changeFormIdProject"></diy-select>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="费用分类" prop="consumeClass">
				<u-input @click="formData.showConsumeClass = true" class="" placeholder="请选择费用分类" v-model="form.consumeClassLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.consumeClass" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="title" :list="consumeData.rows" v-model="formData.showConsumeClass" @confirm="changeFormConsumeClass"></diy-select>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="采购申请人" prop="aPrincipal">
				<u-input @click="formData.showAPrincipal = true" class="" placeholder="我方实际申请采购的人员" v-model="form.aPrincipalLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.aPrincipal" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="name" :list="userControllerData.rows" v-model="formData.showAPrincipal" @confirm="changeFormAPrincipal"></diy-select>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="我方经手人" prop="aSupervisor">
				<u-input @click="formData.showASupervisor = true" class="" placeholder="实际接收本单据的人员" v-model="form.aSupervisorLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.aSupervisor" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="name" :list="userControllerData.rows" v-model="formData.showASupervisor" @confirm="changeFormASupervisor"></diy-select>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="审批人" prop="authorized">
				<u-input @click="formData.showAuthorized = true" class="" placeholder="谁授权的采购" v-model="form.authorizedLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.authorized" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="name" :list="userControllerData.rows" v-model="formData.showAuthorized" @confirm="changeFormAuthorized"></diy-select>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="金额" prop="money">
				<u-input :focus="formData.moneyFocus" class="" placeholder="请输入单据总金额" v-model="form.money" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="日期" :required="true" prop="date">
				<u-input @click="formData.showDate = true" class="" placeholder="请选择申请采购的日期" v-model="form.date" type="select"></u-input>
				<u-calendar maxDate="2050-12-31" v-model="formData.showDate" mode="date" @change="changeFormDate"></u-calendar>
			</u-form-item>
			<u-form-item :required="true" labelClass="text-red" class="diygw-col-24" label="备注" labelPosition="top" prop="remarks">
				<u-input :autoHeight="false" maxlength="200" height="120px" class="" placeholder="请输入该单据的备注信息（例如：是什么耗材，为什么需要！大致写一下，便于财务部门审核） 如果是预申请单，填写好必填项即可直接点击提交" v-model="form.remarks" type="textarea"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="对方经手人" prop="bSupervisor">
				<u-input :focus="formData.bSupervisorFocus" class="" placeholder="送来单据的人员姓名" v-model="form.bSupervisor" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="对方经手人电话" prop="bPhone">
				<u-input :focus="formData.bPhoneFocus" class="" placeholder="请留下对方经手人的联系电话" v-model="form.bPhone" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="对方负责人" prop="bPrincipal">
				<u-input :focus="formData.bPrincipalFocus" class="" placeholder="对方负责人（店长，财务，老板）" v-model="form.bPrincipal" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="对方负责人电话" prop="bPrincipalPhone">
				<u-input :focus="formData.bPrincipalPhoneFocus" class="" placeholder="请输入对方负责人电话" v-model="form.bPrincipalPhone" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="单据编号" prop="number">
				<u-input :focus="formData.numberFocus" class="" placeholder="请输入单据编号（纯数字）" v-model="form.number" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="单据图" prop="billImg">
				<u-upload width="200" height="200" maxCount="6" @on-success="uploadFormBillImg" @on-remove="delFormBillImg" action="/sys/storage/upload" :file-list="formData.billImgListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="实物图" prop="substanceImg">
				<u-upload width="200" height="200" margin="0" maxCount="1" @on-success="uploadFormSubstanceImg" @on-remove="delFormSubstanceImg" action="/sys/storage/upload" :file-list="formData.substanceImgListDatas"> </u-upload>
			</u-form-item>
			<view class="diygw-col-24 text-clz diygw-text-md text-red"> 提醒：一定要保留好原始单据，并且尽快安排送回公司总部 </view>
			<view class="flex diygw-col-24 button-clz">
				<button @click="submitForm" class="diygw-btn red radius-xl diygw-shadow flex-sub margin-xs button-button-clz">提交</button>
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
				userControllerData: {
					rows: [
						{
							id: 0,
							username: null,
							phone: '',
							password: '',
							name: '',
							sort: 0,
							role: 0,
							identityCard: '',
							roleId: 0,
							createTime: '',
							updateTime: '',
							deleteTime: null,
							loginTime: ''
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
							startTime: null,
							endTime: null,
							createTime: '',
							updateTime: '',
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				consumeData: {
					rows: [
						{
							id: 0,
							title: '',
							sort: 0,
							createTime: '',
							updateTime: null,
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				supplierData: {
					code: 0,
					msg: '',
					data: {
						data: [
							{
								id: 0,
								title: ''
							}
						],
						total: 0
					}
				},
				formRules: {
					supplier: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择供应商'
						}
					],
					idProject: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择对应的项目'
						}
					],
					consumeClass: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择费用分类'
						}
					],
					aPrincipal: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择实际申请采购的人员'
						}
					],
					aSupervisor: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择实际接收本单据的人员'
						}
					],
					authorized: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择授权人'
						}
					],
					money: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请填写当前单据的总金额'
						}
					],
					date: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择申请采购的日期'
						}
					],
					remarks: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '备注不能为空哟'
						}
					],
					bPhone: [
						{
							trigger: ['change', 'blur'],
							message: '请填写对方经手人的联系电话',
							pattern: /^1[3-9]\d{9}$/
						}
					]
				},
				form: {
					supplier: '',
					supplierLabel: '',
					idProject: '',
					idProjectLabel: '',
					consumeClass: '',
					consumeClassLabel: '',
					aPrincipal: '',
					aPrincipalLabel: '',
					aSupervisor: '',
					aSupervisorLabel: '',
					authorized: '',
					authorizedLabel: '',
					money: '',
					date: '',
					remarks: '',
					bSupervisor: '',
					bPhone: '',
					bPrincipal: '',
					bPrincipalPhone: '',
					number: '',
					billImg: '',
					substanceImg: ''
				},
				formData: {
					showSupplier: false,
					showIdProject: false,
					showConsumeClass: false,
					showAPrincipal: false,
					showASupervisor: false,
					showAuthorized: false,
					moneyFocus: false,
					showDate: false,
					bSupervisorFocus: false,
					bPhoneFocus: false,
					bPrincipalFocus: false,
					bPrincipalPhoneFocus: false,
					numberFocus: false,
					billImgListDatas: [],
					billImgDatas: [],
					substanceImgListDatas: [],
					substanceImgDatas: []
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
				await this.userControllerDataApi();
				await this.projectDataApi();
				await this.consumeDataApi();
				await this.supplierDataApi();
				await this.checkLoginFunction();
			},
			// 员工列表 API请求方法
			async userControllerDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.user/list';
				let http_data = {
					roleId: param.roleId || '1',
					pageSize: param.pageSize || '1000',
					orderby: param.orderby || 'sort desc'
				};
				let http_header = {};

				let userControllerData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.userControllerData = userControllerData;
			},
			// 获取项目分类 API请求方法
			async projectDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.project/list';
				let http_data = {
					pageSize: param.pageSize || '1000',
					orderby: param.orderby || 'sort desc'
				};
				let http_header = {};

				let projectData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.projectData = projectData;
			},
			// 耗材分类 API请求方法
			async consumeDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.consume/list';
				let http_data = {
					orderby: param.orderby || 'sort desc',
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let consumeData = await this.$http.get(http_url, http_data, http_header, 'json');

				this.consumeData = consumeData;
			},
			// 供应商列表 API请求方法
			async supplierDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.supplier/getlist';
				let http_data = {};
				let http_header = {};

				let supplierData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.supplierData = supplierData;
			},

			// 验证登录态 自定义方法
			async checkLoginFunction(param) {
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
			changeFormSupplier(evt) {
				this.form.supplier = evt.id;
				this.form.supplierLabel = evt.title;
			},
			changeFormIdProject(evt) {
				this.form.idProject = evt.id;
				this.form.idProjectLabel = evt.title;
			},
			changeFormConsumeClass(evt) {
				this.form.consumeClass = evt.id;
				this.form.consumeClassLabel = evt.title;
			},
			changeFormAPrincipal(evt) {
				this.form.aPrincipal = evt.id;
				this.form.aPrincipalLabel = evt.name;
			},
			changeFormASupervisor(evt) {
				this.form.aSupervisor = evt.id;
				this.form.aSupervisorLabel = evt.name;
			},
			changeFormAuthorized(evt) {
				this.form.authorized = evt.id;
				this.form.authorizedLabel = evt.name;
			},
			changeFormDate(evt) {
				this.form.date = evt.result;
			},
			changeFormBillImg(lists) {
				let datas = lists
					.filter((item) => {
						return item && item.url;
					})
					.map((item) => {
						return item.url;
					});
				this.formData.billImgDatas = datas;
				this.formData.billImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.billImg = datas.join(',');
			},
			delFormBillImg(index, lists) {
				this.changeFormBillImg(lists);
			},
			uploadFormBillImg(res, index, lists, name) {
				this.changeFormBillImg(lists);
			},
			changeFormSubstanceImg(lists) {
				let datas = lists
					.filter((item) => {
						return item && item.url;
					})
					.map((item) => {
						return item.url;
					});
				this.formData.substanceImgDatas = datas;
				this.formData.substanceImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.substanceImg = datas.join(',');
			},
			delFormSubstanceImg(index, lists) {
				this.changeFormSubstanceImg(lists);
			},
			uploadFormSubstanceImg(res, index, lists, name) {
				this.changeFormSubstanceImg(lists);
			},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();

				if (valid) {
					//保存数据
					let param = this.form;
					let header = {};
					let url = 'https://YourWebsite.cn/bn/api.reconciliation/add';

					let res = await this.$http.post(url, param, header, 'json');
					this.navigateTo({
						type: 'tip',
						tip: '已提交'
					});
					if (res.code == 200) {
						this.showToast(res.msg, 'success');
						setTimeout(() => {
							this.navigateTo({ type: 'page', url: '/pages/finance/enterprise/reconciliationlist' });
						}, 1500);
					} else {
						this.showModal(res.msg, '提示', false);
					}
				} else {
					console.log('验证失败');
				}
			},
			resetForm() {
				this.navigateTo({ type: 'page', url: '/pages/finance/enterprise/reconciliation' });
			}
		}
	};
</script>

<style lang="scss" scoped>
	.text-clz {
		padding-top: 10px;
		border-bottom-left-radius: 6px;
		font-weight: bold;
		padding-left: 10px;
		padding-bottom: 10px;
		border-top-right-radius: 6px;
		margin-right: 5px;
		margin-left: 5px;
		overflow: hidden;
		width: calc(100% - 5px - 5px) !important;
		border-top-left-radius: 6px;
		margin-top: 5px;
		border-bottom-right-radius: 6px;
		margin-bottom: 15px;
		padding-right: 10px;
	}
	.button-clz {
		margin-left: 5px;
		padding-top: 5px;
		padding-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		padding-bottom: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
		padding-right: 5px;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
