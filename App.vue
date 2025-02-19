<script>
	export default {
		globalData: {
			userInfo: null,
			tabBar: ['/pages/index', '/pages/login', '/pages/reimbursementAll', '/pages/personal'],
			homePage: '/pages/index',
			pages: ['/pages/index', '/pages/register', '/pages/login', '/pages/human/roster', '/pages/personal', '/pages/reimbursementAll', '/pages/output', '/pages/output/listshow', '/pages/finance/reimbursement/personalRecords', '/pages/finance/enterprise/reconciliation', '/pages/boss/caiwu/zhichu', '/pages/boss/caiwu/gongcheng', '/pages/boss/caiwu/fenxi'],
			userData: {}
		},
		  onLaunch() {
		    // 获取 token 和登录时间
		    const token = uni.getStorageSync('token')
		    const loginTime = uni.getStorageSync('loginTime')
		    const now = Date.now()
		    const sevenDays = 7 * 24 * 60 * 60 * 1000  // 7天的毫秒数
		
		    if (token && loginTime && (now - loginTime <= sevenDays)) {
		      // 如果 token 存在并且未超过7天，直接跳转到首页
		      uni.reLaunch({
		        url: '/pages/index'
		      })
		    } else {
		      // 否则跳转到登录页
		      uni.reLaunch({
		        url: '/pages/login'
		      })
		    }
		  }
	};
</script>
<style lang="scss">
	@import 'common/diygw-ui/iconfont.scss';
	@import 'common/diygw-ui/animate.css';
	@import 'common/diygw-ui/index.scss';

	@import './uni_modules/diy-uview-ui/index.scss';
	@import 'common/diygw-ui/uview.scss';
</style>
