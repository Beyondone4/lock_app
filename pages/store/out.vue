<template>
	<view class="container container15293">
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<u-form-item class="diygw-col-24" label="项目" prop="idProject">
				<u-input @click="formData.showIdProject = true" class="" placeholder="请选择项目" v-model="form.idProjectLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.idProject" activeColor="#1cbbb4" placeholder="请输入搜索关键词" valueName="id" labelName="title" :list="projectData.rows" v-model="formData.showIdProject" @confirm="changeFormIdProject"></diy-select>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="仓库" prop="idStore">
				<u-input @click="formData.showIdStore = true" class="" placeholder="请选择仓库" v-model="form.idStoreLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.idStore" activeColor="#1cbbb4" placeholder="请输入搜索关键词" valueName="id" labelName="title" :list="storeData.rows" v-model="formData.showIdStore" @confirm="changeFormIdStore"></diy-select>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="物品规格" prop="idArticle">
				<u-input @click="formData.showIdArticle = true" class="" placeholder="请选择规格" v-model="form.idArticleLabel" type="select"></u-input>
				<diy-select mode="radio" :radioValue="form.idArticle" activeColor="#1cbbb4" placeholder="请输入搜索关键词" valueName="id" labelName="title" :list="storeArticle.rows" v-model="formData.showIdArticle" @confirm="changeFormIdArticle"></diy-select>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="数量" prop="num">
				<u-input :focus="formData.numFocus" class="" placeholder="请输入出库数量（数字）" v-model="form.num" type="text"></u-input>
			</u-form-item>
			<u-form-item labelWidth="auto" class="diygw-col-24" label="出库物品拍照" prop="img">
				<u-upload width="160" height="160" maxCount="6" @on-success="uploadFormImg" @on-remove="delFormImg" action="/sys/storage/upload" :file-list="formData.imgListDatas"> </u-upload>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="详细描述" prop="remarks">
				<u-input :autoHeight="false" maxlength="300" height="100px" class="solid" placeholder="对于入库物品进仓的描述，比如一些对于物品或者人之间的信息，方便管理员进行审核" v-model="form.remarks" type="textarea"></u-input>
			</u-form-item>
			<view class="flex diygw-col-24">
				<button @click="submitForm" class="diygw-btn cyan radius-xs flex-sub margin-xs button-button-clz">提交</button>
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
				storeData: {
					rows: [
						{
							id: 0,
							title: '',
							remarks: '',
							isclose: '',
							idProject: 0,
							idUser: 0,
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
							describe: null,
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
				storeArticle: {
					rows: [
						{
							id: 0,
							title: '',
							specs: '',
							unit: '',
							model: '',
							check: 0,
							price: '',
							idSupplier: 0,
							createTime: '',
							updateTime: '',
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				form: {
					idProject: '',
					idProjectLabel: '',
					idStore: '',
					idStoreLabel: '',
					idArticle: '',
					idArticleLabel: '',
					num: '',
					img: '',
					remarks: ''
				},
				formRules: {
					num: [
						{
							trigger: ['change', 'blur'],
							trigger: ['change', 'blur'],
							message: '请输入数字',
							type: 'number'
						}
					],
					remarks: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '描述不能为空哟'
						}
					]
				},
				formData: {
					showIdProject: false,
					showIdStore: false,
					showIdArticle: false,
					numFocus: false,
					imgListDatas: [],
					imgDatas: []
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
				await this.storeDataApi();
				await this.projectDataApi();
				await this.storeArticleApi();
				await this.getNowUserIdFunction();
			},
			// 仓库信息 API请求方法
			async storeDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.store/list';
				let http_data = {};
				let http_header = {};

				let storeData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.storeData = storeData;
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
			// 仓库物品规格 API请求方法
			async storeArticleApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeArticle/list';
				let http_data = {};
				let http_header = {};

				let storeArticle = await this.$http.post(http_url, http_data, http_header, 'json');

				this.storeArticle = storeArticle;
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
					this.form.idUser = userinfo.id;
				}
			},
			changeFormIdProject(evt) {
				this.form.idProject = evt.id;
				this.form.idProjectLabel = evt.title;
			},
			changeFormIdStore(evt) {
				this.form.idStore = evt.id;
				this.form.idStoreLabel = evt.title;
			},
			changeFormIdArticle(evt) {
				this.form.idArticle = evt.id;
				this.form.idArticleLabel = evt.title;
			},
			changeFormImg(lists) {
				let datas = lists
					.filter((item) => {
						return item && item.url;
					})
					.map((item) => {
						return item.url;
					});
				this.formData.imgDatas = datas;
				this.formData.imgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.img = datas.join(',');
			},
			delFormImg(index, lists) {
				this.changeFormImg(lists);
			},
			uploadFormImg(res, index, lists, name) {
				this.changeFormImg(lists);
			},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();

				if (valid) {
					//保存数据
					let param = this.form;
					let header = {};
					let url = 'bn/api.storeFlow/addout';

					let res = await this.$http.post(url, param, header, 'json');

					if (res.code == 200) {
						this.showToast(res.msg, 'success');
						setTimeout(() => {
							this.navigateTo({ type: 'page', url: '/pages/store/menu' });
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
	.button-button-clz {
		margin: 20px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
