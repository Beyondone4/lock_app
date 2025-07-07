<!-- 保存为 ProgressDialog.vue -->
<template>
  <view class="progress-dialog" v-if="visible">
    <view class="dialog-content">
      <view class="dialog-header">
        <text class="dialog-title">{{ title }}</text>
        <view class="close-btn" @tap="onClose" v-if="showCloseButton">×</view>
      </view>
      
      <view class="steps-container">
        <view 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="getStepClass(step)"
        >
          <view class="step-number">{{ step.id }}</view>
          <view class="step-info">
            <text class="step-text">{{ step.text }}</text>
            <view class="step-status">
              <view v-if="step.status === 'completed'" class="status-icon completed">✓</view>
              <view v-else-if="step.status === 'failed'" class="status-icon failed">✗</view>
              <view v-else-if="step.status === 'in-progress'" class="status-icon in-progress">
                <view class="loading-spinner"></view>
              </view>
              <view v-else class="status-icon pending"></view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="message-container">
        <text class="message-text">{{ message }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProgressDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '进度'
    },
    steps: {
      type: Array,
      default: () => []
    },
    currentStep: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: ''
    },
    showCloseButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getStepClass(step) {
      return {
        'active': step.id === this.currentStep,
        'completed': step.status === 'completed',
        'in-progress': step.status === 'in-progress',
        'failed': step.status === 'failed'
      };
    },
    onClose() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.progress-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.dialog-content {
  width: 80%;
  max-width: 600rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  height: 40rpx;
  width: 40rpx;
  line-height: 40rpx;
  text-align: center;
}

.steps-container {
  margin-bottom: 30rpx;
}

.step-item {
  display: flex;
  margin-bottom: 20rpx;
  align-items: flex-start;
}

.step-number {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #eee;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  margin-right: 16rpx;
}

.step-item.active .step-number,
.step-item.in-progress .step-number {
  background-color: #007aff;
  color: #fff;
}

.step-item.completed .step-number {
  background-color: #4cd964;
  color: #fff;
}

.step-item.failed .step-number {
  background-color: #ff3b30;
  color: #fff;
}

.step-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-text {
  font-size: 28rpx;
  color: #333;
}

.step-item.active .step-text,
.step-item.in-progress .step-text {
  color: #007aff;
  font-weight: bold;
}

.step-item.completed .step-text {
  color: #4cd964;
}

.step-item.failed .step-text {
  color: #ff3b30;
}

.status-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-icon.completed {
  color: #4cd964;
}

.status-icon.failed {
  color: #ff3b30;
}

.loading-spinner {
  width: 24rpx;
  height: 24rpx;
  border: 2rpx solid rgba(0, 122, 255, 0.2);
  border-top: 2rpx solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.message-container {
  background-color: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
}

.message-text {
  font-size: 24rpx;
  color: #666;
}
</style>