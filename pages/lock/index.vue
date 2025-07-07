<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex2-clz">
		<view class="toolbar">
		  <button class="btn" @click="clickDetailFunction(item,'create')" >新增</button>
		
		
		  <!-- 搜索框区域 -->
		  <view class="search-box">
		    <input
		      class="search-input"
		      v-model="searchKeyword"
		      placeholder="请输入锁sn搜索"
		    />
			
		    <button class="btn" @tap="onSearch">搜索</button>
			  <button class="btn" @tap="init">重置</button>
		  </view>
		</view>
			<view class="uni-container">
				<uni-table v-if="stationList && stationList.length > 0" ref="table"  border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
					<uni-tr>
						<uni-th width="50" align="center">ID</uni-th>
						<uni-th width="150" align="center">名称</uni-th>
						<uni-th width="50" align="center">SN</uni-th>
						<uni-th  align="center">锁具MAC</uni-th>
						<uni-th  align="center">锁具位置</uni-th>
						<uni-th  align="center">电量</uni-th>
						<uni-th  align="center">所属站点</uni-th>
						<uni-th  align="center">设备状态</uni-th>
						<uni-th width="160" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr  v-for="(item, index) in lockList" :key="index" >
						<uni-td align="center">{{ item.id }}</uni-td>
		<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{ item.sn }}</uni-td>
						<uni-td align="center">{{ item.mac }}</uni-td>
						<uni-td align="center">{{ item.location }}</uni-td>
						<uni-td align="center">{{Number.parseInt(item.power, 16) }}</uni-td>
						
						<uni-td align="center">{{ stationList.find(station=>station.id===item.stationId).name }}</uni-td>
						<uni-td align="center">{{ item.stationType==1?'工厂':'仓库' }}</uni-td>
						<uni-td >
						<view class="button-row">
						<button type="primary" size="mini"  @click="clickDetailFunction(item,'update')">修改</button>
						<button v-if="isAdmin" type="primary" size="mini" @click="handleUnlock(item)" >开锁</button>
						<button type="warn" size="mini" @click="onDelete('one',item)" >删除</button>
						</view>
						</uni-td>
					</uni-tr>
				</uni-table>
	<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
			</view>
	
		</view>
		<view class="diygw-modal basic" :class="detail"  style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-return basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> {{this.currentModalTitle}} </view>
					<view class="action" data-type="closemodal" data-id="detail" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view style="padding: 20rpx;">
	<uni-forms :modelValue="selectedItem">
	<uni-forms-item   name="type" label="选择站点">
		<zqs-select
		  :multiple="false"
		  :list="stationList"
		  :showSearch="false"
		  label-key="name"
		  value-key="id"
		  title="选择站点"
		  clearable
		  v-model="selectedItem.stationId"
		
		></zqs-select>
	</uni-forms-item>
	<uni-forms-item  name="name" label="锁具名称">
		<uni-easyinput type="text" v-model="selectedItem.name"   />
	</uni-forms-item>
	<uni-forms-item  name="location" label="锁具位置">
		<uni-easyinput type="text" v-model="selectedItem.location"   />
	</uni-forms-item>
	<uni-forms-item  name="code" label="锁具描述">
		<uni-easyinput type="text" v-model="selectedItem.description"  />
	</uni-forms-item>
					<uni-forms-item v-if="currentModal==='create'" label="选择锁具" name="name">
									<button type="primary" @tap="openBluetoothAdapter" size="mini">选择锁具</button>
					</uni-forms-item>
					<uni-forms-item>
						<view v-if="devices.length > 0">
						        <view
						          v-for="(device, index) in devices"
								  v-if="!lockList.some(item => device.deviceId.replace(/:/g, '') === item.mac)"
						          :key="index"
						          style="margin-top: 10px; padding: 10px; border: 1px solid #eee;"
						        >
						          <text>
						            {{ device.name || '未知名称' }} -
						            {{ device.deviceId }}
						          </text>
						          <button
						            style="margin-left: 10px;"
						            @click="bindDevice(device)"
						          >
						            选择此锁具
						          </button>
						<!-- 		  <button
								    style="margin-left: 10px;"
								    @click="getLockInstruct"
								  >
								    发送指令
								  </button> -->
						        </view>
								</view>
					</uni-forms-item>
		

			
	</uni-forms>
	</view>
</view>

				<view class="flex justify-end">

					<button  @tap='createOrupdate' class="diygw-btn red flex1 margin-xs">保存</button>
						<button  @tap='()=>{this.selectedItem.stationId=null}' class="diygw-btn red flex1 margin-xs">重置站点</button>
					<button  data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">关闭</button>
				</view>
			</view>
		</view>

		<view class="diygw-modal basic" :class="consumed" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 删除 </view>
					<view class="action" data-type="closemodal" data-id="consumed" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view class="flex diygw-dialog-content">
						<view class="diygw-col-24 text29-clz"> 删除后该账户信息将被清空，请确认删除！ </view>
					</view>
				</view>
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="clickConsumedDataApi" :data-id="globalData.storeflowid" class="diygw-btn green flex1 margin-xs">确认</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="consumed" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
<view class="diygw-modal basic" :class="loadingModal" style="z-index: 2000000">
  <view class="diygw-dialog diygw-dialog-loading basis-lg">
    <view class="loading-content">
      <view class="loading-icon">
        <view class="loading-spinner"></view>
      </view>
      <view class="loading-text">{{ loadingText }}</view>
      <view class="progress-bar" :class="currentStep">
        <view class="progress-fill"></view>
      </view>
    </view>
  </view>
</view>

<!-- 添加调试信息模态框 -->
<view class="diygw-modal basic" :class="debugModal" style="z-index: 3000000">
  <view class="diygw-dialog diygw-dialog-debug basis-lg">
    <view class="justify-end diygw-bar">
      <view class="content">调试信息</view>
      <view class="action" data-type="closemodal" data-id="debugModal" @tap="navigateTo">
        <i class="diy-icon-close"></i>
      </view>
    </view>
    <view class="debug-content">
      <scroll-view scroll-y style="height: 400rpx; padding: 20rpx;">
        <view v-for="(log, index) in debugLogs" :key="index" class="debug-log-item">
          <text>{{log.time}}: {{log.message}}</text>
        </view>
      </scroll-view>
    </view>
    <view class="flex justify-end">
      <button data-type="closemodal" @tap="clearDebugLogs" data-id="debugModal" class="diygw-btn green flex1 margin-xs">清空日志</button>
      <button data-type="closemodal" @tap="navigateTo" data-id="debugModal" class="diygw-btn red flex1 margin-xs">关闭</button>
    </view>
  </view>
</view>
		<view class="clearfix"></view>
	</view>
</template>

<script>
import {getUserInfo,getLock01Cmd,getLock10Cmd,getUserList,getLockCmd,getStationList,deleteLocks,deleteStation,deleteStations,addStation, updateStation, getLockList, addLock, updateLock} from '../../api/user.js'
import bluetooth from '../../mixins/bluetooth.js'
import store from '@/store/index.js';
	export default {
		mixins:[bluetooth],
		data() {
			return {
				stationList:[],
				lockList:[],
				lockId:null,
				chooseType:null,
				//用户全局信息
				currentUser:{},
				deleteLock:{},
				userInfo: {},
				currentLock:{},
				currentModal:'',//当前弹窗
				currentModalTitle:'',//当前弹窗标题
				inputDisabled:{
					'detail':true,
					'update':false
				},//判断是否弹窗输入框可用
				searchKeyword:'',
				stype:[{id:'1',name:'工厂'},{id:'2',name:'村庄'}],
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: { iduser: 0, storeflowid: 0 },
		
				stationForm:{},

				
				createItem:{},
				    selectedItem: {
				      stationId: null,
				      location: '',
				      description: '',
					  name:'',
				      // ... 其它需要的字段全部初始化
				    },
				selectedIds:[],
				// 每页数据量
							pageSize: 10,
							// 当前页
							pageCurrent: 1,
							// 数据总量
							total: 4,
				checkboxValue1:[],
				isAll:{
					value:'all',
					name:'全选'},
				humansData: [],
				clickRseIntoData: {
					code: 500,
					msg: '回仓失败'
				},
				clickConsumedData: {
					code: 500,
					msg: '操作失败'
				},
			
				returned: '',
				consumed: '',
				detail:'',
				loadingModal: '', // 控制加锁中模态框的显示隐藏
				loadingText: '处理中，请稍候...', // 加锁中模态框的提示文本
				currentStep: 'step-1', // 当前步骤，用于控制进度条样式
				// 调试信息相关
				debugModal: '',
				debugLogs: [],
				isLoggingEnabled: true,
			};
		},
		
		computed: {
			// 判断是否超级管理员
			isAdmin() {
				let roles = uni.getStorageSync('user').roles || [];
				return roles.some(role => role.id === 1);
			},
		    // 判断是否全选
		    isAllSelected() {
		      return this.humansData.data.length > 0 && this.humansData.data.every(item =>item.checked==true);
		    }
		
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
			this.currentUser=uni.getStorageSync('user')
			this.init();
		},
		methods: {
			// 添加日志记录功能
			logDebug(message, data) {
				if (!this.isLoggingEnabled) return;
				
				const now = new Date();
				const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
				
				let logMessage = message;
				if (data !== undefined) {
					try {
						if (typeof data === 'object') {
							logMessage += ': ' + JSON.stringify(data);
						} else {
							logMessage += ': ' + data;
						}
					} catch (e) {
						logMessage += ': [无法序列化对象]';
					}
				}
				
				console.log(logMessage); // 仍然保留控制台输出
				this.debugLogs.push({
					time: timeStr,
					message: logMessage
				});
				
				// 保持日志数量在合理范围内
				if (this.debugLogs.length > 1000) {
					this.debugLogs = this.debugLogs.slice(-500);
				}
			},
			
			// 显示调试信息弹窗
			showDebugModal() {
				this.debugModal = 'show';
			},
			
			// 清空调试日志
			clearDebugLogs() {
				this.debugLogs = [];
				this.debugModal = '';
			},
			// 显示加载模态框
			showLoadingModal(text = '处理中，请稍候...') {
			  this.loadingText = text;
			  this.loadingModal = 'show';
			  this.logDebug(text); // 添加日志记录
			  
			  // 根据文本中的步骤信息更新当前步骤
			  if(text.includes('步骤1/5')) {
			    this.currentStep = 'step-1';
			  } else if(text.includes('步骤2/5')) {
			    this.currentStep = 'step-2';
			  } else if(text.includes('步骤3/5')) {
			    this.currentStep = 'step-3';
			  } else if(text.includes('步骤4/5')) {
			    this.currentStep = 'step-4';
			  } else if(text.includes('步骤5/5')) {
			    this.currentStep = 'step-5';
			  } else {
			    // 如果没有步骤信息，默认为步骤1
			    this.currentStep = 'step-1';
			  }
			},
			// 隐藏加载模态框
			hideLoadingModal() {
			  this.loadingModal = '';
			  this.logDebug('操作完成，隐藏加载框');
			},
			async bindDevice(device){
				if(device){
					this.logDebug('开始绑定设备', device);
					// 调用蓝牙连接方法
					    // 先断开已连接的设备
					    if (device.deviceId) {
					      try {
					        // 断开当前连接的设备
					        await uni.closeBLEConnection({ deviceId: device.deviceId });
					        this.logDebug('已断开旧设备连接');
					      } catch (err) {
					        this.logDebug('断开连接时出错', err);
					        // 这里可以选择继续连接或抛出错误
					      }
					    }
					  // console.log('device',device)
					  this.connectBluetoothDevice(device);
					  this.device=device;
					  this.logDebug('已尝试连接蓝牙设备', device.deviceId);
				}
			},
			
			// 超级管理员专用开锁功能
			async handleUnlock(lock) {
			  // 显示加载提示
			  this.showLoadingModal('步骤1/5: 初始化开锁操作...');
			  
			  // 根据锁信息获取MAC地址
			  let targetMac = lock.mac.toLowerCase();
			  this.currentLock = lock;
			  this.logDebug('开始开锁操作，目标锁MAC：', targetMac);
			  
			  // 触发蓝牙扫描
			  this.openBluetoothAdapter();
			  
			  // 等待蓝牙扫描完成
			  setTimeout(async () => {
			    this.showLoadingModal('步骤2/5: 扫描附近设备...');
			    
			    // 在扫描到的设备数组中查找与targetMac匹配的设备
			    const device = this.devices.find(dev => {
			      const devMac = dev.deviceId.replace(/:/g, '').toLowerCase();
			      return devMac === targetMac;
			    });
			    
			    if (device) {
			      this.showLoadingModal('步骤3/5: 连接设备中...');
			      
			      // 调用蓝牙连接方法
			      this.connectBluetoothDevice(device);
			      this.device = device;
			      
			      // 等待连接完成
			      await new Promise(resolve => setTimeout(resolve, 3000));
			      this.logDebug('设备已连接，准备发送开锁指令，roll值：', this.roll);
			      
			      // 更新加载提示
			      this.showLoadingModal('步骤4/5: 发送开锁指令...');
			      
			      // 获取并发送01指令
			      await getLockCmd({ id: lock.id, roll: this.roll, type: 0x01 })
			        .then(async res => {
			          let ins01 = [];
			          this.logDebug('获取01指令结果：', res);
			          ins01.push(res.data.data['cmd']);
			          this.logDebug('准备发送01指令：', ins01);
			          await this.sendUnlockInstruct1(ins01);
			        })
			        .catch(err => {
			          this.logDebug('获取01指令失败：', err);
			          uni.showToast({
			            title: '获取开锁指令失败',
			            icon: 'none',
			            duration: 2000
			          });
			        });
			        
			      // 等待01指令处理完成
			      await new Promise(resolve => setTimeout(resolve, 2000));
			      
			      // 更新加载提示
			      this.showLoadingModal('步骤5/5: 发送开锁命令...');
			      
			      // roll值有效，发送开锁指令
			      if (this.roll > 0) {
			        await getLockCmd({ id: lock.id, roll: this.roll, type: 0xE0 })
			          .then(async res => {
			            let insE0 = [];
			            this.logDebug('获取E0开锁指令结果：', res);
			            insE0.push(res.data.data['cmd']);
			            this.logDebug('准备发送E0开锁指令：', insE0);
			            await this.sendUnlockInstruct1(insE0);
			          })
			          .catch(err => {
			            this.logDebug('获取E0开锁指令失败：', err);
			          });
			          
			        // 等待开锁命令处理完成
			        await new Promise(resolve => setTimeout(resolve, 1500));
			        
			        // 开锁成功提示
			        this.hideLoadingModal();
			        uni.showToast({
			          title: '开锁成功',
			          icon: 'success',
			          duration: 2000
			        });
			      } else {
			        // roll值无效，开锁失败
			        this.hideLoadingModal();
			        uni.showToast({
			          title: '开锁失败，请重试',
			          icon: 'none',
			          duration: 2000
			        });
			      }
			    } else {
			      // 未找到设备
			      this.hideLoadingModal();
			      uni.showToast({
			        title: '未找到对应的蓝牙设备，请确认设备是否已开启',
			        icon: 'none',
			        duration: 2000
			      });
			    }
			  }, 5000); // 扫描等待时间设为5秒，提高成功率
			},
			
			// 获取指令
			async getLockInstruct() {
				if (!this.deviceId) {
					uni.$u.toast('请先连接蓝牙锁');
					this.logDebug('未找到设备ID，无法获取指令');
					return;
				}
				
				// 开启按钮loading
				lock.unLockType = 1;
				uni.showLoading({
					title: '与锁通信中...',
					mask: true
				});
				this.logDebug('开始获取锁具指令，设备ID:', this.deviceId);
				
				try {
					// 区分已存在的锁和新锁
					if (this.currentLock) {
						// 已存在锁: 使用锁ID获取01指令
						if (!this.currentLock.id) {
							this.logDebug('锁ID不存在，无法获取指令');
							throw new Error('锁ID不存在');
						}
						
						this.logDebug('获取已存在锁的指令，锁ID:', this.currentLock.id, '滚码值:', this.roll);
						const result = await getLockCmd({ 
							id: this.currentLock.id, 
							roll: this.roll, 
							type: 0x01 
						});
						
						if (!result || !result.data) {
							this.logDebug('获取指令返回数据为空');
							throw new Error('获取指令返回数据为空');
						}
						
						if (result.data && result.data.data) {
							const orders = [result.data.data['cmd']];
							this.logDebug('获取到指令，准备发送', orders);
							await this.sendUnlockInstruct1(orders);
							this.logDebug('已存在锁指令发送完成');
						} else {
							this.logDebug('获取指令失败');
							throw new Error('获取指令失败');
						}
					} else {
						// 新锁: 直接构造01指令
						this.logDebug('准备发送新锁01指令, roll:', this.roll);
						
						if (!this.deviceId.includes(':')) {
							this.logDebug('MAC地址格式错误', this.deviceId);
							throw new Error('MAC地址格式错误');
						}
						
						let buffer = this.GenerateCommand(0x01, this.roll, this.deviceId);
						
						if (!buffer || buffer.byteLength === 0) {
							this.logDebug('生成指令失败');
							throw new Error('生成指令失败');
						}
						
						if (!this.characteristicId || this.characteristicId.length === 0) {
							this.logDebug('特征值不存在');
							throw new Error('特征值不存在');
						}
						
						this.logDebug('开始发送新锁01指令，指令长度:', buffer.byteLength);
						// 使用分包发送
						await new Promise((resolve, reject) => {
							enqueueTask(
								buffer,
								(subBuffer, ok) => {
									setTimeout(() => {
										uni.writeBLECharacteristicValue({
											deviceId: this.deviceId, // 设备id
											serviceId: this.serviceId, // 监听指定的服务
											characteristicId: this.characteristicId[0].uuid.toLowerCase(), // 特征值
											value: subBuffer,
											success: (res) => {
												this.logDebug('子包发送成功');
												ok(res);
											},
											fail: (err) => {
												this.logDebug('发送包失败', err);
												if (err.errCode) {
													initTypes(err.errCode, err.errMsg);
												}
											}
										})
									}, 300);
								},
								(success) => {
									if (success) {
										this.logDebug('新锁01指令发送成功');
										resolve();
									} else {
										this.logDebug('指令发送失败');
										uni.$u.toast('指令发送失败');
										reject(new Error('指令发送失败'));
									}
								}
							);
						});
					}
				} catch (e) {
					this.logDebug('发送指令错误', e);
					uni.$u.toast('通信失败: ' + e.message);
				} finally {
					uni.hideLoading();
					lock.unLockType = 0;
				}
			},
			parseLockData(rawHex) {
			  // 第 11 个字节下标是 10，每字节占 2 个 hex 字符 => 跳过前 20 个 hex 字符
			  const subHex = rawHex.slice(20);
			
			  let data = {};
			  let offset = 0;
			
			  // 1. 硬件版本号 (1字节 => 2个hex字符)
			  data.hardwareVersion = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 2. 软件版本号 (2字节 => 4个hex字符)
			  data.softwareVersion = subHex.slice(offset, offset + 4);
			  offset += 4;
			
			  // 3. 厂商ID (4字节 => 8个hex字符)
			  // data.vendorId = subHex.slice(offset, offset + 8);
			  offset += 8;
			
			  // 4. 报警模式 (1字节 => 2个hex字符)
			  data.alarmMode = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 5. 锁状态 (1字节 => 2个hex字符)
			  data.lockStatus = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 6. 备用数据 (4字节 => 8个hex字符)
			  data.backupDate = subHex.slice(offset, offset + 8);
			  offset += 8;
			
			  // 7. 是否新锁 (1字节 => 2个hex字符)
			  data.newLock = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 8. 开锁记录 (2字节 => 4个hex字符)
			  data.unlockRecord = subHex.slice(offset, offset + 4);
			  offset += 4;
			
			  // 9. 电量 (1字节 => 2个hex字符)
			  data.power = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 10. 静音模式 (1字节 => 2个hex字符)
			  data.muted = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 11. 休眠模式 (1字节 => 2个hex字符)
			  data.hibernate = subHex.slice(offset, offset + 2);
			  offset += 2;
			
			  // 12. 校验和 (1字节 => 2个hex字符) —— 题目要求忽略，不放进 data
			  // 这里可以直接 offset += 2 跳过
			  offset += 2;
			
			  return data;
			},

			goToPageB() {
			  uni.navigateTo({
			    url: '/pages/lock/roster',
			    // 1. 配置 events，用于接收从 B 页面发送回来的数据
			    events: {
			      LockInfo: (data) => {
			        console.log('A 页面收到 B 回传的数据：', data);
			        // 在这里将 data 存到 data() 或 onShow() 里使用
					console.log(this.parseLockData(data.data))
					
			        this.someDataFromB = this.parseLockData(data.data);
			      },
				  LockBaseInfo: (data) => {
				    console.log('A 页面收到 B 回传mac,sn的数据：', data);
				    // 在这里将 data 存到 data() 或 onShow() 里使用
				  				
				  					
				    this.baseDataFromB = data;
				  },
				  InsCount:(data)=>{
					  console.log('A 页面收到 B 回传count的数据：', data);
					  // 在这里将 data 存到 data() 或 onShow() 里使用
					  			
					  				
					  this.roll = data.data;
				  }
			
					  
				  
			    },
			    success: (res) => {
			      // 2. 也可以在 success 回调中给 B 页面发送数据
			      // 不需要就可以不写
			      // res.eventChannel.emit('LockInfo', {
			      //   msg: '来自A页面的测试数据'
			      // });
			    }
			  });
			},
		async createOrupdate(){
		  if(this.currentModal=='create'){
		    this.logDebug('开始添加锁具操作');
		    this.logDebug('选择的表单数据', this.selectedItem);
		    this.logDebug('设备基础信息', this.baseDataFromB);
		    this.logDebug('当前用户ID', this.currentUser.id);
		    
		    // 显示加锁中模态框
		    this.showLoadingModal('步骤1/5: 初始化设备添加...');
		    await new Promise(resolve => setTimeout(resolve, 800));
		    
		    this.logDebug('设备MAC地址', this.deviceId.replace(/:/g, '').toLowerCase());
		    
		    // 更新模态框显示 - 步骤2
		    this.showLoadingModal('步骤2/5: 连接设备中...');
		    await new Promise(resolve => setTimeout(resolve, 1500));
		    
		    // 更新模态框显示 - 步骤3
		    this.showLoadingModal('步骤3/5: 发送设备初始化指令...');
		    await getLock01Cmd({Roll:this.roll,Mac:this.deviceId.replace(/:/g, '').toLowerCase()}).then(res=>{
		      this.logDebug('获取01cmd指令返回', res);
		      let ins=[]
		      ins.push(res.data.data['cmd']);
		      this.logDebug('准备发送01cmd指令', ins);
		      this.sendUnlockInstruct1(ins);
		    }).catch(err => {
		      this.logDebug('获取01cmd指令失败', err);
		    });

		    // 等待指令处理完成
		    await new Promise(resolve => setTimeout(resolve, 2000));
		    this.logDebug('01cmd指令处理完成，roll值', this.roll);
		    
		    //根据id取10命令，请求10命令更改密钥
		    let curkey=null;
		    
		    // 更新模态框显示 - 步骤4
		    this.showLoadingModal('步骤4/5: 更新设备密钥...');
		    await getLock10Cmd({ Roll: this.roll,Mac:this.deviceId.replace(/:/g, '').toLowerCase() })
		      .then(async res => {
		        this.logDebug('获取10cmd指令返回', res);
		        let ins=[]
		        curkey=res.data.data['key'];
		        this.logDebug('获取到新密钥', curkey);
		        ins.push(res.data.data['cmd']);
		        this.logDebug('准备发送10cmd指令', ins);
		        await this.sendUnlockInstruct1(ins);
		      }).catch(err => {
		        this.logDebug('获取10cmd指令失败', err);
		      });
		    
		    // 等待密钥更新完成
		    await new Promise(resolve => setTimeout(resolve, 2000));
		    this.logDebug('10cmd指令处理完成，roll值', this.roll);
		    
		    if(this.roll===0){
		      this.logDebug('Roll值为0，添加失败');
		      this.hideLoadingModal();
		      uni.showToast({
		        title: '添加失败！请重新添加锁具！',
		        icon: 'none',
		        duration: 2000
		      });
		      await uni.closeBLEConnection({ deviceId: this.deviceId });
		      this.devices=[]
		    }else{
		      // 更新模态框显示 - 步骤5
		      this.showLoadingModal('步骤5/5: 保存设备信息...');
		      
		      // 准备保存的锁具数据
		      const lockData = {
		        adminId: this.currentUser.id,
		        enable: true,
		        ...this.selectedItem,
		        ...this.baseDataFromB,
		        ...this.someDataFromB
		      };
		      this.logDebug('准备保存锁具数据', lockData);
		      
		      await addLock(lockData).then(res=>{
		        this.lockId=res.data.data;
		        this.logDebug('锁具保存成功，获取到锁ID', this.lockId);
		      }).catch(err => {
		        this.logDebug('锁具保存失败', err);
		      });
		      
		      await updateLock({currentKey:curkey,id:this.lockId},this.lockId).then(res=>{
		        this.logDebug('更新锁具密钥成功', res);
		      }).catch(err => {
		        this.logDebug('更新锁具密钥失败', err);
		      });
		      
		      			      // 显示添加成功提示
			      this.hideLoadingModal();
			      uni.showToast({
			        title: '添加成功！',
			        icon: 'success',
			        duration: 2000
			      });
		    }
		  }
		  
		  if(this.currentModal=='update'){
		    this.logDebug('开始更新锁具', this.selectedItem);
		    let {id,code,name,adminUserId,stationType}=this.selectedItem;
		    
		    this.showLoadingModal('正在更新设备信息...');
		    await updateLock(this.selectedItem,id).then(res=>{
		      this.logDebug('更新锁具成功', res);
		      this.hideLoadingModal();
		      uni.showToast({
		        title: '更新成功！',
		        icon: 'success',
		        duration: 2000
		      });
		    }).catch(err => {
		      this.logDebug('更新锁具失败', err);
		      this.hideLoadingModal();
		    });
		  }
		  this.navigateTo({
		    type: 'closemodal',
		    id: 'detail'
		  });
		  this.init()
		},
			// 多选处理
					selectedItems() {
						return this.selectedIndexs.map(i => this.stationList[i]['id'])
					},
					// 多选
					selectionChange(e) {
						console.log(e.detail.index)
						this.selectedIndexs = e.detail.index
					},
					//批量删除
					// delTable() {
					// 	console.log(this.selectedItems())
					// },
					// 分页触发
					async change(e) {
						this.$refs.table.clearSelection()
						this.selectedIndexs.length = 0
						await this.getData(e.current)
					},
				async onDelete(type,item={}){
					if(type=='batch'){
						console.log('selectedItems',this.selectedItems())
						let ids=this.selectedItems()
						this.showLoadingModal('批量删除设备中...');
						await deleteLocks({ids:ids}).then(res=>{
							console.log('xxxxxxxxxx',res)
							this.hideLoadingModal();
							if(res.data.code==10002){
								uni.clearStorageSync()
								this.navigateTo({
								  type: 'page',
								  url: 'login'
								});
							} else {
								uni.showToast({
								  title: '删除成功！',
								  icon: 'success',
								  duration: 2000
								});
							}
						})
					}else{
						let ins = [];
						// 根据 step.lockId 在 lockList 中查找对应的锁信息
						let curlock = item
						this.currentLock=curlock
						if (!curlock) {
						  uni.showToast({
						    title: '未找到对应锁的信息',
						    icon: 'none',
						    duration: 2000
						  });
						  return;
						}
						
						this.showLoadingModal('步骤1/5: 初始化删除操作...');
						// 蓝牙模块中，扫描到的设备，其 deviceId（去掉冒号并转为小写）作为 mac 值
						let targetMac = curlock.mac.toLowerCase();
						// 触发蓝牙扫描（内部会调用 openBluetoothAdapter、getBluetoothAdapterState、findBluetooth 等）
						this.openBluetoothAdapter();
						
						// 等待蓝牙扫描结果更新（优化为更合理的时间）
						setTimeout(async () => {
						  // 在扫描到的设备数组（this.devices）中查找与 targetMac 匹配的设备
						  this.showLoadingModal('步骤2/5: 扫描附近设备...');
						  const device = this.devices.find(dev => {
						    const devMac = dev.deviceId.replace(/:/g, '').toLowerCase();
						    return devMac === targetMac;
						  });
						  
						  if (device) {
						    // 调用蓝牙连接方法
							this.showLoadingModal('步骤3/5: 连接设备中...');
							this.device=device
						    this.connectBluetoothDevice(device);
							
							// 增加等待时间，让连接有足够时间完成（改为更合理的时间）
							await new Promise(resolve => setTimeout(resolve, 2500));
							
							this.showLoadingModal('步骤4/5: 发送初始化指令...');
							await getLockCmd({ id: this.currentLock.id, roll: this.roll, type: 0x01 })
							  .then(async res => {
							console.log('蓝牙设备roll1111111:', this.roll);
							let ins=[]
							
							ins.push(res.data.data['cmd']);
							await this.sendUnlockInstruct1(ins);
						
						  });
						if(this.roll==0){
							this.roll+=1
						}
						
						// 等待初始化指令处理完成
						await new Promise(resolve => setTimeout(resolve, 2000));
							  
						this.showLoadingModal('步骤5/5: 解绑设备...');
						  // 发送指令（类型 0x1F）
						  await getLockCmd({ id: this.currentLock.id, roll: this.roll, type: 0x1F })
						    .then(async res => {
								console.log('蓝牙设备rollffffffffff:', this.roll);
								let ins1F=[]
							ins1F.push(res.data.data['cmd']);
							await this.sendUnlockInstruct1(ins1F);
							// 等待解绑指令处理完成
							await new Promise(resolve => setTimeout(resolve, 1500));
							
							await deleteLocks({ids:[item.id]}).then(res=>{
								console.log('xxxxxxxxxx',res)
								this.hideLoadingModal();
								if(res.data.code==10002){
									uni.clearStorageSync()
									this.navigateTo({
									  type: 'page',
									  url: 'login'
									});
								} else {
									uni.showToast({
									  title: '删除成功！',
									  icon: 'success',
									  duration: 2000
									});
								}
						    });
				
							this.devices=[]
							
							}).catch(err=>{
								this.hideLoadingModal();
								uni.showToast({
								  title: err,
								  icon: 'none',
								  duration: 2000
								});
							})		
							
							this.init()		
							
						  } else {
						    // 未找到设备给出提示
							this.hideLoadingModal();
						    uni.showToast({
						      title: '未找到对应的蓝牙设备，请确认设备是否已开启',
						      icon: 'none',
						      duration: 2000
						    });
						  }
						}, 4000); // 蓝牙扫描等待时间增加到4秒，提高设备查找成功率
					}
				},
				async getData(index){
					await	 getLockList({pageNo:index}).then(res=>{
							console.log(res)
							if(res.data.code==10002){
								uni.clearStorageSync()
								this.navigateTo({
								  type: 'page',
								  url: 'login'
								});
							}
							this.lockList=res.data.data.pageData
						
						})
					},
		
			async onSearch(){
				await  getLockList({sn:this.searchKeyword}).then(res=>{
				console.log('onSearch',this.searchKeyword,res)
				if(res.data.code==10002){
					uni.clearStorageSync()
					this.navigateTo({
					  type: 'page',
					  url: 'login'
					});
				}
				this.lockList=res.data.data.pageData
				this.total=res.data.data.total
				});
				
			},
			async init() {
		await getLockList({pageNo: this.pageCurrent}).then(res=>{
		console.log('xxxxxxxxx',res)
		if(res.data.code==10002){
			uni.clearStorageSync()
			this.navigateTo({
			  type: 'page',
			  url: 'login'
			});
		}
		this.lockList=res.data.data.pageData
		this.total=res.data.data.total
		});
				this.searchKeyword=null
				await getStationList({pageNo:-1}).then(res=>{
				console.log(res)
				if(res.data.code==10002){
					uni.clearStorageSync()
					this.navigateTo({
					  type: 'page',
					  url: 'login'
					});
				}
				this.stationList=res.data.data.pageData
				
				});
	
			},
	
			 // 切换单个复选框的状态
			  	checkboxChange: function (e) {
			  				var items = this.humansData.data
			  					
								console.log(items)
								console.log(e)
							
							var item=items.filter(item=>item.id==e.detail.value[0].id)
							console.log(item)
					
			  				for (var i = 0, lenI = items.length; i < lenI; ++i) {
			  					const item = items[i]
			  					if(e.detail.value[0].id==item.id){
			  						this.$set(item,'checked',true)
			  					}else{
			  						this.$set(item,'checked',false)
			  					}
			  				}
			  			},
			    // 切换全选/取消全选
			    toggleAll(e) {
			
				  console.log(e)
			
			      if (e.detail.value[0]) {
			        // 如果全选，就将当前页面的所有 id 加入 selectedIds
			         this.humansData.data.map(item => this.$set(item,'checked',true));
			      } else {
			        // 如果取消全选，就清空 selectedIds
			         this.humansData.data.map(item => this.$set(item,'checked',false));
			      }
			    },
		
	
			// 获取用户信息（新） 自定义方法
		
		
		
		async clickDetailFunction(param,e) {
				if(e=='create'){
					this.currentModal='create'
					this.currentModalTitle='创建'
					  this.selectedItem = {
					        stationId: '',
					        location: '',
					        description: '',
							name:'',
					        // ... 其它字段的默认值
					      }
				
				
				}
				if(e=='update'){
					 this.currentModal = 'update'
					      this.currentModalTitle = '修改'
					      // 用要修改的那条数据来覆盖
					      this.selectedItem = { ...param }
						  console.log('testSELECT',this.selectedItem)
	
				}

			
			
				//打开弹窗
				this.navigateTo({
					type: 'openmodal',
					id: 'detail'
				});
			},
			
			// 点击回仓按钮触发 自定义方法
			async clickReturnFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				this.globalData.storeflowid = 0;
				console.log("xxxxxxxxx");

				//正式赋值
				console.log(param.index);
				
				thiz.globalData.storeflowid = thiz.humansData.data[param.index].id;

				//打开弹窗
				thiz.navigateTo({
					type: 'openmodal',
					id: 'returned'
				});
			},
			async handleDeletelock(step) {
				
			},

			// 点击消耗按钮触发 自定义方法
			async clickConsumedFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				thiz.globalData.storeflowid = 0;
				console.log(thiz.humansData.data[param.index].id);

				//正式赋值
				thiz.globalData.storeflowid = thiz.humansData.data[param.index].id;

				//打开弹窗
				thiz.navigateTo({
					type: 'openmodal',
					id: 'consumed'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 父容器：让所有子元素在同一行、垂直居中 */
	.toolbar {
	  display: flex;
	  align-items: center;
	  padding: 1rpx;
	  background-color: #f8f8f8; /* 浅色背景，区分内容区域 */
	}
	
	/* 按钮样式 */
	.btn {
	  height: 50rpx;
	  line-height: 50rpx;
	  margin-right: 12rpx;
	  padding: 0 16rpx;
	  background-color: #007aff; /* 主色 */
	  color: #fff;
	  border-radius: 6rpx;
	  font-size: 24rpx;
	  box-sizing: border-box; 
	}
	
	/* 将搜索框区域顶到右侧 */
	.search-box {
	  display: flex;
	  align-items: center;
	  margin-left: auto; /* 左侧自动扩展，把搜索框推到右边 */
	}
	
	/* 搜索输入框，和按钮同高 */
	.search-input {
	  width: 240rpx;
	  height: 50rpx;
	  line-height: 50rpx;
	  border: 1rpx solid #ccc;
	  border-radius: 6rpx;
	  margin-right: 12rpx;
	  padding: 0 10rpx;
	  font-size: 24rpx;
	  box-sizing: border-box;
	}
	
	/* 模态框居中显示 */
	.diygw-modal.basic {
	
	}
	
	.flex2-clz {
		margin-left: 0px;
		width: 100% !important;
		margin-top: 20px;
		margin-bottom: 5px;
		margin-right: 0px;
	}
	.text5-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex3-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex4-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text6-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text7-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text8-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text9-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex5-clz {
		border-bottom: 1px solid #b1b1b1;
	}
	.text10-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text11-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text16-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text18-clz {
		padding-top: 5px;
		color: #ffaa00;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text19-clz {
		padding-top: 5px;
		color: #f90101;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text18-detail-clz {
		padding-top: 5px;
		color: #00ff00;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex9-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 20px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.text17-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex10-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex11-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text20-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text21-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text22-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text23-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex12-clz {
		border-bottom: 1px solid #b1b1b1;
	}
	.text24-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text25-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text26-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text27-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex-clz {
		margin-left: 0px;
		width: 100% !important;
		margin-top: 20px;
		margin-bottom: 5px;
		margin-right: 0px;
	}
	.text-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex1-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex7-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text1-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text2-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text3-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text4-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex8-clz {
		border-bottom: 1px solid #b1b1b1;
	}
	.text12-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text13-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text14-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text15-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.return-clz {
		z-index: 1000000;
	}
	.diygw-dialog-return {
		width: 95%; /* 或具体宽度如 600rpx */
		max-width: 800rpx;
	}
	.text28-clz {
		padding-top: 5px;
		padding-left: 5px;
		font-size: 18px !important;
		padding-bottom: 5px;
		padding-right: 5px;
	}
	.consumed-clz {
		z-index: 1000000;
	}
	.diygw-dialog-consumed {
	}
	.text29-clz {
		padding-top: 5px;
		padding-left: 5px;
		font-size: 18px !important;
		padding-bottom: 5px;
		padding-right: 5px;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
	.uni-container{
		width: 100%;
	}

.diygw-dialog-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 确保真正居中 */
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  width: 500rpx;
  height: 300rpx;
  padding: 30rpx;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-icon {
  margin-bottom: 20rpx;
}

.loading-spinner {
  width: 90rpx;
  height: 90rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20rpx;
}

/* 添加进度条样式 */
.progress-bar {
  width: 100%;
  height: 10rpx;
  background-color: #f3f3f3;
  border-radius: 5rpx;
  margin-top: 20rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007aff;
  border-radius: 5rpx;
  width: 20%; /* 默认值 */
  transition: width 0.3s ease-in-out;
}

/* 当步骤为 1/5 时 */
.step-1 .progress-fill {
  width: 20%;
}

/* 当步骤为 2/5 时 */
.step-2 .progress-fill {
  width: 40%;
}

/* 当步骤为 3/5 时 */
.step-3 .progress-fill {
  width: 60%;
}

/* 当步骤为 4/5 时 */
.step-4 .progress-fill {
  width: 80%;
}

/* 当步骤为 5/5 时 */
.step-5 .progress-fill {
  width: 100%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 调试信息弹窗样式 */
.diygw-dialog-debug {
  width: 90%;
  max-width: 650rpx;
  max-height: 80vh;
}

.debug-content {
  margin: 20rpx 0;
  border: 1px solid #eee;
  border-radius: 8rpx;
}

.debug-log-item {
  padding: 10rpx;
  font-size: 24rpx;
  border-bottom: 1px solid #f5f5f5;
  word-break: break-all;
  font-family: monospace;
}

.debug-log-item:nth-child(odd) {
  background-color: #f9f9f9;
}

.button-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.button-row button {
  margin: 0 4rpx;
}

</style>
