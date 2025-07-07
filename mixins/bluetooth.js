import {
	getLockCmd,
	updateLock,
	stepOrder,
	MupdateLock,
} from '../api/user'
import store from '@/store/index.js';
import {
	enqueueTask
} from './blePackage.js'
let lock = null

export default {
	data() {
		return {
			hasShownConnectSuccess: false, // 新增：是否已显示过连接成功提示
			servicesInitialized: false, // 新增：标记服务和特征值是否已初始化
			curkey:'',
			unLockType: 0, //1蓝牙开锁、2网关开锁
			list: [], // 已搜索到的蓝牙设备
			adapterState: [], //  适配器状态
			isLock: false, //是否开锁。蓝牙开锁出现问题重试
			isConnect: false, //是否连接锁成功
			deviceId: '', //锁的mac地址
			JudegeDeviceId: 'F6980DB69313', // 匹配要连接蓝牙用的设备id F6980DB69313 EC8275CE0A00
			locktimer: null, //搜索锁的计时器
			serviceId: '', // uuid
			characteristicId: [], // 特征值集合
			devices: [],
			loadingText: '正在连接蓝牙...',
			backData: [], // 蓝牙返回的数据集合
			orderType: 1, // 命令
			roll: 0,
			baseDataFromB: {},
			someDataFromB: {},
			deviceDebug:{},
		}
	},
	created() {
		lock = this
		this.getLockMacAddress();
	},
	watch: {
		backData: {
			handler(newVal) {
				let result = '';
				for (let i = 0; i < newVal.length; i++) {
					newVal[i] = newVal[i].slice(2, newVal[i].length);
					result += newVal[i];
				}
				// console.log('结果 result',result);
				if (result.length) {
					console.log('指令类型', this.orderType);
					// this.decryptionResult(result);
				}
			},
			deep: true
		}
	},
	methods: {
		// 将十六进制字符串转为 byte 数组
		// hexStringToBytes(hexString) {
		//   if (hexString.startsWith('0x') || hexString.startsWith('0X')) {
		//     hexString = hexString.slice(2);
		//   }
		//   if (hexString.length % 2 !== 0) {
		//     throw new Error('无效的十六进制字符串，长度不是偶数');
		//   }
		//   const byteArray = [];
		//   for (let i = 0; i < hexString.length; i += 2) {
		//     const byte = parseInt(hexString.slice(i, i + 2), 16);
		//     if (isNaN(byte)) {
		//       throw new Error('无效的十六进制字符串，包含非十六进制字符');
		//     }
		//     byteArray.push(byte);
		//   }
		//   return byteArray;
		// },
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
		// 将 MAC 地址由 "C1:01:01:01:E1:B2" 解析为 [193, 1, 1, 1, 225, 178] ...
		parseMacAddress(macStr) {
			const parts = macStr.split(':');
			const bytes = parts.map(part => parseInt(part, 16));
			return bytes;
		},

		// 返回 6 字节的时间戳数组 [year, month, day, hour, minute, second] (year 只取 mod 100)
		getTimestamp() {
			const now = new Date();
			const year = now.getFullYear() % 100;
			const month = now.getMonth() + 1;
			const day = now.getDate();
			const hour = now.getHours();
			const minute = now.getMinutes();
			const second = now.getSeconds();
			return [
				year & 0xFF,
				month & 0xFF,
				day & 0xFF,
				hour & 0xFF,
				minute & 0xFF,
				second & 0xFF
			];
		},


		GenerateCommand(cmd, roll, mac) {
			const b = new Uint8Array(17);
			// 将 mac 转成字节数组

			let byteMac = this.parseMacAddress(mac);
			console.log('in gen')
			// b[0] ~ b[3] 4字节
			b[0] = cmd; // 例如 0xE0
			b[1] = roll; // 滚码计数
			b[2] = 0x00;
			b[3] = 0x0D;
			// 拷贝 MAC 到 b[4..9]（6字节）
			for (let i = 0; i < 6; i++) {
				b[4 + i] = byteMac[i] & 0xFF;
			}
			// 拷贝 Timestamp 到 b[10..15]（6字节）
			const timestamp = this.getTimestamp();
			for (let i = 0; i < 6; i++) {
				b[10 + i] = timestamp[i];
			}
			// 前16字节累加求和 => b[16]
			let sum = 0;
			for (let i = 0; i < 16; i++) {
				sum += b[i];
			}
			b[16] = sum & 0xFF;
			console.log('指令内容:', b);
			return b.buffer; // 返回 ArrayBuffer
		},
		Generate13Command(cmd, roll, mac, timeStamp) {
			// 注意：总字节数为 4 + 6 + 1 + 6 + 1 = 18，所以需要创建长度为 18 的数组
			const b = new Uint8Array(18);

			// 将 mac 地址字符串转换为字节数组（你需要实现或确保 parseMacAddress 函数正确）
			let byteMac = this.parseMacAddress(mac);
			console.log('in gen13');

			// 1. 填充前4字节：b[0] ~ b[3]
			b[0] = cmd; // 例如 0xE0
			b[1] = roll; // 滚码计数
			b[2] = 0x00;
			b[3] = 0x14;

			// 2. 将 MAC 地址复制到 b[4] ~ b[9]（6字节）
			for (let i = 0; i < 6; i++) {
				b[4 + i] = byteMac[i] & 0xFF;
			}

			// 3. b[10] 固定为 0x01
			b[10] = 0x01;

			// 4. 将 timeStamp 字符串解析到 b[11] ~ b[16]（6字节）
			//    假设 timeStamp 为 12 位字符串，每两位表示一个字节（例如："190209110311"）
			if (timeStamp.length !== 12) {
				throw new Error("timeStamp 字符串长度必须为12位");
			}
			for (let i = 0; i < 6; i++) {
				// 每两位作为一个字符串
				const pair = timeStamp.substr(i * 2, 2);
				// 按16进制解析（例如 "19" 解析为 0x19）
				b[11 + i] = parseInt(pair, 16);
			}

			// 5. 前17字节累加求和，结果放入 b[17]（校验和）
			let sum = 0;
			for (let i = 0; i < 17; i++) {
				sum += b[i];
			}
			b[17] = sum & 0xFF; // 保留低8位

			console.log('指令内容:', b);
			return b.buffer; // 返回 ArrayBuffer
		},

		// ArrayBuffer转16进度字符串
		ab2hex(buffer) {
			const hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				}
			)
			return hexArr.join('')
		},
		//优化buffer
		hexStringToBuffer(hexString) {
			try {
				const cleanedHexString = hexString.toLowerCase().replace(/[^0-9a-f]/g, '');
				if (cleanedHexString.length % 2 !== 0) {
					uni.$u.toast('十六进制字符串长度必须为偶数');
					return new ArrayBuffer(0);
				}
				// 计算字节数
				const length = cleanedHexString.length / 2;
				// 创建一个新的 ArrayBuffer
				const buffer = new ArrayBuffer(length);
				const view = new Uint8Array(buffer);
				// 每两个字符转换为一个字节，并写入 ArrayBuffer
				for (let i = 0; i < length; i++) {
					view[i] = parseInt(cleanedHexString.substr(i * 2, 2), 16);
				}
				return buffer;
			} catch (error) {
				uni.$u.toast('处理十六进制字符串失败: ' + error.message);
				return new ArrayBuffer(0);
			}
		},

		// 生成buffer
		getBuffer(str) {
			let arr = []
			for (let i = 0; i < str.length; i++) {
				if ((i + 1) % 2 == 0) {
					arr.push('0x' + str[i - 1] + str[i])
				}
			}
			// console.log('字节长度',arr.length);
			const buffer = new ArrayBuffer(arr.length)
			const dataView = new DataView(buffer)
			arr.forEach((item, i) => {
				dataView.setUint8(i, item)
			})
			return buffer
		},
		// 是否是目标设备（可根据你的实际项目做改动）
		isTargetDevice(advertisData, targetName) {
			try {
				if (!advertisData || advertisData.length < 26) {
					return false;
				}
				const extractedName = advertisData.slice(12, 26);
				return extractedName.toLowerCase() === targetName.toLowerCase();
			} catch (error) {
				console.error('设备匹配错误:', error);
				return false;
			}
		},

		// 初始化蓝牙
		openBluetoothAdapter() {
			this.unLockType = 1;
			
			if (this.logDebug) this.logDebug('开始初始化蓝牙适配器');
			uni.openBluetoothAdapter({
				success(res) {
					if (lock.logDebug) lock.logDebug('蓝牙适配器初始化成功');
					lock.isConnect = false
					lock.isLock = false
					lock.getBluetoothAdapterState();
				},
				fail(e) {
					uni.hideLoading();
					lock.unLockType = 0;
					if (lock.logDebug) lock.logDebug('蓝牙适配器初始化失败', e);
					if (e.errCode !== 0) {
						initTypes(e.errCode, e.errMsg);
					}
				}
			})
		},
		//获取本机蓝牙适配器状态
		getBluetoothAdapterState() {
			uni.getBluetoothAdapterState({
				success: res => {
					console.log('获取本机蓝牙适配器状态', JSON.stringify(res));
					if (this.logDebug) this.logDebug('获取本机蓝牙适配器状态', res);
					lock.adapterState = res;
					uni.onBLEConnectionStateChange(this.bleConnectionStateChangeHandler);
					lock.findBluetooth()
				},
				fail: e => {
					this.unLockType = 0;
					if (this.logDebug) this.logDebug('获取蓝牙适配器状态失败', e);
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					}
				}
			});
		},
		bleConnectionStateChangeHandler(res) {			 
			console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
			if (lock.logDebug) lock.logDebug(`设备 ${res.deviceId} 连接状态变化`, res.connected ? '已连接' : '已断开');
			if (res.connected) {
				// 连接成功
			} else {
				// 连接断开，重置服务初始化状态
				this.servicesInitialized = false;
			}
		},
		
		// 开始搜寻附近的蓝牙
		findBluetooth() {
			// uni.showLoading({
			// 	title: lock.loadingText,
			// 	mask: true
			// });
			uni.startBluetoothDevicesDiscovery({
				success(res) {
					// 开启监听回调
					uni.onBluetoothDeviceFound(lock.watchNewBluetooth)
					lock.locktimer = setTimeout(() => {
						if (lock.devices.length === 0) {
							uni.$u.toast('未找到匹配的蓝牙锁设备');
						} else {
							uni.showToast({
								title: '搜寻到设备',
								icon: 'none',
								duration: 1000,
								complete: function() {
									uni.stopBluetoothDevicesDiscovery()
								}
							});
						}
					}, 1000 * 3)
				},
				fail(e) {
					uni.hideLoading();
					if (e.errCode !== 0) {
						initTypes(e.errCode, e.errMsg);
					} else {
						uni.$u.toast('搜索蓝牙设备失败: ' + e.errMsg);
					}
				}
			})
		},
		//监听附近设备
		watchNewBluetooth(res) {
			try {
				if (!res || !res.devices || !Array.isArray(res.devices)) {
					return;
				}
				
				res.devices.forEach(device => {
					try {
						if (!device.advertisData) {
							return;
						}
						let x = this.ab2hex(device.advertisData || new ArrayBuffer(0));
						if (this.isTargetDevice(x, '626c654c6f636b')) {
							let mac = device.deviceId.replace(/:/g, '');
							console.log('发现符合条件的设备:', device, 'MAC:', mac);
														// // 保存设备信息到debug对象
														// this.deviceDebug = {
														// 	name: device.name || '未知名称',
														// 	deviceId: device.deviceId,
														// 	advertisServiceUUIDs: device.advertisServiceUUIDs || [],
														// 	mac: mac,
														// 	advertisData: x
														// };
														// // 显示设备信息
														// uni.$u.toast('设备信息：' + JSON.stringify(this.deviceDebug));
							uni.hideLoading();
							if (!this.devices.find(d => d.deviceId === device.deviceId)) {
								this.devices.push({
									name: device.name || '未知名称',
									deviceId: device.deviceId,
									advertisServiceUUIDs: device.advertisServiceUUIDs || []
								});
							}
						}
					} catch (deviceError) {
						console.error('处理设备数据错误:', deviceError);
					}
				});
			} catch (error) {
				console.error('监听蓝牙设备发现错误:', error);
				uni.$u.toast('监听蓝牙设备发现错误');
			}
		},
		// 用户点击列表中的"连接"按钮时调用
		connectBluetoothDevice(device) {
			try {
				 // 重置连接成功提示标志
				 this.hasShownConnectSuccess = false;
				if (!device || !device.deviceId) {
					uni.$u.toast('设备信息不完整');
					return;
				}
				uni.stopBluetoothDevicesDiscovery(); // 可选：停止搜索
				this.roll = 0
				this.isConnect = false;
				this.isLock = false;
				this.deviceId = device.deviceId.toString();
			
				// if (!device.advertisServiceUUIDs || device.advertisServiceUUIDs.length === 0) {
				// 	uni.$u.toast('设备服务UUID不存在');
				// 	return;
				// }

				this.lockname = device.name ? device.name.toString() : '未知设备';
				this.baseDataFromB = {
					mac: this.deviceId.replace(/:/g, ''),
					sn: this.lockname,
					factoryId: this.lockname,
					factoryKey: '123456789abcef0123456789abcddeef',
					currentKey: '123456789abcef0123456789abcddeef'
				}
				
				// 开始连接
				this.createBLEConnection();
			} catch (error) {
				console.error('连接设备错误:', error);
				uni.$u.toast('连接设备错误: ' + error.message);
			}
		},
		// 连接蓝牙
		createBLEConnection() {
			if (this.logDebug) this.logDebug('开始连接蓝牙设备', lock.deviceId);
			uni.createBLEConnection({
				deviceId: lock.deviceId,
				timeout: 1000 * 60,
				success(res) {
					// 需要延迟
					if (lock.logDebug) lock.logDebug('蓝牙连接成功，准备获取服务');
					setTimeout(() => {
						// 知道服务和特征值，直接监听
						// lock.notifyBLECharacteristicValueChange()
						// 获取服务，再获取特征值，这里写死，就不用再获取
						
						uni.setBLEMTU({
							deviceId: lock.deviceId,
							 mtu: 512,
							success: function(e) {
							 			console.log("设置蓝牙最大传输单元成功",lock.deviceId)
										if (lock.logDebug) lock.logDebug("设置蓝牙MTU成功", e);
							 		},
							fail: function(ree) {
							 			console.log("设置蓝牙最大传输单元失败失败")
										if (lock.logDebug) lock.logDebug("设置蓝牙MTU失败", ree);
							 		}
						 })
						 lock.getServices()
						// lock.getCharacteristics() // 获取特征值
					}, 3000)
					// 关闭搜索 
				},
				fail(e) {
					uni.hideLoading();
					if (lock.logDebug) lock.logDebug('蓝牙连接失败', e);
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					} else {
						uni.$u.toast('连接蓝牙失败，请重试！')
					}
				}
			})
		},
		// 获取蓝牙服务
		getServices() {
			return new Promise((resolve, reject) => {
				this.getBLEDeviceServices('FFF0', lock.deviceId)
					.then(async services => {
						console.log("getBLEDeviceServices=", services)
						lock.serviceId = services.serviceId;
						await new Promise(resolve => setTimeout(resolve, 1000));
						await lock.getCharacteristics();
						// 标记服务和特征值已初始化
						lock.servicesInitialized = true;
						resolve(services);
					})
					.catch(err => {
						uni.$u.toast('连接蓝牙服务失败，请重试！')
						uni.hideLoading();
						lock.servicesInitialized = false;
						reject(err);
					});
			});
		},
		
		// 获取蓝牙设备服务
		getBLEDeviceServices(serviceUUID = 'FFF0', deviceId) {
			console.log('获取指定蓝牙设备所有服务', 'serviceUUID=',serviceUUID, 'deviceId=', deviceId)
			return new Promise((resolve, reject) => {
				const tryGetServices = (attempt = 1, maxAttempts = 3) => {
					uni.getBLEDeviceServices({
						deviceId: deviceId,
						success: function (res) {
							console.log("getBLEDeviceServices=", res)
							const services = {
								serviceId: null
							}
							// 检查是否有服务返回
							if (res.services && res.services.length > 0) {
								// 查找主服务，并且UUID包含FFF0
								res.services.forEach((item) => {
									if (item.isPrimary && item.uuid.indexOf(serviceUUID) != -1) {
										services.serviceId = item.uuid
									}
								})
							}
							
							// 如果找不到服务且尚未达到最大尝试次数，则重试
							if (!services.serviceId && attempt < maxAttempts) {
								console.log(`未找到服务，${attempt}/${maxAttempts}次尝试，等待后重试...`);
								setTimeout(() => tryGetServices(attempt + 1, maxAttempts), 1500);
							} else if (!services.serviceId) {
								reject(new Error('未找到目标服务'));
							} else {
								resolve(services);
							}
						},
						fail: function(err) {
							if (attempt < maxAttempts) {
								console.log(`获取服务失败，${attempt}/${maxAttempts}次尝试，等待后重试...`);
								setTimeout(() => tryGetServices(attempt + 1, maxAttempts), 1500);
							} else {
								reject(err);
							}
						}
					})
				};
				
				tryGetServices();
			})
		},
		// 获取特征值
		getCharacteristics() {
			return new Promise((resolve, reject) => {
				console.log('正在获取特征值，设备ID:', lock.deviceId, '服务ID:', lock.serviceId);
				uni.getBLEDeviceCharacteristics({
					deviceId: lock.deviceId, // 设备ID C10101010C1A
					serviceId: lock.serviceId, // 服务UUID
					success(res) {
						console.log('获取特征值成功，返回数据:', JSON.stringify(res));
						if (!res.characteristics || res.characteristics.length === 0) {
							uni.$u.toast('未找到设备特征值');
							uni.hideLoading();
							lock.servicesInitialized = false;
							reject(new Error('未找到设备特征值'));
							return;
						}
						
						lock.characteristicId = res.characteristics || [];
						lock.notifyBLECharacteristicValueChange();
						lock.onBLECharacteristicValueChange(); // 指令发送成功后监听数据回传
						let x = {
							'deviceId': lock.deviceId,
							'serviceId': lock.serviceId,
							'characteristicId': lock.characteristicId
						}
						// store.dispatch('updateLock', x)
						lock.loadingText = '解析设备中，请稍后...';
						resolve(res);
					},
					fail(err) {
						uni.hideLoading();
						console.error('获取特征值失败，设备ID:', lock.deviceId, '服务ID:', lock.serviceId, '错误信息:', JSON.stringify(err));
						uni.$u.toast('连接蓝牙特征失败，请重试！\n设备ID: ' + lock.deviceId + '\n服务ID: ' + lock.serviceId);
						lock.servicesInitialized = false;
						reject(err);
					}
				})
			});
		},
		// 开启监听 
		notifyBLECharacteristicValueChange() {
			if (this.logDebug) this.logDebug('开始启用特征值变化通知', {
				deviceId: lock.deviceId,
				serviceId: lock.serviceId,
				characteristicId: lock.characteristicId ? lock.characteristicId[1]['uuid'] : ''
			});
			
			uni.notifyBLECharacteristicValueChange({
			  deviceId: lock.deviceId, // 设备id
			  serviceId: lock.serviceId, // 监听指定的服务
			  characteristicId: lock.characteristicId ? lock.characteristicId[1]['uuid'] : '', // 监听对应的特征值
			  async success(res) {
				// 设置连接成功标志
				if (lock.logDebug) lock.logDebug('特征值通知开启成功');
				lock.isConnect = true
				await new Promise(resolve => setTimeout(resolve, 500));
				
				// 只在第一次连接成功时显示提示
				if (!lock.hasShownConnectSuccess) {
				  uni.$u.toast('蓝牙连接成功！')
				  lock.hasShownConnectSuccess = true; // 设置标志，表示已显示过提示
				}
			  },
			  fail(e) {
				uni.hideLoading();
				if (lock.logDebug) lock.logDebug('特征值通知开启失败', e);
				if (e.errCode !== 0) {
				  initTypes(e.errCode);
				} else {
				  uni.$u.toast('监听蓝牙失败，请重试！')
				}
			  }
			})
		  },

		// 接收数据 监听低功耗蓝牙设备的特征值变化
		onBLECharacteristicValueChange() {
			uni.onBLECharacteristicValueChange(async res => {
				lock.unLockType = 0; // 接收到数据了，取消按钮loading
				const data = lock.ab2hex(res.value);
				const code = data.slice(0, 2);
				console.log('接收蓝牙数据=', data);
				if (lock.logDebug) lock.logDebug('接收蓝牙数据', data);
				
				if (code == '01') {
					// 解析01指令返回的数据
					console.log('检测锁类型:', data.slice(46, 48));
					if (lock.logDebug) lock.logDebug('检测锁类型', data.slice(46, 48));
					let newlock = data.slice(46, 48);
					// 无论是否为新锁，都解析并保存数据
					lock.someDataFromB = lock.parseLockData(data);
					console.log('解析的锁数据:', lock.someDataFromB);
					if (lock.logDebug) lock.logDebug('解析的锁数据', lock.someDataFromB);
					
					// 根据锁状态处理
					if (newlock !== 'aa') {
						// 新锁处理
						console.log('发现新锁，准备初始化');
						if (lock.logDebug) lock.logDebug('发现新锁，准备初始化');
					} else {
						// 旧锁处理
						console.log('连接到已初始化的锁，当前电量:', lock.someDataFromB.power);
						if (lock.logDebug) lock.logDebug('连接到已初始化的锁，当前电量:', lock.someDataFromB.power);
						if (lock.currentLock) {
							updateLock({
								lockStatus: '01', 
								id: lock.currentLock.id,
								power: lock.someDataFromB.power
							}, lock.currentLock.id).then(res => {
								console.log('已更新锁状态和电量', res);
								if (lock.logDebug) lock.logDebug('已更新锁状态和电量', res);
							});
						}
					}
					// 增加roll值，准备下一条指令
					lock.roll = lock.roll + 1;
					if (lock.logDebug) lock.logDebug('更新roll值', lock.roll);
				}
				
				if (code === '10') {
					// 处理10指令返回数据
					console.log('收到10指令回复，密钥已更新');
					if (lock.logDebug) lock.logDebug('收到10指令回复，密钥已更新');
					if (lock.curkey) {
						lock.baseDataFromB.currentKey = lock.curkey;
						if (lock.logDebug) lock.logDebug('更新当前密钥', lock.curkey);
					}
					lock.roll = lock.roll + 1;
					if (lock.logDebug) lock.logDebug('更新roll值', lock.roll);
				}
				
			}, err => {
				console.log('获取数据失败', err);
				if (lock.logDebug) lock.logDebug('获取数据失败', err);
			});
		},

		// 获取指令
		async getLockInstruct() {
			if (!this.deviceId) {
				uni.$u.toast('请先连接蓝牙锁');
				return;
			}
			
			// 开启按钮loading
			lock.unLockType = 1;
			uni.showLoading({
				title: '与锁通信中...',
				mask: true
			});
			
			try {
				// 区分已存在的锁和新锁
				if (this.currentLock) {
					// 已存在锁: 使用锁ID获取01指令
					if (!this.currentLock.id) {
						throw new Error('锁ID不存在');
					}
					
					const result = await getLockCmd({ 
						id: this.currentLock.id, 
						roll: this.roll, 
						type: 0x01 
					});
					
					if (!result || !result.data) {
						throw new Error('获取指令返回数据为空');
					}
					
					if (result.data && result.data.data) {
						const orders = [result.data.data['cmd']];
						await this.sendUnlockInstruct1(orders);
						console.log('已存在锁指令发送完成');
					} else {
						throw new Error('获取指令失败');
					}
				} else {
					// 新锁: 直接构造01指令
					console.log('准备发送新锁01指令, roll:', this.roll);
					
					if (!this.deviceId.includes(':')) {
						throw new Error('MAC地址格式错误');
					}
					
					let buffer = this.GenerateCommand(0x01, this.roll, this.deviceId);
					
					if (!buffer || buffer.byteLength === 0) {
						throw new Error('生成指令失败');
					}
					
					if (!this.characteristicId || this.characteristicId.length === 0) {
						throw new Error('特征值不存在');
					}
					
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
										success: ok,
										fail: (err) => {
											console.log("发送包失败：" + JSON.stringify(err));
											if (err.errCode) {
												initTypes(err.errCode, err.errMsg);
											}
										}
									})
								}, 300);
							},
							(success) => {
								if (success) {
									console.log('新锁01指令发送成功');
									resolve();
								} else {
									uni.$u.toast('指令发送失败');
									reject(new Error('指令发送失败'));
								}
							}
						);
					});
				}
			} catch (e) {
				console.error('发送指令错误:', e);
				uni.$u.toast('通信失败: ' + e.message);
			} finally {
				uni.hideLoading();
				lock.unLockType = 0;
			}
		},
		// 向蓝牙发送01指令
		async sendInstruct(obj, _type) {
			// 必须设备的特征值支持 write 才可以成功调用

			let idx = -1;
			console.log(lock.deviceId)
			let ins = lock.GenerateCommand(0x01, lock.roll, 'C1:12:13:14:15:16')
			console.log('进入send')

			lock.roll = lock.roll + 1
			while (idx < obj.length - 1) {
				idx += 1;
				await lock.sendDelay(150, lock.getBuffer(obj[idx])).then(buffer => {
					console.log('oooooooooooooooooo')
					uni.writeBLECharacteristicValue({
						deviceId: lock.deviceId,
						serviceId: lock.serviceId,
						characteristicId: lock.characteristicId ? lock.characteristicId[0]['uuid']
							.toLowerCase() : '', //向蓝牙写数据的特征值，文档要求不一样
						value: ins,
						success(res) {
							lock.unLockType = 0;

							console.log('指令发送成功后监听数据回传');
						},
						fail(err) {
							if (err.errCode !== 0) {
								initTypes(err.errCode);
							}
						},
						complete(err) {
							lock.unLockType = 0;
							console.log('指令发送结果', err);
							if (err.errCode !== 0) {
								initTypes(err.errCode);
							}
						}
					})
				})
			}
		},
		// 改进的分包发送方法
		async sendUnlockInstruct1(commands) {
			if (!commands || commands.length === 0) {
				uni.$u.toast('无有效指令');
				if (this.logDebug) this.logDebug('无有效指令');
				return;
			}
		
			// 只有在服务未初始化时才调用getServices
			if (!this.servicesInitialized) {
				console.log('服务未初始化，正在初始化...');
				if (this.logDebug) this.logDebug('服务未初始化，正在初始化...');
				try {
					await this.getServices();
					// 服务初始化后等待一段时间
					await new Promise(resolve => setTimeout(resolve, 500));
				} catch (error) {
					console.error('服务初始化失败:', error);
					if (this.logDebug) this.logDebug('服务初始化失败', error);
					uni.$u.toast('服务初始化失败，请重试');
					return;
				}
			} else {
				console.log('服务已初始化，直接发送命令');
				if (this.logDebug) this.logDebug('服务已初始化，直接发送命令');
			}
			
			// 设备连接信息
			const deviceId = this.deviceId;
			const serviceId = this.serviceId;
			
			if (!deviceId || !serviceId) {
				uni.$u.toast('蓝牙连接信息不完整');
				if (this.logDebug) this.logDebug('蓝牙连接信息不完整', {deviceId, serviceId});
				return;
			}
			
			if (!this.characteristicId || this.characteristicId.length === 0) {
				uni.$u.toast('特征值信息缺失');
				if (this.logDebug) this.logDebug('特征值信息缺失');
				// 特征值缺失时尝试重新初始化
				this.servicesInitialized = false;
				return;
			}
			
			const characteristicId = this.characteristicId[0].uuid.toLowerCase();
			if (this.logDebug) this.logDebug('准备发送指令', {
				deviceId,
				serviceId,
				characteristicId,
				commandCount: commands.length
			});

			// 依次发送每条指令
			for (let i = 0; i < commands.length; i++) {
				const command = commands[i];
				console.log(`准备发送指令 ${i+1}/${commands.length}:`, command.slice(0, 20) + '...');
				if (this.logDebug) this.logDebug(`准备发送指令 ${i+1}/${commands.length}`, command.slice(0, 20) + '...');
				
				// 将16进制字符串转换为ArrayBuffer
				const buffer = this.hexStringToBuffer(command);
				
				if (buffer.byteLength === 0) {
					uni.$u.toast(`指令 ${i+1} 解析失败`);
					if (this.logDebug) this.logDebug(`指令 ${i+1} 解析失败`);
					continue;
				}
				
				try {
					// 使用Promise包装分包发送过程
					await new Promise((resolve, reject) => {
						enqueueTask(
							buffer,
							(subBuffer, ok) => {
								// 发送子包
								if (this.logDebug) this.logDebug('发送子包', {size: subBuffer.byteLength});
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: characteristicId,
									value: subBuffer,
									success: (res) => {
										if (this.logDebug) this.logDebug('子包发送成功');
										ok(res);
									},
									fail: (err) => {
										console.error('子包发送失败:', err);
										if (this.logDebug) this.logDebug('子包发送失败', err);
										if (err.errCode) {
											initTypes(err.errCode, err.errMsg);
											// 某些错误可能表示连接状态变化，需要重新初始化
											if (err.errCode === 10006 || err.errCode === 10012) {
												lock.servicesInitialized = false;
											}
										} else {
											uni.$u.toast('指令发送失败: ' + err.errMsg);
										}
									}
								});
							},
							(success) => {
								if (success) {
									console.log(`指令 ${i+1} 发送成功`);
									if (this.logDebug) this.logDebug(`指令 ${i+1} 发送成功`);
									resolve();
								} else {
									uni.$u.toast(`指令 ${i+1} 发送失败`);
									if (this.logDebug) this.logDebug(`指令 ${i+1} 发送失败`);
									reject(new Error('指令发送失败'));
								}
							}
						);
					});
					
					// 每条指令之间等待一定时间，确保处理完成
					await new Promise(resolve => setTimeout(resolve, 800));
					
				} catch (error) {
					console.error('发送指令出错:', error);
					if (this.logDebug) this.logDebug('发送指令出错', error);
					uni.$u.toast('发送指令出错: ' + error.message);
					throw error; // 将错误传递给调用者
				}
			}
			
			console.log('所有指令发送完成');
			if (this.logDebug) this.logDebug('所有指令发送完成');
			return true;
		},
		// 指令发送分包处理1
		async printbuffs(buffer) {
			// 1.并行调用多次会存在写失败的可能性
			// 2.建议每次写入不超过20字节
			// 分包处理，延时调用
			let that = this;
			const offset = 20; // 偏移量
			let pos = 0; // 位置
			let bytes = buffer.byteLength; // 总字节
			while (bytes > 0) {
				let endPos = bytes > offset ? (pos + offset) : (pos + bytes);
				const tempBuffer = buffer.slice(pos, endPos);
				pos += offset;
				bytes -= offset;
				// 延迟发送
				await that.sendDelay(300, tempBuffer).then(buffer => {
					uni.writeBLECharacteristicValue({
						deviceId: lock.deviceId,
						serviceId: lock.serviceId,
						characteristicId: lock.characteristicId ? lock.characteristicId[0]['uuid']
							.toLowerCase() : '',
						value: buffer,
						success: function(res) {

							// 所有分包发送成功后的回调
							console.log('所有数据分包发送成功');

						},
						fail: function(err) {
							console.error('分包发送失败', err);
						}
					});
				})
			}
		},


		splitArrayIntoChunks() {
			var chunks = [];
			for (var i = 0; i < array.length; i += chunkSize) {
				chunks.push(array.slice(i, i + chunkSize));
			}
			return chunks;

		},
		/**
		 * // 指令发送分包处理3
		 */
		async sendMsgToKey(buffer) {
			const MTU = 20; // 根据设备MTU调整
			if (!lock.deviceId || !lock.serviceId || !lock.characteristicId?.[0]?.uuid) {
				uni.$u.toast('设备未就绪，无法发送数据');
				return;
			}

			const characteristicUUID = lock.characteristicId[0].uuid.toLowerCase();

			if (buffer.byteLength <= MTU) {
				try {
					await uni.writeBLECharacteristicValue({
						deviceId: lock.deviceId,
						serviceId: lock.serviceId,
						characteristicId: characteristicUUID,
						value: buffer,
					});
					console.log('完整包发送成功');
				} catch (err) {
					console.error('发送失败:', err);
					if (err.errCode) {
						initTypes(err.errCode, err.errMsg);
					} else {
						uni.$u.toast('发送数据失败: ' + err.errMsg);
					}
					throw err;
				}
			} else {
				const chunk = buffer.slice(0, MTU);
				const remaining = buffer.slice(MTU);
				try {
					// 先发送当前分片
					await uni.writeBLECharacteristicValue({
						deviceId: lock.deviceId,
						serviceId: lock.serviceId,
						characteristicId: characteristicUUID,
						value: chunk,
					});
					console.log(`成功发送 ${chunk.byteLength} 字节，剩余 ${remaining.byteLength} 字节`);

					// 发送成功后添加适当延迟
					await new Promise(resolve => setTimeout(resolve, 150)); // 推荐20-100ms

					// 递归发送剩余数据
					await this.sendMsgToKey(remaining);
				} catch (err) {
					console.error('分包发送失败:', err);
					if (err.errCode) {
						initTypes(err.errCode, err.errMsg);
					} else {
						uni.$u.toast('分包发送失败: ' + err.errMsg);
					}
					throw err;
				}
			}
		},

		// 指令发送分包处理2
		async sendWriteBLECharacteristicValue(
			deviceId,
			serviceId,
			writeCharacteristicId,
			buffer,
		) {
			if (!deviceId || !serviceId || !writeCharacteristicId) {
				uni.$u.toast('蓝牙参数不完整');
				return;
			}
			
			const offset = 20; // 偏移量
			let pos = 0; // 位置
			let bytes = buffer.byteLength; // 总字节
			let that = this;
			
			while (bytes > 0) {
				let endPos = bytes > offset ? pos + offset : pos + bytes;
				const tempBuffer = buffer.slice(pos, endPos);
				pos += offset;
				bytes -= offset;
				// 延迟发送
				try {
					await that.sendDelay(150, tempBuffer).then((buffer) => {
						uni.writeBLECharacteristicValue(
							deviceId,
							serviceId,
							writeCharacteristicId,
							buffer,
							(res) => {
								if (buffer.byteLength < offset) {
									console.log(res)
								}
							},
							(err) => {
								console.log(err);
								if (err.errCode) {
									initTypes(err.errCode, err.errMsg);
								} else {
									uni.$u.toast('写入特征值失败: ' + err.errMsg);
								}
							}
						);
					});
				} catch (error) {
					uni.$u.toast('分包发送错误: ' + error.message);
					break;
				}
			}
		},

		// 延时函数
		sendDelay(delay, buffer) {
			return new Promise((resolve, reject) => {
				setTimeout(() => resolve(buffer), delay);
			})
		},
		// 断开蓝牙
		closeBLEConnection() {
			uni.hideLoading();
			uni.closeBLEConnection({
				deviceId: lock.deviceId,
				success(res) {
					lock.unLockType = 0;
					lock.isLock = false
					lock.deviceId = '' //清楚mac地址
					lock.isConnect = false //未连接
					lock.backData = [];
					uni.closeBluetoothAdapter()
					clearTimeout(lock.locktimer)
				},
				fail(err) {
					clearTimeout(lock.locktimer)
				}
			})
		},
		// 获取锁具mac地址
		getLockMacAddress() {
			// this.JudegeDeviceId = ''
		},

		// 获取锁具状态(isUnLock：是否直接开锁)
		async getLockStatus(isUnLock) {
			const result = await this.getLockInstruct(1);
			if (isUnLock) { // 锁具状态关闭且需要打开时执行（锁具状态：result）
				this.bluetoothUnLocking();
			} else {
				console.log('锁具状态 toast:', result);
			}
		},

		// 蓝牙开锁
		async bluetoothUnLocking() {
			lock.orderType = 3;
			await this.getLockInstruct();
		},

		// 获取解密结果
		decryptionResult(obj) {
			console.log('解密参数', obj);
		}
	},
}
/**
 * 判断初始化蓝牙状态
 */
function initTypes(code, errMsg) {
	switch (code) {
		case 10000:
			uni.$u.toast('未初始化蓝牙适配器');
			break;
		case 10001:
			uni.$u.toast('未检测到蓝牙，请打开蓝牙重试！');
			break;
		case 10002:
			uni.$u.toast('没有找到指定设备');
			break;
		case 10003:
			uni.$u.toast('连接失败');
			break;
		case 10004:
			uni.$u.toast('没有找到指定服务');
			break;
		case 10005:
			uni.$u.toast('没有找到指定特征值');
			break;
		case 10006:
			uni.$u.toast('当前连接已断开');
			break;
		case 10007:
			uni.$u.toast('当前特征值不支持此操作');
			break;
		case 10008:
			uni.$u.toast('其余所有系统上报的异常');
			break;
		case 10009:
			uni.$u.toast('Android 系统特有，系统版本低于 4.3 不支持 BLE');
			break;
		case 10010:
			uni.$u.toast('没有找到指定设备的指定服务');
			break;
		case 10011:
			uni.$u.toast('没有找到指定设备指定服务的特征值');
			break;
		case 10012:
			uni.$u.toast('特征值设置失败，当前连接已断开');
			break;
		case 10013:
			uni.$u.toast('连接 deviceId 为空或者是格式不正确');
			break;
		case 10014:
			uni.$u.toast('连接设备超时');
			break;
		case 10015:
			uni.$u.toast('通信断开，无法连接蓝牙设备');
			break;
		case 10016:
			uni.$u.toast('蓝牙连接已移除或未连接成功');
			break;
		default:
			uni.$u.toast(errMsg || '蓝牙操作发生未知错误');
	}
}
