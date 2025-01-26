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
		  <button
		    style="margin-left: 10px;"
		    @click="getLockInstruct"
		  >
		    发送指令
		  </button>
        </view>
      </view>
    </view>

    <view class="clearfix"></view>
  </view>
</template>

<script>
import { getLockCmd } from '../../api/user';
import bluetooth from '../../mixins/bluetooth.js'
let lock = null;

export default {
mixins:[bluetooth],
  data() {
    return {

      devices: [], // 用于存储符合过滤条件的蓝牙设备列表
		instructCount:0,
      /**
       * 新增的滚码（指令计数器）
       * 在当前蓝牙连接会话中，每次成功执行任意指令都会自增。
       */
	

    };
  },
  watch:{
	  isConnect(val){
		  if(val) this.getLockInstruct()
	  }
  },
  onLoad() {
    // ...
  },
  methods: {




  
},
}

</script>

<style lang="scss" scoped>
/* 可根据自己需要进行样式修改 */
.container15293 {}
</style>
