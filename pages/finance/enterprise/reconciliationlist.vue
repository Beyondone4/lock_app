<template>
	<view class="container container15293">
		<view class="flex diygw-col-24">
			<u-subsection class="diygw-col-24" :list="usubsectionList" bg-color="#eeeeef" height="80" button-color="#ffffff" active-color="#07c160" inactive-color="#606266" :current="usubsection" @change="changeUsubsection"></u-subsection>
		</view>
		<view v-for="(item, index) in reconciliationData.rows" :key="index" class="flex flex-wrap diygw-col-24 flex12-clz">
			<view class="flex flex-wrap diygw-col-24 items-center flex1-clz">
				<view class="diygw-col-0"> 项目： </view>
				<view class="diygw-col-0 text1-clz">
					{{ item.projectcn }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex14-clz">
				<view class="diygw-col-0"> 供应商： </view>
				<view class="diygw-col-0 text27-clz">
					{{ item.suppliercn }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex8-clz">
				<view class="diygw-col-0"> 创建时间： </view>
				<view class="diygw-col-0 text17-clz">
					{{ item.createTime }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center idfy-clz">
				<view class="flex flex-wrap diygw-col-12 items-center flex2-clz">
					<view class="diygw-col-0"> 序号ID： </view>
					<view class="diygw-col-0">
						{{ item.id }}
					</view>
				</view>
				<view class="flex flex-wrap diygw-col-12 items-center flex4-clz">
					<view class="diygw-col-0"> 费用分类： </view>
					<view class="diygw-col-0">
						{{ item.consumecn }}
					</view>
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex-clz">
				<view class="flex flex-wrap diygw-col-12 items-center flex5-clz">
					<view class="diygw-col-0"> 总价： </view>
					<view class="diygw-col-0 text14-clz">
						{{ item.money }}
					</view>
					<view class="diygw-col-0 text4-clz"> 元 </view>
				</view>
				<view class="flex flex-wrap diygw-col-12 items-center flex7-clz">
					<view class="diygw-col-0"> 审批人： </view>
					<view class="diygw-col-0 text13-clz">
						{{ item.authorizedcn }}
					</view>
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex15-clz">
				<view class="flex flex-wrap diygw-col-12 flex3-clz">
					<view class="diygw-col-0"> 我方经手人： </view>
					<view class="diygw-col-0 text7-clz">
						{{ item.aSupervisorcn }}
					</view>
				</view>
				<view class="flex flex-wrap diygw-col-12 items-center flex6-clz">
					<view class="diygw-col-0"> 采购申请人： </view>
					<view class="diygw-col-0 text16-clz">
						{{ item.aPrincipalcn }}
					</view>
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex17-clz">
				<view class="flex flex-wrap diygw-col-12 items-center flex18-clz">
					<view class="diygw-col-0"> 对方经手人： </view>
					<view class="diygw-col-0">
						{{ item.bSupervisor }}
					</view>
				</view>
				<view class="flex flex-wrap diygw-col-12 items-center flex19-clz">
					<view class="diygw-col-0"> 电话： </view>
					<view class="diygw-col-0">
						{{ item.bPhone }}
					</view>
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex20-clz">
				<view class="flex flex-wrap diygw-col-12 items-center flex21-clz">
					<view class="diygw-col-0"> 对方负责人： </view>
					<view class="diygw-col-0">
						{{ item.bPrincipal }}
					</view>
				</view>
				<view class="flex flex-wrap diygw-col-12 items-center flex22-clz">
					<view class="diygw-col-0"> 电话： </view>
					<view class="diygw-col-0">
						{{ item.bPrincipalPhone }}
					</view>
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex11-clz">
				<view class="diygw-col-0"> 订单日期： </view>
				<view class="diygw-col-0 text25-clz">
					{{ item.date }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex16-clz">
				<view class="diygw-col-0"> 流程状态： </view>
				<view class="diygw-col-0 text36-clz">
					{{ item.flowcn }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex9-clz">
				<view class="diygw-col-0"> 备注说明： </view>
				<view class="diygw-col-0 text19-clz">
					{{ item.remarks }}
				</view>
			</view>
			<view v-if="item.flow == 2" class="flex flex-wrap diygw-col-24 items-center flex10-clz">
				<view class="diygw-col-0"> 退回原因： </view>
				<view class="diygw-col-0 text22-clz">
					{{ item.remarksBack }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex13-clz">
				<view v-if="item.flow !== '4'" class="flex flex-wrap diygw-col-24 quanxianflow-clz">
					<view class="flex diygw-col-24">
						<button @tap="navigateTo" data-type="showReconciliationFunction" :data-index="index" class="diygw-btn green radius-xl margin-xs editaction-button-clz">修改</button>
					</view>
				</view>
			</view>
		</view>
		<u-form :model="formedit" :rules="formeditRules" :errorType="['message', 'toast']" ref="formeditRef" class="flex diygw-form diygw-col-24">
			<view class="diygw-modal basic" :class="modelx" style="z-index: 900">
				<view class="diygw-dialog diygw-dialog-modelx basis-xl">
					<view class="justify-end diygw-bar">
						<view class="content"> 修改编辑 </view>
						<view class="action" data-type="closemodal" data-id="modelx" @tap="navigateTo">
							<i class="diy-icon-close"></i>
						</view>
					</view>
					<view>
						<view class="flex diygw-dialog-content">
							<view class="flex diygw-col-24">
								<button @tap="navigateTo" data-type="page" data-url="/pages/finance/enterprise/reconciliationlist" class="diygw-btn red xs radius flex-sub margin-xs button-button-clz">关闭窗口</button>
							</view>
							<u-form-item class="diygw-col-24" label="ID" prop="id">
								<u-input :focus="formeditData.idFocus" :disabled="formeditData.idDisabled" class="" placeholder="请输入名称" v-model="formedit.id" type="number"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="项目" prop="idProject">
								<u-input @click="formeditData.showIdProject = true" class="" placeholder="默认无须更改" v-model="formedit.idProjectLabel" type="select"></u-input>
							</u-form-item>
							<diy-select mode="radio" :radioValue="formedit.idProject" activeColor="#39b54a" placeholder="默认无须更改" valueName="id" labelName="title" :list="projectData.rows" v-model="formeditData.showIdProject" @confirm="changeFormeditIdProject"></diy-select>
							<u-form-item class="diygw-col-24" label="费用分类" prop="consumeClass">
								<u-input @click="formeditData.showConsumeClass = true" class="" placeholder="默认无须更改" v-model="formedit.consumeClassLabel" type="select"></u-input>
							</u-form-item>
							<diy-select mode="radio" :radioValue="formedit.consumeClass" activeColor="#39b54a" placeholder="请选择费用分类" valueName="id" labelName="title" :list="consumeData.rows" v-model="formeditData.showConsumeClass" @confirm="changeFormeditConsumeClass"></diy-select>
							<u-form-item class="diygw-col-24" label="供应商" prop="supplier">
								<u-input @click="formeditData.showSupplier = true" class="" placeholder="默认无须更改" v-model="formedit.supplierLabel" type="select"></u-input>
							</u-form-item>
							<diy-select mode="radio" :radioValue="formedit.supplier" activeColor="#39b54a" placeholder="默认无须更改" valueName="id" labelName="title" :list="supplierData.data.data" v-model="formeditData.showSupplier" @confirm="changeFormeditSupplier"></diy-select>
							<u-form-item :required="true" class="diygw-col-24" label="采购申请人" prop="aPrincipal">
								<u-input @click="formeditData.showAPrincipal = true" class="" placeholder="我方实际申请采购的人员" v-model="formedit.aPrincipalLabel" type="select"></u-input>
							</u-form-item>
							<diy-select mode="radio" :radioValue="formedit.aPrincipal" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="name" :list="userControllerData.rows" v-model="formeditData.showAPrincipal" @confirm="changeFormeditAPrincipal"></diy-select>
							<u-form-item :required="true" class="diygw-col-24" label="我方经手人" prop="aSupervisor">
								<u-input @click="formeditData.showASupervisor = true" class="" placeholder="实际接收本单据的人员" v-model="formedit.aSupervisorLabel" type="select"></u-input>
							</u-form-item>
							<diy-select mode="radio" :radioValue="formedit.aSupervisor" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="name" :list="userControllerData.rows" v-model="formeditData.showASupervisor" @confirm="changeFormeditASupervisor"></diy-select>
							<u-form-item :required="true" class="diygw-col-24" label="审批人" prop="authorized">
								<u-input @click="formeditData.showAuthorized = true" class="" placeholder="谁授权的采购" v-model="formedit.authorizedLabel" type="select"></u-input>
							</u-form-item>
							<diy-select mode="radio" :radioValue="formedit.authorized" activeColor="#39b54a" placeholder="请输入搜索关键词" valueName="id" labelName="name" :list="userControllerData.rows" v-model="formeditData.showAuthorized" @confirm="changeFormeditAuthorized"></diy-select>
							<u-form-item class="diygw-col-24" :required="true" label="金额" prop="money">
								<u-input :focus="formeditData.moneyFocus" class="" placeholder="请输入单据总金额" v-model="formedit.money" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="日期" :required="true" prop="date">
								<u-input @click="formeditData.showDate = true" class="" placeholder="请选择申请采购的日期" v-model="formedit.date" type="select"></u-input>
							</u-form-item>
							<u-calendar maxDate="2050-12-31" v-model="formeditData.showDate" mode="date" @change="changeFormeditDate"></u-calendar>
							<u-form-item :required="true" labelClass="text-red" class="diygw-col-24" label="备注" labelPosition="top" prop="remarks">
								<u-input :autoHeight="false" maxlength="200" height="120px" class="solid" placeholder="请输入该单据的备注信息（例如：是什么耗材，为什么需要！大致写一下，便于财务部门审核）" v-model="formedit.remarks" type="textarea"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="对方经手人" prop="bSupervisor">
								<u-input :focus="formeditData.bSupervisorFocus" class="" placeholder="送来单据的人员姓名" v-model="formedit.bSupervisor" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="对方经手人电话" prop="bPhone">
								<u-input :focus="formeditData.bPhoneFocus" class="" placeholder="请留下对方经手人的联系电话" v-model="formedit.bPhone" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="对方负责人" prop="bPrincipal">
								<u-input :focus="formeditData.bPrincipalFocus" class="" placeholder="对方负责人（店长，财务，老板）" v-model="formedit.bPrincipal" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="对方负责人电话" prop="bPrincipalPhone">
								<u-input :focus="formeditData.bPrincipalPhoneFocus" class="" placeholder="请输入对方负责人电话" v-model="formedit.bPrincipalPhone" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="单据编号" prop="number">
								<u-input :focus="formeditData.numberFocus" class="" placeholder="请输入单据编号（纯数字）" v-model="formedit.number" type="text"></u-input>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="单据图" prop="billImg">
								<u-upload maxCount="6" @on-success="uploadFormeditBillImg" @on-remove="delFormeditBillImg" action="/sys/storage/upload" :file-list="formeditData.billImgListDatas"> </u-upload>
							</u-form-item>
							<u-form-item class="diygw-col-24" label="实物图" prop="substanceImg">
								<u-upload margin="0" maxCount="1" @on-success="uploadFormeditSubstanceImg" @on-remove="delFormeditSubstanceImg" action="/sys/storage/upload" :file-list="formeditData.substanceImgListDatas"> </u-upload>
							</u-form-item>
							<view class="diygw-col-24 text23-clz diygw-text-md text-red"> 提醒：一定要保留好原始单据，并且尽快安排送回公司总部 </view>
						</view>
					</view>
					<view class="flex justify-end">
						<button @click="submitFormedit" class="diygw-btn green flex1 margin-xs">提交</button>
						<button @tap="navigateTo" data-type="page" data-url="/pages/finance/enterprise/reconciliationlist" class="diygw-btn red flex1 margin-xs">关闭</button>
					</view>
				</view>
			</view>
		</u-form>
		<view class="flex diygw-col-0 right-bottom floatbar-clz">
			<view class="diygw-grid diygw-actions">
				<button @tap="navigateTo" data-type="page" data-url="/pages/index" class="diygw-action">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar">
							<image mode="aspectFit" class="diygw-avatar-img" src="/static/grid1.png"></image>
						</view>
						<view class="diygw-grid-title"> 返回首页 </view>
					</view>
				</button>
			</view>
		</view>
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
				reconciliationData: {
					rows: [
						{
							id: 0,
							supplier: 0,
							number: '1',
							money: '23123',
							date: 'asda',
							remarks: 'asda',
							authorized: 0,
							flow: '',
							projectcn: 'asdad',
							consumecn: 'asda',
							suppliercn: 'asdasd',
							aSupervisor: 0,
							bSupervisor: 'asdad',
							bPhone: 'asda',
							aPrincipal: 0,
							bPrincipal: 'asdad',
							consumeClass: 0,
							billImg: 'asdad',
							substanceImg: 'asda',
							idProject: 0,
							bPrincipalPhone: 'asda',
							createTime: 'asda',
							updateTime: 'sadadszx',
							deleteTime: 'xzcf',
							remarksBack: 'adas',
							authorizedcn: 'sada',
							aSupervisorcn: 'asda',
							aPrincipalcn: 'sada',
							flowcn: 'dadad'
						}
					],
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
				usubsectionList: [{ name: '与我相关的单据' }],
				usubsection: 1,
				modelx: '',
				formeditRules: {
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
				formeditData: {
					idDisabled: true,
					idFocus: false,
					showIdProject: false,
					showConsumeClass: false,
					showSupplier: false,
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
				},
				formedit: {
					id: '',
					idProject: '',
					idProjectLabel: '',
					consumeClass: '',
					consumeClassLabel: '',
					supplier: '',
					supplierLabel: '',
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
				}
			};
		},

		onShow() {
			this.setCurrentPage(this);
		},
		async onLoad(option) {
			this.setCurrentPage(this);
			if (option) {
				this.setData({
					globalOption: this.getOption(option)
				});
			}

			this.init();
		},
		onReady() {
			this.$refs.formeditRef?.setRules(this.formeditRules);
		},
		methods: {
			async init() {
				//获取iduser
				await this.getNewUserIdFunction();
				await this.reconciliationDataApi();
				await this.projectDataApi();
				await this.consumeDataApi();
				await this.supplierDataApi();
				await this.userControllerDataApi();
			},
			// 公司付款单数据 API请求方法
			async reconciliationDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.reconciliation/getReconciliationList';
				let http_data = {
					iduser: param.iduser || this.globalData.iduser,
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let reconciliationData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.reconciliationData = reconciliationData;
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

			// 验证登录并获取用户id 自定义方法
			async getNewUserIdFunction(param) {
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

			// 弹出修改公司付款单 自定义方法
			async showReconciliationFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化，清空
				console.log('param', param.index);
				console.log('reconciliationData', this.reconciliationData.rows);
				console.log('data-index', this.reconciliationData.rows[param.index]);
				this.formedit = [];
				this.formeditData = [];

				//赋值
				let thisCheckData = this.reconciliationData.rows[param.index];
				this.formedit = thisCheckData;

				//转换下拉选项的数据类型为字符串，便于程序识别
				this.formedit.idProject = thisCheckData.idProject.toString();
				this.formedit.supplier = thisCheckData.supplier.toString();
				this.formedit.consumeClass = thisCheckData.consumeClass.toString();
				this.formedit.aPrincipal = thisCheckData.aPrincipal.toString();
				this.formedit.aSupervisor = thisCheckData.aSupervisor.toString();
				this.formedit.authorized = thisCheckData.authorized.toString();

				//下拉选项显示的中文名称
				this.formedit.idProjectLabel = thisCheckData.projectcn;
				this.formedit.supplierLabel = thisCheckData.suppliercn;
				this.formedit.consumeClassLabel = thisCheckData.consumecn;
				this.formedit.aPrincipalLabel = thisCheckData.aPrincipalcn;
				this.formedit.aSupervisorLabel = thisCheckData.aSupervisorcn;
				this.formedit.authorizedLabel = thisCheckData.authorizedcn;

				//图片处理
				if (thisCheckData.billImg !== '') {
					console.log('billImg图片不为空');
					this.formedit.billImg = thisCheckData.billImg;
					this.formeditData.billImgDatas = thisCheckData.billImg.split(',');
					//封装成组件需要的格式
					this.formeditData.billImgListDatas = this.formeditData.billImgDatas.map((item) => {
						return { url: item };
					});
				} else {
					console.log('billImg图片为空');
					this.formedit.billImg = '';
					this.formeditData.billImgDatas = [];
					this.formeditData.billImgListDatas = [];
				}

				if (thisCheckData.substanceImg !== '') {
					this.formedit.substanceImg = thisCheckData.substanceImg;
					this.formeditData.substanceImgDatas = thisCheckData.substanceImg.split(',');
					//封装成组件需要的格式
					this.formeditData.substanceImgListDatas = this.formeditData.substanceImgDatas.map((item) => {
						return { url: item };
					});
				} else {
					this.formedit.substanceImg = '';
					this.formeditData.substanceImgDatas = [];
					this.formeditData.substanceImgListDatas = [];
				}

				console.log('formedit', this.formedit);
				console.log('formeditData', this.formeditData);

				this.navigateTo({
					type: 'openmodal',
					id: 'modelx'
				});
			},
			changeUsubsection(evt) {
				this.usubsection = evt;
			},
			changeFormeditIdProject(evt) {
				this.formedit.idProject = evt.id;
				this.formedit.idProjectLabel = evt.title;
			},
			changeFormeditConsumeClass(evt) {
				this.formedit.consumeClass = evt.id;
				this.formedit.consumeClassLabel = evt.title;
			},
			changeFormeditSupplier(evt) {
				this.formedit.supplier = evt.id;
				this.formedit.supplierLabel = evt.title;
			},
			changeFormeditAPrincipal(evt) {
				this.formedit.aPrincipal = evt.id;
				this.formedit.aPrincipalLabel = evt.name;
			},
			changeFormeditASupervisor(evt) {
				this.formedit.aSupervisor = evt.id;
				this.formedit.aSupervisorLabel = evt.name;
			},
			changeFormeditAuthorized(evt) {
				this.formedit.authorized = evt.id;
				this.formedit.authorizedLabel = evt.name;
			},
			changeFormeditDate(evt) {
				this.formedit.date = evt.result;
			},
			changeFormeditBillImg(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formeditData.billImgDatas = datas;
				this.formeditData.billImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.formedit.billImg = datas.join(',');
			},
			delFormeditBillImg(index, lists) {
				this.changeFormeditBillImg(lists);
			},
			uploadFormeditBillImg(res, index, lists, name) {
				this.changeFormeditBillImg(lists);
			},
			changeFormeditSubstanceImg(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formeditData.substanceImgDatas = datas;
				this.formeditData.substanceImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.formedit.substanceImg = datas.join(',');
			},
			delFormeditSubstanceImg(index, lists) {
				this.changeFormeditSubstanceImg(lists);
			},
			uploadFormeditSubstanceImg(res, index, lists, name) {
				this.changeFormeditSubstanceImg(lists);
			},
			async submitFormedit(e) {
				let valid = await this.$refs.formeditRef.validate();

				if (valid) {
					//保存数据
					let param = this.formedit;
					let header = {};
					let url = 'https://YourWebsite.cn/bn/api.reconciliation/update';

					let res = await this.$http.post(url, param, header, 'json');
					await this.reconciliationDataApi();
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
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex12-clz {
		border: 1px dotted #0084ff;
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
		border-bottom: 1px dotted #0084ff;
		padding-right: 8px;
	}
	.text1-clz {
		color: #0084ff;
	}
	.flex14-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		border-bottom: 1px dotted #0084ff;
		padding-right: 8px;
	}
	.text27-clz {
		color: #0084ff;
	}
	.flex8-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		border-bottom: 1px dotted #0084ff;
		padding-right: 8px;
	}
	.text17-clz {
		color: #00eeff;
	}
	.idfy-clz {
		border-bottom: 1px dotted #0084ff;
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
	.flex-clz {
		border-bottom: 1px dotted #0084ff;
	}
	.flex5-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text14-clz {
		color: #00ff40;
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
		color: #00eeff;
	}
	.flex15-clz {
		border-bottom: 1px dotted #0084ff;
	}
	.flex3-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text7-clz {
		color: #9000ff;
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
	.flex17-clz {
		border-bottom: 1px dotted #0084ff;
	}
	.flex18-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex19-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex20-clz {
		border-bottom: 1px dotted #0084ff;
	}
	.flex21-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex22-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex11-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text25-clz {
		color: #ff0000;
	}
	.flex16-clz {
		border-top: 1px dotted #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text36-clz {
		color: #ff0000;
	}
	.flex9-clz {
		border-top: 1px dotted #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text19-clz {
		color: #0084ff;
	}
	.flex10-clz {
		border-top: 1px dotted #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text22-clz {
		color: #6a1bd2;
	}
	.flex13-clz {
		border-top: 1px dotted #0084ff;
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.editaction-button-clz {
		margin: 3px !important;
	}
	.modelx-clz {
		z-index: 900;
	}
	.diygw-dialog-modelx {
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.text23-clz {
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
	.floatbar-clz {
		bottom: 50px;
		width: 40px !important;
		right: 10px;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		font-size: 12px;
	}
	.container15293 {
	}
</style>
