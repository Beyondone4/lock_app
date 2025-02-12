<template>
	<view class="container container15293">
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<u-form-item :required="true" class="diygw-col-24" label="项目" prop="idProject">
				<u-input @click="formData.showIdProject = true" class="" placeholder="请选择项目" v-model="form.idProjectLabel" type="select"></u-input>
			</u-form-item>
			<u-select mode="single-column" valueName="id" labelName="title" :list="projectData.rows" :defaultValue="[form.idProjectIndex]" v-model="formData.showIdProject" @confirm="changeFormIdProject"></u-select>
			<u-form-item class="diygw-col-24" :required="true" label="姓名" prop="name">
				<u-input :focus="formData.nameFocus" class="" placeholder="请输入提示信息" v-model="form.name" type="text"></u-input>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="工种" prop="idWorker">
				<u-input @click="formData.showIdWorker = true" class="" placeholder="请选择工种" v-model="form.idWorkerLabel" type="select"></u-input>
			</u-form-item>
			<u-select mode="single-column" valueName="id" labelName="name" :list="workerData.rows" :defaultValue="[form.idWorkerIndex]" v-model="formData.showIdWorker" @confirm="changeFormIdWorker"></u-select>
			<u-form-item class="diygw-col-24" :required="true" label="身份证号" prop="cardNum">
				<u-input :focus="formData.cardNumFocus" class="" placeholder="请输入身份证号" v-model="form.cardNum" type="text"></u-input>
			</u-form-item>
			<view class="flex flex-wrap diygw-col-24 flex2-clz">
				<view class="flex flex-wrap diygw-col-12 flex-direction-column items-center flex3-clz">
					<u-form-item :borderBottom="false" class="diygw-col-0" labelPosition="top" prop="cardImg">
						<u-upload customBtn width="320" height="240" margin="0" maxCount="1" @on-success="uploadFormCardImg" @on-remove="delFormCardImg" action="/sys/storage/upload" :file-list="formData.cardImgListDatas">
							<template v-slot:addBtn> <u-image src="https://YourWebsite.cn/static/sfzzm.png" width="320" height="240"></u-image> </template>
						</u-upload>
					</u-form-item>
					<view class="diygw-col-0 text5-clz"> 点击上传身份证正面 </view>
				</view>
				<view class="flex flex-wrap diygw-col-12 flex-direction-column items-center flex5-clz">
					<u-form-item :borderBottom="false" class="diygw-col-0" labelPosition="top" prop="cardImgb">
						<u-upload customBtn width="320" height="240" margin="0" maxCount="1" @on-success="uploadFormCardImgb" @on-remove="delFormCardImgb" action="/sys/storage/upload" :file-list="formData.cardImgbListDatas">
							<template v-slot:addBtn> <u-image src="https://YourWebsite.cn/static/sfzfm.png" width="320" height="240"></u-image> </template>
						</u-upload>
					</u-form-item>
					<view class="diygw-col-0 text6-clz"> 点击上传身份证反面 </view>
				</view>
			</view>
			<u-form-item class="diygw-col-24" label="报到日期" :required="true" prop="checkinTime">
				<u-input @click="formData.showCheckinTime = true" class="" placeholder="请选择" v-model="form.checkinTime" type="select"></u-input>
			</u-form-item>
			<u-calendar maxDate="2050-12-31" v-model="formData.showCheckinTime" mode="date" @change="changeFormCheckinTime"></u-calendar>
			<u-form-item class="diygw-col-24" :required="true" label="手机" prop="phone">
				<u-input :focus="formData.phoneFocus" class="" placeholder="请输入手机号" v-model="form.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item :required="true" class="diygw-col-24" label="学历" prop="idEdu">
				<u-input @click="formData.showIdEdu = true" class="" placeholder="请选择学历" v-model="form.idEduLabel" type="select"></u-input>
			</u-form-item>
			<u-select mode="single-column" valueName="id" labelName="name" :list="educationData.rows" :defaultValue="[form.idEduIndex]" v-model="formData.showIdEdu" @confirm="changeFormIdEdu"></u-select>
			<u-form-item class="diygw-col-24" label="学历照" prop="eduImg">
				<u-upload margin="0" maxCount="1" @on-success="uploadFormEduImg" @on-remove="delFormEduImg" action="/sys/storage/upload" :file-list="formData.eduImgListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="上岗工作证(支持多图)" prop="certificatesImg">
				<u-upload maxCount="6" @on-success="uploadFormCertificatesImg" @on-remove="delFormCertificatesImg" action="/sys/storage/upload" :file-list="formData.certificatesImgListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="银行卡号" prop="bankNum">
				<u-input :focus="formData.bankNumFocus" class="" placeholder="请输入银行卡号" v-model="form.bankNum" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24" label="银行卡照片" prop="bankImg">
				<u-upload margin="0" maxCount="1" @on-success="uploadFormBankImg" @on-remove="delFormBankImg" action="/sys/storage/upload" :file-list="formData.bankImgListDatas"> </u-upload>
			</u-form-item>
			<u-form-item class="diygw-col-24" :required="true" label="开户行支行" prop="bankAddress">
				<u-input :focus="formData.bankAddressFocus" class="" placeholder="请输入开户行支行信息（详细,包含省市区）" v-model="form.bankAddress" type="text"></u-input>
			</u-form-item>
			<view class="diygw-col-24 text8-clz"> 半身照请联系同事辅助完成拍摄，严格按照模板拍摄，否则一律不通过（纯白背景，露肩，手臂自然垂直） </view>
			<view class="flex flex-wrap diygw-col-24 flex1-clz">
				<u-form-item class="diygw-col-13" label="半身照" prop="bustPhotos">
					<u-upload margin="0" maxCount="1" @on-success="uploadFormBustPhotos" @on-remove="delFormBustPhotos" action="/sys/storage/upload" :file-list="formData.bustPhotosListDatas"> </u-upload>
				</u-form-item>
				<image src="https://YourWebsite.cn/static/shili.jpg" class="diygw-image diygw-col-11" style="height: 120px !important; width: 100% !important" mode="aspectFit"></image>
			</view>
			<view class="flex flex-wrap diygw-col-24 flex-direction-column flex4-clz">
				<view class="diygw-col-0 text1-clz"> 问：是否有以下基础病？ </view>
				<view class="diygw-col-0 text3-clz"> 心脏病、高血压、中风、贫血、癫痫等心脑血管疾病病史 </view>
				<view class="diygw-col-0 text7-clz"> 请如实申报，如因基础病发生的一切后果，均由个人承担 </view>
				<u-form-item class="diygw-col-21 illness-clz" label="请选择" :required="true" prop="illness">
					<u-radio-group class="flex flex-wrap diygw-col-24 justify-between" wrapClass=" justify-between" activeColor="#39b54a" v-model="form.illness" @change="changeFormIllness">
						<u-radio shape="circle" v-for="(radioitem, radioindex) in formData.illnessDatas" :key="radioindex" :name="radioitem.value">
							{{ radioitem.label }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</view>
			<view class="flex flex-wrap diygw-col-24 flex-direction-column flex-clz">
				<view class="diygw-col-0 text-clz"> 入职声明及提醒： </view>
				<view class="diygw-col-0 text2-clz"> 施工人员进入施工现场必须依甲方工地规定正确穿戴与从事工种相关的劳保防护用品。 遵守甲方工地的基本规范，不准乱扔生活垃圾，不准在禁烟的施工区域内吸烟、严禁酒后上岗。申请入职人员所提交身份证件、上岗操作证件必须真实有效，如有冒用他人证件或使用虚假证件者需承担相应法律责任，所造成的财产损失公司保留追究其赔偿责任。 </view>
				<view class="diygw-col-0 text4-clz"> 请仔细阅读入职声明！并且在下方输入“本人已了解工作规范与法律责任” </view>
				<u-form-item class="diygw-col-24" :required="true" label="请填写" prop="rzsm">
					<u-input :focus="formData.rzsmFocus" class="" placeholder="本人已了解工作规范与法律责任" v-model="form.rzsm" type="text"></u-input>
				</u-form-item>
			</view>
			<view class="flex diygw-col-24 button-clz">
				<button @click="submitForm" class="diygw-btn cyan radius-xs flex-sub margin-xs button-button-clz"><text class="button-icon diy-icon-upblock"></text> 提交入职申请</button>
			</view>
			<view class="flex diygw-col-24 chongzhi-clz">
				<button form-type="reset" class="diygw-btn red radius-xs flex-sub margin-xs chongzhi-button-clz"><text class="button-icon diy-icon-refresh"></text> 表单重置（用于重新输入所有内容）</button>
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
				workerData: {
					rows: [
						{
							id: 0,
							name: '',
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
				educationData: {
					rows: [
						{
							id: 0,
							name: '',
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
					name: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入姓名'
						}
					],
					idWorker: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择工种'
						}
					],
					cardNum: [
						{
							trigger: ['change', 'blur'],
							message: '请输入18位的有效身份证',
							pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
						},
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请填写身份证号'
						}
					],
					checkinTime: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择报到日期'
						}
					],
					phone: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '手机号不能为空'
						},
						{
							trigger: ['change', 'blur'],
							message: '请输入11位的手机号码',
							pattern: /^1[3-9]\d{9}$/
						}
					],
					idEdu: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择学历'
						}
					],
					bankNum: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入银行卡号'
						}
					],
					bankAddress: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请填写收款银行卡开户行支行信息'
						}
					],
					illness: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请选择是否有基础病症状'
						}
					],
					rzsm: [
						{
							trigger: ['change', 'blur'],
							message: '请输入“本人已了解工作规范与法律责任”',
							validator: (rule, val, callback) => {
								if (val && val.indexOf('法律责任') >= 0) {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入“本人已了解工作规范与法律责任”'
						}
					]
				},
				form: {
					idProjectIndex: -1,
					idProject: '',
					idProjectLabel: '',
					name: '',
					idWorkerIndex: -1,
					idWorker: '',
					idWorkerLabel: '',
					cardNum: '',
					cardImg: '',
					cardImgb: '',
					checkinTime: '',
					phone: '',
					idEduIndex: -1,
					idEdu: '',
					idEduLabel: '',
					eduImg: '',
					certificatesImg: '',
					bankNum: '',
					bankImg: '',
					bankAddress: '',
					bustPhotos: '',
					illness: '',
					rzsm: ''
				},
				formData: {
					showIdProject: false,
					nameFocus: false,
					showIdWorker: false,
					cardNumFocus: false,
					cardImgListDatas: [],
					cardImgDatas: [],
					cardImgbListDatas: [],
					cardImgbDatas: [],
					showCheckinTime: false,
					phoneFocus: false,
					showIdEdu: false,
					eduImgListDatas: [],
					eduImgDatas: [],
					certificatesImgListDatas: [],
					certificatesImgDatas: [],
					bankNumFocus: false,
					bankImgListDatas: [],
					bankImgDatas: [],
					bankAddressFocus: false,
					bustPhotosListDatas: [],
					bustPhotosDatas: [],
					illnessDatas: [
						{ value: '0', label: '无基础病', checked: false },
						{ value: '1', label: '有基础病', checked: false }
					],
					rzsmFocus: false
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
				await this.workerDataApi();
				await this.educationDataApi();
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
			// 工种数据 API请求方法
			async workerDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.worker/list';
				let http_data = {
					pageSize: param.pageSize || '100',
					orderby: param.orderby || 'sort desc'
				};
				let http_header = {};

				let workerData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.workerData = workerData;
			},
			// 学历数据 API请求方法
			async educationDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.education/list';
				let http_data = {
					pageSize: param.pageSize || '100',
					orderby: param.orderby || 'sort desc'
				};
				let http_header = {};

				let educationData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.educationData = educationData;
			},
			changeFormIdProject(evt) {
				evt.map((val, index) => {
					this.form.idProjectLabel = val.label;
					this.form.idProject = String(val.value);
					this.form.idProjectIndex = val.index;
				});
			},
			changeFormIdWorker(evt) {
				evt.map((val, index) => {
					this.form.idWorkerLabel = val.label;
					this.form.idWorker = String(val.value);
					this.form.idWorkerIndex = val.index;
				});
			},
			changeFormCardImg(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.cardImgDatas = datas;
				this.formData.cardImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.cardImg = datas.join(',');
			},
			delFormCardImg(index, lists) {
				this.changeFormCardImg(lists);
			},
			uploadFormCardImg(res, index, lists, name) {
				this.changeFormCardImg(lists);
			},
			changeFormCardImgb(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.cardImgbDatas = datas;
				this.formData.cardImgbListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.cardImgb = datas.join(',');
			},
			delFormCardImgb(index, lists) {
				this.changeFormCardImgb(lists);
			},
			uploadFormCardImgb(res, index, lists, name) {
				this.changeFormCardImgb(lists);
			},
			changeFormCheckinTime(evt) {
				this.form.checkinTime = evt.result;
			},
			changeFormIdEdu(evt) {
				evt.map((val, index) => {
					this.form.idEduLabel = val.label;
					this.form.idEdu = String(val.value);
					this.form.idEduIndex = val.index;
				});
			},
			changeFormEduImg(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.eduImgDatas = datas;
				this.formData.eduImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.eduImg = datas.join(',');
			},
			delFormEduImg(index, lists) {
				this.changeFormEduImg(lists);
			},
			uploadFormEduImg(res, index, lists, name) {
				this.changeFormEduImg(lists);
			},
			changeFormCertificatesImg(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.certificatesImgDatas = datas;
				this.formData.certificatesImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.certificatesImg = datas.join(',');
			},
			delFormCertificatesImg(index, lists) {
				this.changeFormCertificatesImg(lists);
			},
			uploadFormCertificatesImg(res, index, lists, name) {
				this.changeFormCertificatesImg(lists);
			},
			changeFormBankImg(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.bankImgDatas = datas;
				this.formData.bankImgListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.bankImg = datas.join(',');
			},
			delFormBankImg(index, lists) {
				this.changeFormBankImg(lists);
			},
			uploadFormBankImg(res, index, lists, name) {
				this.changeFormBankImg(lists);
			},
			changeFormBustPhotos(lists) {
				let datas = lists
					.filter((item) => {
						return item.response && item.response.url;
					})
					.map((item) => {
						return item.response.url;
					});
				this.formData.bustPhotosDatas = datas;
				this.formData.bustPhotosListDatas = datas.map((item) => {
					return { url: item };
				});
				this.form.bustPhotos = datas.join(',');
			},
			delFormBustPhotos(index, lists) {
				this.changeFormBustPhotos(lists);
			},
			uploadFormBustPhotos(res, index, lists, name) {
				this.changeFormBustPhotos(lists);
			},
			changeFormIllness(evt) {},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();

				if (valid) {
					//保存数据
					let param = this.form;
					let header = {};
					let url = 'https://YourWebsite.cn/bn/api.roster/add';

					let res = await this.$http.post(url, param, header, 'json');
					let flag = await this.showModal('已完成提交，请联系人事部门进行审核！');
					if (res.code == 200) {
						this.showToast(res.msg, 'success');
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
	.flex2-clz {
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
		padding-right: 10px;
	}
	.formcardImgimage {
		width: 160px;
		height: 120px;
	}
	.text5-clz {
		font-weight: bold;
	}
	.formcardImgbimage {
		width: 160px;
		height: 120px;
	}
	.text6-clz {
		font-weight: bold;
	}
	.text8-clz {
		color: #f80404;
		font-size: 15px !important;
		text-align: center;
	}
	.flex1-clz {
		margin-left: 10px;
		width: calc(100% - 10px - 10px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 10px;
	}
	.flex4-clz {
		padding-top: 10px;
		border-bottom-left-radius: 6px;
		padding-left: 10px;
		padding-bottom: 10px;
		border-top-right-radius: 6px;
		margin-right: 10px;
		margin-left: 10px;
		box-shadow: 0px 1px 4px 2px rgba(31, 31, 31, 0.14);
		overflow: hidden;
		width: calc(100% - 10px - 10px) !important;
		border-top-left-radius: 6px;
		margin-top: 10px;
		border-bottom-right-radius: 6px;
		margin-bottom: 10px;
		padding-right: 10px;
	}
	.text1-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		border-bottom: 1px solid #eee;
		padding-right: 0px;
	}
	.text3-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		padding-right: 0px;
	}
	.text7-clz {
		background-color: #f0faf8;
		padding-top: 5px;
		border-bottom-left-radius: 6px;
		overflow: hidden;
		color: #26b3a0;
		padding-left: 5px;
		padding-bottom: 5px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		padding-right: 5px;
	}
	.illness-clz {
		margin-left: 5px;
		width: calc(87.5% - 5px - 5px) !important;
		margin-top: 10px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex-clz {
		padding-top: 10px;
		border-bottom-left-radius: 6px;
		padding-left: 10px;
		padding-bottom: 10px;
		border-top-right-radius: 6px;
		margin-right: 10px;
		margin-left: 10px;
		box-shadow: 0px 1px 4px 2px rgba(31, 31, 31, 0.14);
		overflow: hidden;
		width: calc(100% - 10px - 10px) !important;
		border-top-left-radius: 6px;
		margin-top: 10px;
		border-bottom-right-radius: 6px;
		margin-bottom: 10px;
		padding-right: 10px;
	}
	.text-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		border-bottom: 1px solid #eee;
		padding-right: 0px;
	}
	.text2-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		padding-right: 0px;
	}
	.text4-clz {
		background-color: #f0faf8;
		padding-top: 5px;
		border-bottom-left-radius: 6px;
		overflow: hidden;
		color: #26b3a0;
		padding-left: 5px;
		padding-bottom: 5px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		padding-right: 5px;
	}
	.button-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 20px;
		margin-bottom: 30px;
		margin-right: 5px;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.chongzhi-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 30px;
		margin-right: 5px;
	}
	.chongzhi-button-clz {
		margin: 3px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
