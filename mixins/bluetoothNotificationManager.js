// 通知管理器组件
// 将此文件保存为 bluetoothNotificationManager.js
export default {
  data() {
    return {
      // 进度对话框配置
      progressDialog: {
        visible: false,
        title: '设备添加',
        steps: [
          { id: 1, text: '搜索设备', status: 'pending' },
          { id: 2, text: '连接设备', status: 'pending' },
          { id: 3, text: '获取设备信息', status: 'pending' },
          { id: 4, text: '更新设备密钥', status: 'pending' },
          { id: 5, text: '保存设备信息', status: 'pending' }
        ],
        currentStep: 0,
        message: ''
      }
    }
  },
  methods: {
    // 显示进度对话框
    showProgressDialog(title = '设备添加') {
      this.progressDialog.visible = true;
      this.progressDialog.title = title;
      this.progressDialog.currentStep = 0;
      this.progressDialog.steps.forEach(step => {
        step.status = 'pending';
      });
      this.progressDialog.message = '准备开始...';
    },
    
    // 更新进度对话框
    updateProgressStep(stepNumber, status, message) {
      if (stepNumber > 0 && stepNumber <= this.progressDialog.steps.length) {
        // 更新当前步骤
        this.progressDialog.currentStep = stepNumber;
        
        // 更新所有步骤状态
        this.progressDialog.steps.forEach(step => {
          if (step.id < stepNumber) {
            step.status = 'completed';
          } else if (step.id === stepNumber) {
            step.status = status;
          } else {
            step.status = 'pending';
          }
        });
        
        // 更新消息
        this.progressDialog.message = message;
      }
    },
    
    // 完成进度对话框
    completeProgressDialog(success, message) {
      if (success) {
        this.progressDialog.steps.forEach(step => {
          step.status = 'completed';
        });
      } else {
        // 将当前步骤标记为失败
        if (this.progressDialog.currentStep > 0) {
          this.progressDialog.steps[this.progressDialog.currentStep - 1].status = 'failed';
        }
      }
      this.progressDialog.message = message;
      
      // 3秒后自动关闭
      setTimeout(() => {
        this.closeProgressDialog();
      }, 3000);
    },
    
    // 关闭进度对话框
    closeProgressDialog() {
      this.progressDialog.visible = false;
    },
    
    // 蓝牙连接封装方法
    async connectBluetoothWithProgress(device) {
      try {
        // 步骤1: 搜索设备
        this.updateProgressStep(1, 'in-progress', '正在搜索设备...');
        // 这里假设设备已经找到了，因为用户是从列表中选择的
        this.updateProgressStep(1, 'completed', '设备已找到');
        
        // 步骤2: 连接设备
        this.updateProgressStep(2, 'in-progress', '正在连接设备...');
        
        // 先断开已有连接
        if (this.deviceId) {
          try {
            await uni.closeBLEConnection({ deviceId: this.deviceId });
            console.log('已断开旧设备连接');
          } catch (err) {
            console.error('断开连接时出错:', err);
          }
        }
        
        // 设置设备相关数据
        this.roll = 0;
        this.isConnect = false;
        this.isLock = false;
        this.deviceId = device.deviceId.toString();
        this.lockname = device.name ? device.name.toString() : '未知设备';
        
        // 设置基础数据
        this.baseDataFromB = {
          mac: this.deviceId.replace(/:/g, ''),
          sn: this.lockname,
          factoryId: this.lockname,
          factoryKey: '123456789abcef0123456789abcddeef',
          currentKey: '123456789abcef0123456789abcddeef'
        };
        
        // 连接设备
        await new Promise((resolve, reject) => {
          uni.createBLEConnection({
            deviceId: this.deviceId,
            timeout: 1000 * 60,
            success: (res) => {
              setTimeout(async () => {
                try {
                  // 设置MTU
                  await uni.setBLEMTU({
                    deviceId: this.deviceId,
                    mtu: 512
                  });
                  
                  // 获取服务
                  await this.getServices();
                  
                  this.updateProgressStep(2, 'completed', '设备连接成功');
                  resolve();
                } catch (error) {
                  reject(error);
                }
              }, 2000);
            },
            fail: (err) => {
              this.updateProgressStep(2, 'failed', '设备连接失败: ' + (err.errMsg || '未知错误'));
              reject(err);
            }
          });
        });
        
        // 步骤3: 获取设备信息
        this.updateProgressStep(3, 'in-progress', '正在获取设备信息...');
        
        // 获取锁信息 (01命令)
        const cmd01Response = await getLock01Cmd({
          Roll: this.roll,
          Mac: this.deviceId.replace(/:/g, '').toLowerCase()
        });
        
        if (!cmd01Response || !cmd01Response.data || !cmd01Response.data.data) {
          throw new Error('获取设备信息失败');
        }
        
        const cmd01 = cmd01Response.data.data['cmd'];
        await this.sendUnlockInstruct1([cmd01]);
        
        // 等待设备处理
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        this.updateProgressStep(3, 'completed', '设备信息获取成功');
        
        // 步骤4: 更新设备密钥
        this.updateProgressStep(4, 'in-progress', '正在更新设备密钥...');
        
        // 获取10命令
        const cmd10Response = await getLock10Cmd({
          Roll: this.roll,
          Mac: this.deviceId.replace(/:/g, '').toLowerCase()
        });
        
        if (!cmd10Response || !cmd10Response.data || !cmd10Response.data.data) {
          throw new Error('获取密钥命令失败');
        }
        
        const cmd10 = cmd10Response.data.data['cmd'];
        const newKey = cmd10Response.data.data['key'];
        
        await this.sendUnlockInstruct1([cmd10]);
        
        if (this.roll === 0) {
          throw new Error('设备初始化失败，请重试');
        }
        
        this.updateProgressStep(4, 'completed', '设备密钥更新成功');
        
        // 步骤5: 保存设备信息
        this.updateProgressStep(5, 'in-progress', '正在保存设备信息...');
        
        // 创建锁
        const addLockResponse = await addLock({
          adminId: this.currentUser.id,
          enable: true,
          ...this.selectedItem,
          ...this.baseDataFromB,
          ...this.someDataFromB
        });
        
        if (!addLockResponse || !addLockResponse.data) {
          throw new Error('添加设备失败');
        }
        
        this.lockId = addLockResponse.data.data;
        
        // 更新锁的密钥
        await updateLock({ currentKey: newKey, id: this.lockId }, this.lockId);
        
        this.updateProgressStep(5, 'completed', '设备信息保存成功');
        
        // 完成所有步骤
        this.completeProgressDialog(true, '设备添加成功！');
        
        return true;
      } catch (error) {
        console.error('添加设备过程中出错:', error);
        this.completeProgressDialog(false, '添加设备失败: ' + error.message);
        return false;
      }
    }
  }
};