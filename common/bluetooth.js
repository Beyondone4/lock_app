import {
    getLockInstructApi
} from '@/api/isolated/process/index.js'
let lock = null
import crypto from '@/utils/crypto.js'
export default {
    data() {
        return {
            unLockType:0, //1蓝牙开锁、2网关开锁
            list:[], // 已搜索到的蓝牙设备
            adapterState:[],//  适配器状态
            isLock: false, //是否开锁。蓝牙开锁出现问题重试
            isConnect: false, //是否连接锁成功
            deviceId: '', //锁的mac地址
            JudegeDeviceId:'F6980DB69313', // 匹配要连接蓝牙用的设备id F6980DB69313 EC8275CE0A00
            locktimer: null, //搜索锁的计时器
            serviceId: '', // uuid
            characteristicId:[] ,// 特征值集合
            loadingText:'正在连接蓝牙...',
            backData:[], // 蓝牙返回的数据集合
            orderType:1 // 命令
        }
    },
    created() {
        lock = this
        this.getLockMacAddress();
    },
    watch:{
        backData:{
            handler(newVal){
                let result = '';
                for (let i = 0; i < newVal.length; i++) {
                  newVal[i] = newVal[i].slice(2, newVal[i].length);
                  result += newVal[i];
                }
                console.log('结果 result',result);
                if(result.length){
                    console.log('指令类型',this.orderType);
                    this.decryptionResult(result);
                }
            },
            deep:true
        }
    },
    methods: {
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
        // 初始化蓝牙
        openBluetoothAdapter() {
            this.unLockType = 1;
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
                        initTypes(e.errCode,e.errMsg);
                    }
                }
            })
        },
        //获取本机蓝牙适配器状态
        getBluetoothAdapterState() {
            uni.getBluetoothAdapterState({
                success: res => {
                    console.log('获取本机蓝牙适配器状态',JSON.stringify(res));
                    lock.adapterState = res;
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
                            title: '未找到设备，请重试！',
                            icon: 'none',
                            duration: 1000,
                            complete: function() {
                                uni.stopBluetoothDevicesDiscovery()
                            }
                        });
                    }, 1000 * 60)
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
                let mac = ''
                for (let s of device.deviceId) {
                    if (s !== ':') mac += s
                }
                if (mac.indexOf(lock.JudegeDeviceId)>-1) {
                    console.log('找到了 mac',mac);
                    lock.serviceId = device.advertisServiceUUIDs?device.advertisServiceUUIDs[0] : '';
                    lock.deviceId = device.deviceId.toString()
                    lock.createBLEConnection();
                    uni.stopBluetoothDevicesDiscovery()
                    clearTimeout(lock.locktimer)
                    return
                }
            })
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
                    }, 6000)
                    // 关闭搜索 
                },
                fail(e) {
                    uni.hideLoading();
                    if (e.errCode !== 0) {
                        initTypes(e.errCode);
                    }else{
                        uni.$u.toast('连接蓝牙失败，请重试！')
                    }
                }
            })
        },
        // 获取蓝牙服务
        getServices() {
            uni.getBLEDeviceServices({
                deviceId:lock.deviceId,
                success(res) {
                    lock.serviceId = res.services?res.services[0]['uuid'] : '';
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
                deviceId:lock.deviceId, // 设备ID C10101010C1A
                serviceId:lock.serviceId, // 服务UUID
                success(res) {
                    console.log('获取特征值',res);
                    lock.characteristicId = res.characteristics || [];
                    lock.notifyBLECharacteristicValueChange()
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
                characteristicId: lock.characteristicId?lock.characteristicId[0]['uuid']:'', // 监听对应的特征值
                success(res) {
                    // uni.hideLoading()
                    lock.isConnect = true
					lock.onBLECharacteristicValueChange(_type); // 指令发送成功后监听数据回传
                    uni.$u.toast('蓝牙连接成功！')
                },
                fail(e) {
                    uni.hideLoading();
                    if (e.errCode !== 0) {
                        initTypes(e.errCode);
                    }else{
                        uni.$u.toast('监听蓝牙失败，请重试！')
                    }
                }
            })
        },
        
        // 接收数据 监听低功耗蓝牙设备的特征值变化
        onBLECharacteristicValueChange(type) {
            uni.onBLECharacteristicValueChange(res => {
                lock.unLockType = 0; // 接收到数据了，取消按钮loading
                const data = lock.ab2hex(res.value);
                const code = data.slice(0, 2);
                console.log('接收数据=',data);
                if(lock.backData.indexOf(data) == -1){
                    lock.backData.push(data);
                }
            },err=>{
                console.log('获取失败了',err)
            })
        },
        
        // 获取指令
        getLockInstruct() {
            // _type: 1 读取门锁信息 2初始化锁 3开锁
            const orders = ['010200107d9a0538979e7bc6c2a731c9622a82b2','028b000000000000000000000000000000000000']
            const order = ['0101000803795A5B33E0E7AEE100000000000000']; //
            if(!this.deviceId) return uni.$u.toast('请先连接蓝牙锁')
            try {
                // 开启按钮loading
                lock.unLockType = 1;
                // 获取指令
                // const get_order = await getLockInstructApi(lock.orderType)
                // 发送指令
                lock.sendInstruct(order,_type);
                uni.hideLoading();
            } catch (e) {
                uni.hideLoading();
                uni.$u.toast('开锁失败，请扫码重试！',e)
            }
        },
        // 向蓝牙发送指令
        async sendInstruct(obj,_type) {
            // 必须设备的特征值支持 write 才可以成功调用
            let idx = -1;
            while(idx<obj.length-1){
                idx += 1;
                await lock.sendDelay(150,lock.getBuffer(obj[idx])).then(buffer=>{
                    uni.writeBLECharacteristicValue({
                        deviceId: lock.deviceId,
                        serviceId: lock.serviceId,
                        characteristicId: lock.characteristicId?lock.characteristicId[1]['uuid'].toLowerCase():'', //向蓝牙写数据的特征值，文档要求不一样
                        value: buffer,
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
                            console.log('指令发送结果',err);
                            if (err.errCode !== 0) {
                                initTypes(err.errCode);
                            }
                        }
                    })
                })
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
        getLockMacAddress(){
            // this.JudegeDeviceId = ''
        },
        
        // 获取锁具状态(isUnLock：是否直接开锁)
        async getLockStatus(isUnLock){
            const result = await this.getLockInstruct(1);
            if(isUnLock){ // 锁具状态关闭且需要打开时执行（锁具状态：result）
                this.bluetoothUnLocking();
            }else{
                console.log('锁具状态 toast:',result);
            }
        },
        
        // 蓝牙开锁
        async bluetoothUnLocking(){
            lock.orderType = 3;
            await this.getLockInstruct();
        },
        
        // 获取解密结果
        decryptionResult(obj){
            console.log('解密参数',obj);
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