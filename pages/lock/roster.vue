<template>
  <view class="container container15293">
    <view>
      <button @click="openBluetoothAdapter">开始搜索蓝牙设备</button>
      <button @click="closeBLEConnection">断开</button>
      <!-- 显示搜索到的设备列表 -->
      <view v-if="devices.length > 0">
        <view
          v-for="(device, index) in devices"
          :key="index"
          style="margin-top: 10px; padding: 10px; border: 1px solid #eee;"
        >
          <text>
            {{ device.name || '未知名称' }} -
            {{ device.deviceId }}
          </text>
          <button
            style="margin-left: 10px;"
            @click="connectBluetoothDevice(device)"
          >
            选择此锁具
          </button>
        </view>
      </view>
    </view>

    <view class="clearfix"></view>
  </view>
</template>

<script>
import { getLockCmd } from '../../api/user';

let lock = null;

export default {
  data() {
    return {
      unLockType: 0, // 1蓝牙开锁、2网关开锁
      list: [], // 已搜索到的蓝牙设备(可以不用)
      adapterState: [],// 适配器状态
      isLock: false, // 是否开锁。蓝牙开锁出现问题重试
      isConnect: false, // 是否连接锁成功
      deviceId: '', // 正在连接或已连接锁的mac地址
      JudegeDeviceId: 'F6980DB69313', // 需要配对的设备ID示例
      locktimer: null, //搜索锁的计时器
      serviceId: '', // uuid
      characteristicId: [], // 特征值集合
      loadingText: '正在搜索设备...',
      backData: [], // 蓝牙返回的数据集合
      orderType: 1, // 命令
      devices: [], // 用于存储符合过滤条件的蓝牙设备列表
		instructCount:0,
      /**
       * 新增的滚码（指令计数器）
       * 在当前蓝牙连接会话中，每次成功执行任意指令都会自增。
       */
	

    };
  },
  onLoad() {
    // ...
  },
  created() {
    lock = this;
    this.getLockMacAddress();
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

    // 将 MAC 地址由 "C1:01:01:01:E1:B2" 解析为 [193, 1, 1, 1, 225, 178] ...
    // parseMacAddress(macStr) {
    //   const parts = macStr.split(':');
    //   const bytes = parts.map(part => parseInt(part, 16));
    //   return bytes;
    // },

    // 返回 6 字节的时间戳数组 [year, month, day, hour, minute, second] (year 只取 mod 100)
    // getTimestamp() {
    //   const now = new Date();
    //   const year   = now.getFullYear() % 100;
    //   const month  = now.getMonth() + 1;
    //   const day    = now.getDate();
    //   const hour   = now.getHours();
    //   const minute = now.getMinutes();
    //   const second = now.getSeconds();
    //   return [
    //     year & 0xFF,
    //     month & 0xFF,
    //     day & 0xFF,
    //     hour & 0xFF,
    //     minute & 0xFF,
    //     second & 0xFF
    //   ];
    // },


    // GenerateCommand(cmd, roll, mac) {
    //   const b = new Uint8Array(17);
    //   // 将 mac 转成字节数组
    //   let byteMac = this.hexStringToBytes(mac);
    //   // b[0] ~ b[3] 4字节
    //   b[0] = cmd;       // 例如 0xE0
    //   b[1] = roll;      // 滚码计数
    //   b[2] = 0x00;
    //   b[3] = 0x0D;
    //   // 拷贝 MAC 到 b[4..9]（6字节）
    //   for (let i = 0; i < 6; i++) {
    //     b[4 + i] = byteMac[i] & 0xFF;
    //   }
    //   // 拷贝 Timestamp 到 b[10..15]（6字节）
    //   const timestamp = this.getTimestamp();
    //   for (let i = 0; i < 6; i++) {
    //     b[10 + i] = timestamp[i];
    //   }
    //   // 前16字节累加求和 => b[16]
    //   let sum = 0;
    //   for (let i = 0; i < 16; i++) {
    //     sum += b[i];
    //   }
    //   b[16] = sum & 0xFF;
    //   console.log('指令内容:', b);
    //   return b.buffer; // 返回 ArrayBuffer
    // },

    // ArrayBuffer 转 16 进制字符串（常用调试）
    ab2hex(buffer) {
      const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
          return ('00' + bit.toString(16)).slice(-2);
        }
      );
      return hexArr.join('');
    },

    // 生成buffer（示例做简单处理）
    getBuffer(str) {
      let arr = [];
      for (let i = 0; i < str.length; i++) {
        if ((i + 1) % 2 == 0) {
          arr.push('0x' + str[i - 1] + str[i]);
        }
      }
      const buffer = new ArrayBuffer(arr.length);
      const dataView = new DataView(buffer);
      arr.forEach((item, i) => {
        dataView.setUint8(i, item);
      });
      return buffer;
    },

    // 初始化蓝牙
    openBluetoothAdapter() {
      this.unLockType = 1;
      uni.openBluetoothAdapter({
        success(res) {
          lock.isConnect = false;
          lock.isLock = false;
          lock.getBluetoothAdapterState();
        },
        fail(e) {
          uni.hideLoading();
          lock.unLockType = 0;
          if (e.errCode !== 0) {
            initTypes(e.errCode, e.errMsg);
          }
        }
      });
    },

    // 获取本机蓝牙适配器状态
    getBluetoothAdapterState() {
      uni.getBluetoothAdapterState({
        success: res => {
          console.log('本机蓝牙适配器状态', JSON.stringify(res));
          lock.adapterState = res;
          lock.findBluetooth();
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
          uni.onBluetoothDeviceFound(lock.watchNewBluetooth);

          // 超时处理，可自行增减
          lock.locktimer = setTimeout(() => {
            uni.showToast({
              title: '扫描完毕',
              icon: 'none',
              duration: 1500,
              complete: function () {
                uni.stopBluetoothDevicesDiscovery();
              }
            });
          }, 1000 * 6);
        },
        fail(e) {
          uni.hideLoading();
          if (e.errCode !== 0) {
            initTypes(e.errCode);
          }
        }
      });
    },

    // 是否是目标设备（可根据你的实际项目做改动）
    isTargetDevice(advertisData, targetName) {
      const extractedName = advertisData.slice(12, 26);
      return extractedName.toLowerCase() === targetName.toLowerCase();
    },

    // 监听附近设备，将符合条件的设备加入列表
    watchNewBluetooth(res) {
      res.devices.forEach(device => {
        let x = this.ab2hex(device.advertisData || new ArrayBuffer(0));
        if (this.isTargetDevice(x, '626c654c6f636b')) {
          let mac = device.deviceId.replace(/:/g, '');
          console.log('发现符合条件的设备:', device, 'MAC:', mac);

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
      this.lockname = device.name.toString();
 this.getOpenerEventChannel().emit('LockBaseInfo',{mac:this.deviceId.replace(/:/g, ''),sn:this.lockname,factoryId:this.lockname,factoryKey:'7856341201efbc9a89674523efdecdab',currentKey:'7856341201efbc9a89674523efdecdab'});
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
        deviceId: this.deviceId,
        timeout: 1000 * 60,
        success(res) {
          setTimeout(() => {
            lock.getCharacteristics(); // 获取特征值
          }, 2000);
        },
        fail(e) {
          uni.hideLoading();
          if (e.errCode !== 0) {
            initTypes(e.errCode);
          } else {
            uni.showToast({
              title: '连接蓝牙失败，请重试！',
              icon: 'none'
            });
          }
        }
      });
    },

    // 获取特征值
    getCharacteristics() {
      console.log('serviceId', this.serviceId);
      uni.getBLEDeviceCharacteristics({
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        success(res) {
          console.log('获取特征值', res);
          lock.characteristicId = res.characteristics || [];
          lock.notifyBLECharacteristicValueChange();
		lock.getLockInstruct()
		  		   // uni.navigateBack({
		  		   //        delta: 1
		  		   //      })
          lock.loadingText = '蓝牙开锁中，请稍后...';
        },
        fail(err) {
          uni.showToast({
            title: '获取特征值失败，请重试！',
            icon: 'none'
          });
          uni.hideLoading();
        }
      });
    },

    // 开启通知监听
    async notifyBLECharacteristicValueChange() {
      if (!lock.characteristicId || lock.characteristicId.length === 0) return;
      const notifyId = lock.characteristicId[1]?.uuid;
      if (!notifyId) {
        console.log('无法找到可通知的 characteristicId');
        return;
      }
	console.log('开始notify')
      await uni.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: lock.deviceId,
        serviceId: lock.serviceId,
        characteristicId: notifyId,
        success(res) {
          lock.isConnect = true;
          uni.showToast({
            title: '蓝牙设备选择成功！'
          });
		lock.onBLECharacteristicValueChange();
        },
        fail(e) {
          uni.hideLoading();
          if (e.errCode !== 0) {
            initTypes(e.errCode);
          } else {
            uni.showToast({
              title: '监听失败，请重试！',
              icon: 'none'
            });
          }
        }
      });
    },

    // 监听特征值变化，接收数据
    onBLECharacteristicValueChange() {
      uni.onBLECharacteristicValueChange(
        res => {
          console.log('onBLECharacteristicValueChange 接收到数据: ', res);
          lock.unLockType = 0; // 接收到数据了，取消按钮loading
          const data = lock.ab2hex(res.value);
          console.log('蓝牙返回16进制数据=', data);
			lock.getOpenerEventChannel().emit('LockInfo',{data:data});
          // 如果需要去重，可以判断一下
          if (!lock.backData.includes(data)) {
            lock.backData.push(data);
          }
        },
        err => {
          console.log('监听特征值变化失败:', err);
        }
      );
    },

    // 示例：获取指令（这里仅展示用法，实际可根据自己业务调整）
    getLockInstruct() {
      if (!this.deviceId) {
        return uni.showToast({ title: '请先连接蓝牙锁', icon: 'none' });
      }
      try {
        this.unLockType = 1;
        // 这里演示写死的指令，你可以通过后端接口或者其他逻辑获取
        const order = ['0101000803795A5B33E0E7AEE100000000000000'];
        setTimeout(() => {
          lock.sendInstruct(order, 1);
        }, 1000);

        uni.hideLoading();
      } catch (e) {
        uni.hideLoading();
        uni.showToast({ title: '发送指令失败', icon: 'none' });
        console.error(e);
      }
    },

    /**
     * 示例：向蓝牙发送指令
     * 可以根据你们的协议做拆包、拼包
     */
    async sendInstruct(obj, _type) {
      if (!this.deviceId) {
        return uni.showToast({ title: '请先连接蓝牙锁', icon: 'none' });
      }
	  this.instructCount=this.instructCount+1
	  this.getOpenerEventChannel().emit('InsCount',{data:this.instructCount})
      // 这里示例直接写死一段指令数据做测试
      // 如果要用到 GenerateCommand，则可以在这里替换
      let dataBuffer = lock.getBuffer('0100000dC1010101E1B219010C0D1B00b3');

      // 分包发送（示例）
      const packetSize = 20;
      let idx = 0;
      while (idx < dataBuffer.byteLength) {
        let packet = dataBuffer.slice(idx, idx + packetSize);
        await lock.sendDelay(150, packet).then(buffer => {
          uni.writeBLECharacteristicValue({
            deviceId: lock.deviceId,
            serviceId: lock.serviceId,
            characteristicId: lock.characteristicId?.[0]?.uuid || '',
            value: buffer,
            success(res) {
              console.log('发送成功:', res);
            },
            fail(err) {
              if (err.errCode !== 0) {
                initTypes(err.errCode);
              }
            },
            complete(err) {
              lock.unLockType = 0;
              if (err.errCode) {
                initTypes(err.errCode);
              }
            }
          });
        });
        idx += packetSize;
      }
    },

  


    // 延时函数
    sendDelay(delay, buffer) {
      return new Promise(resolve => {
        setTimeout(() => resolve(buffer), delay);
      });
    },

    // 断开蓝牙
    closeBLEConnection() {
    
      if (!this.deviceId) return;
      uni.closeBLEConnection({
        deviceId: this.deviceId,
        success(res) {
          lock.unLockType = 0;
          lock.isLock = false;
          lock.deviceId = '';
          lock.isConnect = false;
          lock.backData = [];
          uni.closeBluetoothAdapter();
          clearTimeout(lock.locktimer);


        },
        fail(err) {
          clearTimeout(lock.locktimer);
        }
      });
    },

    // 读取特征值示例
    read() {
      if (!this.deviceId) {
        return uni.showToast({ title: '请先连接蓝牙锁', icon: 'none' });
      }
      uni.readBLECharacteristicValue({
        deviceId: lock.deviceId,
        serviceId: lock.serviceId,
        characteristicId: lock.characteristicId[1]?.uuid || '',
        success(res) {
          uni.showToast({
            title: 'read指令发送成功'
          });
        },
        fail(err) {
          console.error(err);
          uni.showToast({
            title: 'read指令发送失败',
            icon: 'error'
          });
        }
      });
    },
    // 获取锁具mac地址
    getLockMacAddress() {
      // this.JudegeDeviceId = '' // 这里可改为你实际的mac
    },



    // 获取锁具状态(isUnLock：是否直接开锁)
    async getLockStatus(isUnLock) {
      // 这里演示获取一下锁状态，再决定是否开锁
      const result = await this.getLockInstruct(1);
      if (isUnLock) {
        // 锁具状态关闭且需要打开时执行（锁具状态：result）
        this.bluetoothUnLocking();
      } else {
        console.log('锁具状态:', result);
      }
    },

    // 蓝牙开锁示例
    async bluetoothUnLocking() {
      lock.orderType = 3;
      await this.getLockInstruct();
    },

    // 获取解密结果
    decryptionResult(obj) {
      console.log('解密参数', obj);
    }
  },
};

/**
 * 判断蓝牙操作过程中的错误码
 */
function initTypes(code, errMsg) {
  switch (code) {
    case 10000:
      uni.showToast({ title: '未初始化蓝牙适配器', icon: 'none' });
      break;
    case 10001:
      uni.showToast({ title: '请打开蓝牙重试', icon: 'none' });
      break;
    case 10002:
      uni.showToast({ title: '没有找到指定设备', icon: 'none' });
      break;
    case 10003:
      uni.showToast({ title: '连接失败', icon: 'none' });
      break;
    case 10004:
      uni.showToast({ title: '没有找到指定服务', icon: 'none' });
      break;
    case 10005:
      uni.showToast({ title: '没有找到指定特征值', icon: 'none' });
      break;
    case 10006:
      uni.showToast({ title: '当前连接已断开', icon: 'none' });
      break;
    case 10007:
      uni.showToast({ title: '当前特征值不支持此操作', icon: 'none' });
      break;
    case 10008:
      uni.showToast({ title: '系统上报的异常', icon: 'none' });
      break;
    case 10009:
      uni.showToast({ title: '系统版本过低不支持 BLE', icon: 'none' });
      break;
    case 10013:
      uni.showToast({ title: 'deviceId 为空或格式不正确', icon: 'none' });
      break;
    default:
      uni.showToast({ title: errMsg || '蓝牙错误:'+ code, icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
/* 可根据自己需要进行样式修改 */
.container15293 {}
</style>
