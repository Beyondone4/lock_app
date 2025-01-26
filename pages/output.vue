<template>
	<view class="container container15293">
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<u-form-item :required="true" class="diygw-col-24" label="项目" prop="idProject">
				<u-input @click="formData.showIdProject = true" class="" placeholder="请选择" v-model="form.idProjectLabel" type="select"></u-input>
			</u-form-item>
			<u-select mode="single-column" valueName="id" labelName="title" :list="projectData.rows" :defaultValue="[form.idProjectIndex]" v-model="formData.showIdProject" @confirm="changeFormIdProject"></u-select>
			<u-form-item :required="true" class="diygw-col-24" label="桩型" prop="idZhuangxing">
				<u-input @click="formData.showIdZhuangxing = true" class="" placeholder="请选择" v-model="form.idZhuangxingLabel" type="select"></u-input>
			</u-form-item>
			<u-select mode="single-column" valueName="id" labelName="class" :list="zhuangData.rows" :defaultValue="[form.idZhuangxingIndex]" v-model="formData.showIdZhuangxing" @confirm="changeFormIdZhuangxing"></u-select>
			<u-form-item class="diygw-col-24" :required="true" label="桩号" prop="zhuanghao">
				<u-input :focus="formData.zhuanghaoFocus" class="" placeholder="桩号" v-model="form.zhuanghao" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="打桩日期" :required="true" prop="dazhuangTime">
				<u-input @click="formData.showDazhuangTime = true" class="" placeholder="开孔日期" v-model="form.dazhuangTime" type="select"></u-input>
			</u-form-item>
			<u-calendar maxDate="2050-12-31" v-model="formData.showDazhuangTime" mode="date" @change="changeFormDazhuangTime"></u-calendar>
			<u-form-item class="diygw-col-24" :required="true" label="护筒标高" prop="hightHujian">
				<u-input :focus="formData.hightHujianFocus" class="" placeholder="护筒标高（米）" v-model="form.hightHujian" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="地面标高" prop="hightDimian">
				<u-input :focus="formData.hightDimianFocus" class="" placeholder="地面标高（米）" v-model="form.hightDimian" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="桩顶标高" prop="hightZhuangding">
				<u-input :focus="formData.hightZhuangdingFocus" class="" placeholder="桩顶标高" v-model="form.hightZhuangding" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="设计入岩" prop="estimateRuyan">
				<u-input :focus="formData.estimateRuyanFocus" class="" placeholder="设计入岩深度" v-model="form.estimateRuyan" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="中风化夹层岩面标高" prop="heightZfhjcymbg">
				<u-input :focus="formData.heightZfhjcymbgFocus" class="" placeholder="中风化夹层岩面标高（米）" v-model="form.heightZfhjcymbg" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="中风化夹层底标高" prop="heightZfhjcdbg">
				<u-input :focus="formData.heightZfhjcdbgFocus" class="" placeholder="中风化夹层底标高（米）" v-model="form.heightZfhjcdbg" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="实际入岩" prop="accurateRuyan">
				<u-input :focus="formData.accurateRuyanFocus" class="" placeholder="实际入岩标高" v-model="form.accurateRuyan" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="终孔" prop="zhongkong">
				<u-input :focus="formData.zhongkongFocus" class="" placeholder="终孔标高" v-model="form.zhongkong" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="充盈系数" prop="chongying">
				<u-input :focus="formData.chongyingFocus" class="" placeholder="充盈系数" v-model="form.chongying" type="text"></u-input>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="定型" prop="dingxing">
				<u-input @click="formData.showDingxing = true" class="" placeholder="请选择" v-model="form.dingxingLabel" type="select"></u-input>
			</u-form-item>
			<u-select mode="single-column" valueName="value" labelName="label" :list="formData.dingxingDatas" :defaultValue="[form.dingxingIndex]" v-model="formData.showDingxing" @confirm="changeFormDingxing"></u-select>
			<u-form-item labelClass="text-yellow" class="diygw-col-24" label="打孔图" prop="imgDakong">
				<u-upload maxCount="1" @on-success="uploadFormImgDakong" @on-remove="delFormImgDakong" action="/sys/storage/upload" :file-list="formData.imgDakongListDatas"> </u-upload>
			</u-form-item>
			<u-form-item labelClass="text-olive" class="diygw-col-24" label="验桩图" prop="imgYanzhuang">
				<u-upload maxCount="1" @on-success="uploadFormImgYanzhuang" @on-remove="delFormImgYanzhuang" action="/sys/storage/upload" :file-list="formData.imgYanzhuangListDatas"> </u-upload>
			</u-form-item>
			<u-form-item labelClass="text-cyan" class="diygw-col-24" label="验笼图" prop="imgYanlong">
				<u-upload maxCount="1" @on-success="uploadFormImgYanlong" @on-remove="delFormImgYanlong" action="/sys/storage/upload" :file-list="formData.imgYanlongListDatas"> </u-upload>
			</u-form-item>
			<u-form-item labelClass="text-blue" class="diygw-col-24" label="岩样图" prop="imgYanyang">
				<u-upload maxCount="1" @on-success="uploadFormImgYanyang" @on-remove="delFormImgYanyang" action="/sys/storage/upload" :file-list="formData.imgYanyangListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="补充图A" prop="imgA">
				<u-upload maxCount="1" @on-success="uploadFormImgA" @on-remove="delFormImgA" action="/sys/storage/upload" :file-list="formData.imgAListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="补充图B" prop="imgB">
				<u-upload maxCount="1" @on-success="uploadFormImgB" @on-remove="delFormImgB" action="/sys/storage/upload" :file-list="formData.imgBListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24 hidden" label="用户ID" prop="idUser">
				<u-input :focus="formData.idUserFocus" :disabled="formData.idUserDisabled" class="" placeholder="请输入提示信息" v-model="form.idUser" type="text"></u-input>
			</u-form-item>
			<view class="flex diygw-col-24">
				<button @click="submitForm" class="diygw-btn green radius-xs flex-sub margin-xs button-button-clz">提交</button>
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
				zhuangData: {
					rows: [
						{
							id: 0,
							class: '',
							describe: '',
							sort: 0,
							createTime: null,
							updateTime: null,
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
					idZhuangxing: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择桩型'
						}
					],
					zhuanghao: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请填写桩号'
						}
					],
					dazhuangTime: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择打桩日期'
						}
					],
					hightHujian: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '检查护筒标高'
						}
					],
					hightDimian: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '检查地面标高'
						}
					],
					hightZhuangding: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '检查桩顶标高'
						}
					],
					estimateRuyan: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '检查设计入岩'
						}
					],
					heightZfhjcymbg: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入中风化夹层岩面标高（米）'
						}
					],
					heightZfhjcdbg: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入中风化夹层底标高（米）'
						}
					],
					accurateRuyan: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入实际入岩标高'
						}
					],
					zhongkong: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入终孔标高'
						}
					],
					chongying: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入充盈系数'
						}
					],
					dingxing: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择定型'
						}
					]
				},
				form: {
					idProjectIndex: -1,
					idProject: '',
					idProjectLabel: '',
					idZhuangxingIndex: -1,
					idZhuangxing: '',
					idZhuangxingLabel: '',
					zhuanghao: '',
					dazhuangTime: '',
					hightHujian: '',
					hightDimian: '',
					hightZhuangding: '',
					estimateRuyan: '',
					heightZfhjcymbg: '',
					heightZfhjcdbg: '',
					accurateRuyan: '',
					zhongkong: '',
					chongying: '',
					dingxingIndex: 0,
					dingxing: '1',
					dingxingLabel: '中风',
					imgDakong: '',
					imgYanzhuang: '',
					imgYanlong: '',
					imgYanyang: '',
					imgA: '',
					imgB: '',
					idUser: ''
				},
				formData: {
					showIdProject: false,
					showIdZhuangxing: false,
					zhuanghaoFocus: false,
					showDazhuangTime: false,
					hightHujianFocus: false,
					hightDimianFocus: false,
					hightZhuangdingFocus: false,
					estimateRuyanFocus: false,
					heightZfhjcymbgFocus: false,
					heightZfhjcdbgFocus: false,
					accurateRuyanFocus: false,
					zhongkongFocus: false,
					chongyingFocus: false,
					showDingxing: false,
					dingxingDatas: [
						{ value: '1', label: '中风' },
						{ value: '0', label: '微风' }
					],
					imgDakongListDatas: [],
					imgDakongDatas: [],
					imgYanzhuangListDatas: [],
					imgYanzhuangDatas: [],
					imgYanlongListDatas: [],
					imgYanlongDatas: [],
					imgYanyangListDatas: [],
					imgYanyangDatas: [],
					imgAListDatas: [],
					imgADatas: [],
					imgBListDatas: [],
					imgBDatas: [],
					idUserDisabled: true,
					idUserFocus: false
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
				await this.projectDataApi();
				await this.zhuangDataApi();
				await this.getUserInfoFunction();
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

				let projectData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.projectData = projectData;
			},
			// 桩型 API请求方法
			async zhuangDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.zhuang/list';
				let http_data = {
					orderby: param.orderby || 'sort desc',
					pageSize: param.pageSize || '1000'
				};
				let http_header = {};

				let zhuangData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.zhuangData = zhuangData;
			},

			// 获取用户信息（新） 自定义方法
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
					this.form.idUser = userinfo['id'];
					//console.log('userinfo.data.id')
					//console.log(userinfo['id'])
				}
			},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();
				if (valid) {
					//保存数据
					let param = this.form;
					let url = '/bn/api.output/add';

					let res = await this.$http.post(url, param, {}, 'json');
					this.navigateTo({
						type: 'tip',
						tip: '已提交'
					});
					if (res.code == 200) {
						this.showToast(res.msg, 'success');
						setTimeout(() => {
							this.navigateTo({ type: 'page', url: '/pages/output/listshow' });
						}, 1500);
					} else {
						this.showModal(res.msg, '提示', false);
					}
				} else {
					console.log('验证失败');
				}
			},
			changeFormIdProject(evt) {
				evt.map((val, index) => {
					this.form.idProjectLabel = val.label;
					this.form.idProject = String(val.value);
					this.form.idProjectIndex = val.index;
				});
			},
			changeFormIdZhuangxing(evt) {
				evt.map((val, index) => {
					this.form.idZhuangxingLabel = val.label;
					this.form.idZhuangxing = String(val.value);
					this.form.idZhuangxingIndex = val.index;
				});
			},
			changeFormDazhuangTime(evt) {
				this.form.dazhuangTime = evt.result;
			},
			changeFormDingxing(evt) {
				evt.map((val, index) => {
					this.form.dingxingLabel = val.label;
					this.form.dingxing = String(val.value);
					this.form.dingxingIndex = val.index;
				});
			},
			changeFormImgDakong(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.imgDakongDatas = datas;
				this.formData.imgDakongListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.imgDakong = datas.join(',');
			},
			delFormImgDakong(index, lists) {
				this.changeFormImgDakong(lists);
			},
			uploadFormImgDakong(res, index, lists, name) {
				this.changeFormImgDakong(lists);
			},
			changeFormImgYanzhuang(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.imgYanzhuangDatas = datas;
				this.formData.imgYanzhuangListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.imgYanzhuang = datas.join(',');
			},
			delFormImgYanzhuang(index, lists) {
				this.changeFormImgYanzhuang(lists);
			},
			uploadFormImgYanzhuang(res, index, lists, name) {
				this.changeFormImgYanzhuang(lists);
			},
			changeFormImgYanlong(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.imgYanlongDatas = datas;
				this.formData.imgYanlongListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.imgYanlong = datas.join(',');
			},
			delFormImgYanlong(index, lists) {
				this.changeFormImgYanlong(lists);
			},
			uploadFormImgYanlong(res, index, lists, name) {
				this.changeFormImgYanlong(lists);
			},
			changeFormImgYanyang(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.imgYanyangDatas = datas;
				this.formData.imgYanyangListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.imgYanyang = datas.join(',');
			},
			delFormImgYanyang(index, lists) {
				this.changeFormImgYanyang(lists);
			},
			uploadFormImgYanyang(res, index, lists, name) {
				this.changeFormImgYanyang(lists);
			},
			changeFormImgA(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.imgADatas = datas;
				this.formData.imgAListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.imgA = datas.join(',');
			},
			delFormImgA(index, lists) {
				this.changeFormImgA(lists);
			},
			uploadFormImgA(res, index, lists, name) {
				this.changeFormImgA(lists);
			},
			changeFormImgB(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.imgBDatas = datas;
				this.formData.imgBListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.imgB = datas.join(',');
			},
			delFormImgB(index, lists) {
				this.changeFormImgB(lists);
			},
			uploadFormImgB(res, index, lists, name) {
				this.changeFormImgB(lists);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.button-button-clz {
		margin: 50px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		font-size: 12px;
	}
	.container15293 {
	}
</style>
