<template>
	<view>
		<uni-popup  :show="show" :round="10" mode="center" @close="close" @open="open">
	    <view>
	        <text>{{content}}</text>
	    </view>
		</uni-popup >
		<button @click="show = true">搜索蓝牙</button>
		<button @click="findDevices">搜索设备</button>
		<button @click="getDevice">获取详细信息</button>
	</view>
</template>

<script setup>
	function findDevices(){
		uni.getBluetoothDevices({
			success: function(res) {
				
				for(let i of res.devices){
					content.value.push(i)
				}
				console.log(content.value)
			},
			fail: function() {
				console.log("获取蓝牙设备列表失败")
			}
		})
	
	}
	async function getDevice(){
		let thisdevice=content.value[1].deviceId
		let x=content.value.filter((item)=>{item.deviceId=='C1:01:01:01:E1:B2'})
		console.log('xxxxxxxx',x)
		connectDevice('C1:01:01:01:E1:B2')
		// for(let i of content.value){
		// 	await connectDevice(i.deviceId)
		// }
	
	}
	async function connectDevice(id){
		console.log(id)
		uni.createBLEConnection({
		    deviceId: id,  // 替换为实际的设备 ID
		    success: (res) => {
		        console.log(id,"连接成功", res);
		        // 连接成功后可以获取设备的服务和特征值
		        // setTimeout(() => getBLEDeviceServices(id), 1000); // 延迟1秒获取服务
				setTimeout(()=>{getBLEDeviceCharacteristics(id,)},1000)
		    },
		    fail: (error) => {
		        console.log(id,"连接失败", error);
		        if (error.errCode === 10012) {
		            console.log('连接超时');
		        } else if (error.errCode === 10013) {
		            console.log('连接设备不匹配');
		        }
		    }
		});
	}
	function getBLEDeviceServices(id){
		uni.getBLEDeviceServices({
		    deviceId: id,
		    success: (res) => {
		        console.log('成功获取蓝牙设备的所有服务', res);
		       let  serviceId = res.services.find(service => service.isPrimary).uuid;  // 获取主要服务
		        console.log(serviceId)
				
		    },
		    fail: (error) => {
		        console.log('获取蓝牙设备的服务失败', error);
		    }
		});
	}
	function getBLEDeviceCharacteristics(did,sid){
		uni.getBLEDeviceCharacteristics({
			deviceId: did,  // 在第 3 步可以拿到蓝牙的 deviceId 的值
			serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',  // 在第 5 步可以拿到蓝牙的 serviceId 的值
			success: (res) => {
				console.log('获取 characteristic 成功', res)
				
				// 在这里可以获取到这个服务的所有特征值，需要确定哪些特征值是此次使用的
				// 一般这里可以拿到两个特征值：写characteristic、读characteristic
				// 接下来这里可以根据拿到的“读characteristic”开启 notify
			},
			fail: (res) => {
				console.log('获取 characteristic 失败', res)
			}
		})
	
	}
	// 创建响应式数据
	const show = ref(false);
	  
	// 定义方法  
	function open() {  
	  // 打开逻辑，比如设置 show 为 true  
	  show.value = true;  
	  uni.startBluetoothDevicesDiscovery({
	      allowDuplicatesKey: false,
	      interval: 0,
	      success: (res) => {
	          console.log("执行搜索成功的回调", res);
	      },
	      fail: (error) => {
	          console.log("搜索失败", error);
	      }
	  });
	
	// 定时停止搜索，避免长时间搜索占用系统资源
	setTimeout(() => {
	    uni.stopBluetoothDevicesDiscovery({
	        success: (res) => {
	            console.log("停止搜索成功", res);
	        },
	        fail: (error) => {
	            console.log("停止搜索失败", error);
	        }
	    });
	}, 10000);  // 10秒后停止搜索
	
	
	   
	
	  // console.log('open');  
	}  
	  
	function close() {  
	  // 关闭逻辑，设置 show 为 false  
	  show.value = false;  
	  // console.log('close');  
	}  
onLoad(() => {

	uni.openBluetoothAdapter({
	  success(res) {
	    console.log(res)
	  }
	})

});
</script>

<style>
</style>