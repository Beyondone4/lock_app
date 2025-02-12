import {
	getLockCmd,
	updateLock,
	stepOrder
} from '../api/user'
import store from '@/store/index.js';
import {
	enqueueTask
} from './blePackage.js'
let lock = null

export default {
	data() {
		return {
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
			const cleanedHexString = hexString.toLowerCase().replace(/[^0-9a-f]/g, '');
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
			const extractedName = advertisData.slice(12, 26);
			return extractedName.toLowerCase() === targetName.toLowerCase();
		},

		// 初始化蓝牙
		openBluetoothAdapter() {
			this.unLockType = 1;
			this.roll = 0
			uni.openBluetoothAdapter({
				success(res) {
					lock.isConnect = false
					lock.isLock = false
					lock.getBluetoothAdapterState();
				},
				fail(e) {
					uni.hideLoading();
					lock.unLockType = 0;
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
					lock.adapterState = res;
					uni.onBLEConnectionStateChange(this.bleConnectionStateChangeHandler);
					lock.findBluetooth()
				},
				fail: e => {
					this.unLockType = 0;
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					}
				}
			});
		},
	bleConnectionStateChangeHandler(res) {			 
		console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
					if (res.connected) {
						uni.setBLEMTU({ deviceId: res.deviceId, mtu: 512 })}},
		
		// 开始搜寻附近的蓝牙
		findBluetooth() {
			uni.showLoading({
				title: lock.loadingText,
				mask: true
			});
			uni.startBluetoothDevicesDiscovery({
				success(res) {
					// 开启监听回调
					uni.onBluetoothDeviceFound(lock.watchNewBluetooth)
					lock.locktimer = setTimeout(() => {
						uni.showToast({
							title: '',
							icon: 'none',
							duration: 1000,
							complete: function() {
								uni.stopBluetoothDevicesDiscovery()
							}
						});
					}, 1000 * 6)
				},
				fail(e) {
					uni.hideLoading();
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					}
				}
			})
		},
		//监听附近设备
		watchNewBluetooth(res) {
			res.devices.forEach(device => {
				let x = this.ab2hex(device.advertisData || new ArrayBuffer(0));
				if (this.isTargetDevice(x, '626c654c6f636b')) {
					let mac = device.deviceId.replace(/:/g, '');
					console.log('发现符合条件的设备:', device, 'MAC:', mac);
					uni.hideLoading();
					if (!this.devices.find(d => d.deviceId === device.deviceId)) {
						this.devices.push({
							name: device.name || '未知名称',
							deviceId: device.deviceId,
							advertisServiceUUIDs: device.advertisServiceUUIDs || []
						});
					}
				}
			});
		},
		// 用户点击列表中的“连接”按钮时调用
		connectBluetoothDevice(device) {
			uni.stopBluetoothDevicesDiscovery(); // 可选：停止搜索

			this.isConnect = false;
			this.isLock = false;
			this.deviceId = device.deviceId.toString();
			this.serviceId = device.advertisServiceUUIDs[0] || '';
			console.log('serviceId', this.serviceId)
			this.lockname = device.name.toString();
			this.baseDataFromB = {
				mac: this.deviceId.replace(/:/g, ''),
				sn: this.lockname,
				factoryId: this.lockname,
				factoryKey: '7856341201efbc9a89674523efdecdab',
				currentKey: '7856341201efbc9a89674523efdecdab'
			}
			// 如果要向上个页面传值，可以使用 eventChannel
			// this.getOpenerEventChannel().emit('LockBaseInfo', {
			//   mac: this.deviceId.replace(/:/g, ''),
			//   sn: this.lockname,
			//   ...
			// });

			// 开始连接
			this.createBLEConnection();
		},
		// 连接蓝牙
		createBLEConnection() {
			uni.createBLEConnection({
				deviceId: lock.deviceId,
				timeout: 1000 * 60,
				success(res) {
					// 需要延迟
					setTimeout(() => {
						// 知道服务和特征值，直接监听
						// lock.notifyBLECharacteristicValueChange()
						// 获取服务，再获取特征值，这里写死，就不用再获取
						// lock.getServices()
						lock.getCharacteristics() // 获取特征值
					}, 2000)
					// 关闭搜索 
				},
				fail(e) {
					uni.hideLoading();
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
			uni.getBLEDeviceServices({
				deviceId: lock.deviceId,
				success(res) {
					lock.serviceId = res.services ? res.services[0]['uuid'] : '';
					// lock.serviceId='0000ff01-0000-1000-8000-00805f9b34fb'//这里返回设备服务uuid
					lock.getCharacteristics();
				},
				fail(err) {
					uni.$u.toast('连接蓝牙服务失败，请重试！')
					uni.hideLoading();
				}
			})
		},
		// 获取特征值
		getCharacteristics() {
			uni.getBLEDeviceCharacteristics({
				deviceId: lock.deviceId, // 设备ID C10101010C1A
				serviceId: lock.serviceId, // 服务UUID
				success(res) {
					console.log('获取特征值', res);
					lock.characteristicId = res.characteristics || [];
					lock.notifyBLECharacteristicValueChange()
					lock.onBLECharacteristicValueChange(lock.unLockType); // 指令发送成功后监听数据回传
					let x = {
						'deviceId': lock.deviceId,
						'serviceId': lock.serviceId,
						'characteristicId': lock.characteristicId
					}
					store.dispatch('updateLock', x)
					lock.loadingText = '蓝牙开锁中，请稍后...';
				},
				fail(err) {
					uni.$u.toast('连接蓝牙特征失败，请重试！')
				}
			})
		},
		// 开启监听 
		notifyBLECharacteristicValueChange() {
			uni.notifyBLECharacteristicValueChange({
				deviceId: lock.deviceId, // 设备id
				serviceId: lock.serviceId, // 监听指定的服务
				characteristicId: lock.characteristicId ? lock.characteristicId[1]['uuid'] : '', // 监听对应的特征值
				success(res) {
					// uni.hideLoading()


					lock.isConnect = true
					uni.$u.toast('蓝牙连接成功！')
				},
				fail(e) {
					uni.hideLoading();
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					} else {
						uni.$u.toast('监听蓝牙失败，请重试！')
					}
				}
			})
		},

		// 接收数据 监听低功耗蓝牙设备的特征值变化
		onBLECharacteristicValueChange(type) {
			uni.onBLECharacteristicValueChange(async res => {
				lock.unLockType = 0; // 接收到数据了，取消按钮loading
				const data = lock.ab2hex(res.value);
				const code = data.slice(0, 2);
				console.log('接收数据=', data);
				
				if (code == '13') {
					//Todo：如果13解析出来是关锁就patch orderstep和lock
					console.log('13', data.slice(32, 34))
					  // 将十六进制转换为整数
					    let decimalValue = parseInt(data.slice(32, 34), 16);
					    
					    // 转换为八位二进制字符串，前面补零
					    let binaryString = decimalValue.toString(2).padStart(8, '0');
					    // 获取后五位
					    let lastFiveBits = binaryString.slice(-5);
					    // 判断状态
					    let state = "";
					    if (lastFiveBits === "10000") {
					        updateLock({lockStatus:'00',id:lock.currentLock.id},lock.currentLock.id).then(res=>{
								console.log(res)
							})
					    } else if (lastFiveBits === "01111") {
							console.log('currentLock',lock.currentLock)
							console.log('currentStep',{id:lock.currentStep.id,lockStatus:'01',task:lock.currentStep.task,status:5,orderId:lock.currentStep.orderId})
					         updateLock({lockStatus:'01',id:lock.currentLock.id},lock.currentLock.id).then(res=>{
					         	console.log(res)
					         })
							 stepOrder({id:lock.currentStep.id,lockStatus:1,task:lock.currentStep.task,status:5,orderId:lock.currentStep.orderId},lock.currentStep.id).then(res=>{
								 lock.currentStep.status=5
							 						  console.log(res)
							 					
							 })
					    } else {
					        state = "未知状态";
					    }
					
					// console.log('nowlock',lock.currentLock)
					//如果是开锁就patch step
					//如果是关锁就patch lock和step
					
					//发送13指令
					// let ins13 = await getLockCmd({type:0x13, roll:lock.roll, id:lock.currentLock.id, cmd:data})
					// ins13=[ins13.data.data['cmd']]
					//  // console.log('step',lock.currentStep)
					// lock.sendUnlockInstruct1(ins13)
				}
				if (code == '01') {
					//如果是新锁 就获取10发送10 patch锁得key
					console.log('newlock', data.slice(46, 48))
					let newlock=data.slice(46, 48)
					if(newlock!=='aa'){
						lock.someDataFromB = lock.parseLockData(data)
						
					//	let ins02 = await getLockCmd({type:0x02, roll:lock.roll, id:lock.currentLock.id, cmd:data})

					//	ins02=[ins02.data.data['cmd']]
					
						
					}else{
						// let ins02 = await getLockCmd({type:0x02, roll:lock.roll, id:lock.currentLock.id, cmd:data})
						// ins02=[ins02.data.data['cmd']]
						// await lock.sendUnlockInstruct1(ins02)
						console.log('旧锁')
						return ;
					}
			
					
					// console.log('lock.someDataFromB', lock.someDataFromB)
				}
				if(code==='10'){
					this.baseDataFromB.currentKey=lock.curkey
			
				}

			}, err => {
				console.log('获取失败了', err)
			})
		},

		// 获取指令
		getLockInstruct() {
			// _type: 1 读取门锁信息 2初始化锁 3开锁
			const orders = ['01000D00C1010101E1B2190205171613C5', '1F040D00141dfcf97feb77809d4886650023b903']
			const order = ['1F040D00C1010101E1B2190205170A0CD4']; //
			console.log('10this.deviceId', this.deviceId)
			if (!this.deviceId) return uni.$u.toast('请先连接蓝牙锁')
			try {
				// 开启按钮loading
				lock.unLockType = 1;
				// 获取指令

				// 发送指令
				// lock.sendInstruct(order,lock.unLockType);
				lock.sendUnlockInstruct1(orders, lock.unLockType)
				uni.hideLoading();
			} catch (e) {
				uni.hideLoading();
				uni.$u.toast('开锁失败，请扫码重试！', e)
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
		// 向蓝牙发送开锁指令
		async sendUnlockInstruct(obj, _type) {
			console.log('进入send');
			console.log('设备ID:', lock.deviceId);

			// 更新 roll 值


			// 每个包允许的最大字节数
			const maxPacketBytes = 20;
			// 对应的十六进制字符长度（每个字节2个字符）
			const maxPacketHexLength = maxPacketBytes * 2;

			// 遍历所有指令（obj 数组中每个元素均为一个十六进制字符串）
			for (let idx = 0; idx < obj.length; idx++) {
				lock.roll = lock.roll + 1;
				const command = obj[idx]; // 例如："0100000dc1010101e1b2190204160f1ec7"
				// 计算需要分多少包（以 hex 字符数计算）
				const totalPackets = Math.ceil(command.length / maxPacketHexLength);

				for (let i = 0; i < totalPackets; i++) {
					// 从 command 中截取每个包的十六进制子串
					const packetHex = command.slice(i * maxPacketHexLength, (i + 1) * maxPacketHexLength);
					console.log(`发送包 ${i + 1} / ${totalPackets}:`, packetHex);

					// 使用 lock.getBuffer 将十六进制字符串转换为 ArrayBuffer 或对应的 buffer
					const buffer = lock.getBuffer(packetHex);

					// 延时发送每个包（例如延时 150 毫秒）
					await lock.sendDelay(150, buffer).then(() => {
						uni.writeBLECharacteristicValue({
							deviceId: lock.deviceId,
							serviceId: lock.serviceId,
							characteristicId: lock.characteristicId ?
								lock.characteristicId[0]['uuid'].toLowerCase() :
								'',
							value: buffer,
							success(res) {
								console.log('指令包发送成功:', packetHex);
							},
							fail(err) {
								if (err.errCode !== 0) {
									initTypes(err.errCode);
								}
							},
							complete(err) {
								console.log('指令发送结果', err);
								if (err.errCode !== 0) {
									initTypes(err.errCode);
								}
							}
						});
					});
				}
			}
		},
		//分包测试
		async sendUnlockInstruct1(obj, _type) {
	
			// 遍历所有指令（obj 数组中每个元素均为一个十六进制字符串）
			for (let idx = 0; idx < obj.length; idx++) {
				// 更新 roll 值
				lock.roll = lock.roll + 1;
				const command = obj[idx]; // 例如："0100000dc1010101e1b2190204160f1ec7"
				var deviceId = lock.deviceId
				var serviceId = lock.serviceId
				var characteristicId = lock.characteristicId[0].uuid.toLowerCase()
				
				// 使用 lock.getBuffer 将十六进制字符串转换为 ArrayBuffer 或对应的 buffer
				const buffer = lock.hexStringToBuffer(command);
				// const buffer=lock.getBuffer(command)
				enqueueTask(
					buffer,
					(subBuffer, ok) => {
						// 这里实现发送数据包subBuffer出去。
						uni.writeBLECharacteristicValue({
							deviceId: deviceId, // 设备id
							serviceId: serviceId, // 监听指定的服务
							characteristicId: characteristicId, // 监听对应的特征值
							value: subBuffer,
							success: ok, // 发送成功要调用ok方法记录下来，不然enqueueTask里面不知道全部成功了没有
							fail: (err) => {
								console.log("发送包失败：" + formatErrInfo(err))
							}
						})
					},
					(success) => {
						// console.log("成功发送1条")
					
					},
				)

				// await lock.sendDelay(2000, buffer);
				// this.sendWriteBLECharacteristicValue(deviceId,serviceId,characteristicId,buffer)
				// this.sendMsgToKey(buffer)
				// this.printbuffs(buffer)
			}
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
				await that.sendDelay(150, tempBuffer).then(buffer => {
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
				console.error('设备未就绪');
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
							console.log(err)
						}
					);
				});

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
		case 10013:
			uni.$u.toast('连接 deviceId 为空或者是格式不正确');
			break;
		default:
			uni.$u.toast(errMsg);
	}
}