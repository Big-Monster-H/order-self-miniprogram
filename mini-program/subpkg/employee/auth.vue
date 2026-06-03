<template>
  <view class="page-auth">
    <!-- 步骤指示器 -->
    <view class="steps-wrap">
      <view class="steps">
        <view class="step" :class="{ active: currentStep >= 1, done: currentStep > 1 }">
          <view class="step-circle">
            <i v-if="currentStep > 1" class="ri-check-line" style="font-size:28rpx;" />
            <text v-else>1</text>
          </view>
          <text class="step-label">实名认证</text>
        </view>
        <view class="step-connector" :class="{ fill: currentStep > 1 }">
          <view class="sc-line" />
        </view>
        <view class="step" :class="{ active: currentStep >= 2, done: currentStep > 2 }">
          <view class="step-circle">
            <i v-if="currentStep > 2" class="ri-check-line" style="font-size:28rpx;" />
            <text v-else>2</text>
          </view>
          <text class="step-label">缴纳保证金</text>
        </view>
        <view class="step-connector" :class="{ fill: currentStep > 2 }">
          <view class="sc-line" />
        </view>
        <view class="step" :class="{ active: currentStep >= 3 }">
          <view class="step-circle"><text>3</text></view>
          <text class="step-label">提交审核</text>
        </view>
      </view>
    </view>

    <!-- 已认证 -->
    <view v-if="authStatus === 'approved'" class="result-card">
      <view class="result-icon success-bg">
        <i class="ri-checkbox-circle-fill ri-xxl" style="color:#00C853;" />
      </view>
      <text class="result-title">认证已通过</text>
      <text class="result-desc">您现在可以接单了，前往任务大厅看看吧</text>
      <button class="btn-primary" @click="goTaskPool">
        <i class="ri-rocket-line" style="margin-right:10rpx;" />前往任务大厅
      </button>
    </view>

    <!-- 审核中 -->
    <view v-else-if="authStatus === 'pending'" class="result-card">
      <view class="result-icon warn-bg">
        <i class="ri-time-line ri-xxl" style="color:#FF9100;" />
      </view>
      <text class="result-title">审核中</text>
      <text class="result-desc">预计 1-3 个工作日完成，请耐心等待</text>
      <view class="result-tips">
        <view class="tip-item"><i class="ri-information-line" style="color:#FF9100;" /><text>审核通过后即可开始接单</text></view>
        <view class="tip-item"><i class="ri-information-line" style="color:#FF9100;" /><text>如需加急请联系客服</text></view>
      </view>
    </view>

    <!-- 被驳回 -->
    <view v-else-if="authStatus === 'rejected'" class="result-card">
      <view class="result-icon danger-bg">
        <i class="ri-close-circle-fill ri-xxl" style="color:#FF3D00;" />
      </view>
      <text class="result-title">审核未通过</text>
      <text class="result-desc">身份证照片模糊，请重新上传清晰照片</text>
      <button class="btn-outline" @click="authStatus = 'none'; currentStep = 1;">
        <i class="ri-refresh-line" style="margin-right:10rpx;" />重新认证
      </button>
    </view>

    <!-- 步骤 1: 实名认证 -->
    <view v-if="authStatus === 'none' && currentStep === 1">
      <view class="form-card">
        <view class="form-title">
          <i class="ri-id-card-line" style="color:#2979FF;font-size:36rpx;margin-right:12rpx;" />
          <text>实名认证</text>
        </view>
        <view class="form-group">
          <view class="form-row">
            <text class="form-label">真实姓名</text>
            <input class="form-input" v-model="realName" placeholder="请输入真实姓名" placeholder-style="color:#ccc" />
          </view>
          <view class="form-row">
            <text class="form-label">身份证号</text>
            <input class="form-input" v-model="idCard" type="idcard" maxlength="18" placeholder="请输入身份证号码" placeholder-style="color:#ccc" />
          </view>
          <view class="form-row">
            <text class="form-label">手机号</text>
            <input class="form-input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" placeholder-style="color:#ccc" />
          </view>
          <view class="form-row">
            <text class="form-label">验证码</text>
            <input class="form-input code-input" v-model="smsCode" placeholder="请输入验证码" placeholder-style="color:#ccc" />
            <text class="sms-btn" @click="getSmsCode">{{ codeText }}</text>
          </view>
        </view>
        <button class="btn-primary" :disabled="!canStep1" @click="currentStep = 2">
          <i class="ri-arrow-right-line" style="margin-right:8rpx;" />下一步
        </button>
      </view>
    </view>

    <!-- 步骤 2: 保证金 -->
    <view v-if="authStatus === 'none' && currentStep === 2">
      <view class="form-card">
        <view class="form-title">
          <i class="ri-lock-2-line" style="color:#FF9100;font-size:36rpx;margin-right:12rpx;" />
          <text>缴纳保证金</text>
        </view>
        <view class="deposit-card">
          <view class="deposit-circle">
            <i class="ri-lock-2-line" style="font-size:56rpx;color:#FF9100;" />
          </view>
          <view class="deposit-amount">
            <text class="da-symbol">¥</text>
            <text class="da-value">500</text>
            <text class="da-unit">.00</text>
          </view>
          <text class="deposit-hint">保证金将在退出平台时全额退还</text>
        </view>
        <view class="rules-box">
          <text class="rules-title"><i class="ri-shield-check-line" style="margin-right:6rpx;color:#00C853;" />保证金说明</text>
          <view class="rule-item"><view class="rule-dot" /><text>用于保障服务质量，维护平台秩序</text></view>
          <view class="rule-item"><view class="rule-dot" /><text>接单期间保证金处于冻结状态</text></view>
          <view class="rule-item"><view class="rule-dot" /><text>退出平台且无未完成订单可全额退还</text></view>
          <view class="rule-item"><view class="rule-dot" /><text>违规将按规定扣除相应金额</text></view>
        </view>
        <button class="btn-primary" @click="payDeposit">
          <i class="ri-wechat-2-line" style="margin-right:8rpx;" />微信支付 ¥500.00
        </button>
        <text class="skip-link" @click="currentStep = 3">暂不缴纳，先去认证 ›</text>
      </view>
    </view>

    <!-- 步骤 3: 技能信息 -->
    <view v-if="authStatus === 'none' && currentStep === 3">
      <view class="form-card">
        <view class="form-title">
          <i class="ri-award-line" style="color:#00C853;font-size:36rpx;margin-right:12rpx;" />
          <text>技能信息</text>
        </view>
        <view class="skill-section">
          <text class="skill-label">选择您的技能标签</text>
          <view class="skill-grid">
            <view v-for="s in skills" :key="s" class="skill-chip" :class="{ picked: selectedSkills.includes(s) }" @click="toggleSkill(s)">
              <i v-if="selectedSkills.includes(s)" class="ri-check-line" style="font-size:22rpx;margin-right:6rpx;" />
              {{ s }}
            </view>
          </view>
        </view>
        <view class="form-row" style="flex-direction:column;align-items:flex-start;">
          <text class="form-label" style="margin-bottom:16rpx;">个人介绍</text>
          <textarea class="intro-textarea" v-model="intro" placeholder="请简单介绍自己，展示您的专业能力和经验…" :maxlength="300" placeholder-style="color:#ccc" />
          <text class="intro-count">{{ intro.length }}/300</text>
        </view>
        <view class="upload-section" @click="uploadCert">
          <i class="ri-upload-2-line" style="font-size:52rpx;color:#bbb;" />
          <text class="upload-text">上传资质证书（选填）</text>
          <text class="upload-hint">支持 jpg/png，最多3张</text>
        </view>
        <button class="btn-primary" :disabled="!canSubmit" @click="submitAuth">
          <i class="ri-send-plane-line" style="margin-right:8rpx;" />提交审核
        </button>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useEmployeeStore } from '@/store/employee.js';
import { useAuthStore } from '@/store/auth.js';

const empStore = useEmployeeStore();
const authStore = useAuthStore();
const step = ref(1);
const skills = ref('');
const skillTags = ref([]);
const certImages = ref('');
const loading = ref(false);

const nextStep = () => { step.value = Math.min(3, step.value + 1); };

const submitAuth = async () => {
  loading.value = true;
  try {
    await empStore.submitAuth({ skills: skills.value, skill_tags: skillTags.value, cert_images: certImages.value });
    uni.showToast({ title: '认证资料已提交', icon: 'success' });
    nextStep();
  } catch (e) {
    uni.showToast({ title: e.message || '提交失败', icon: 'none' });
  } finally { loading.value = false; }
};

const payDeposit = async () => {
  loading.value = true;
  try {
    await empStore.payDeposit();
    uni.showToast({ title: '保证金缴纳成功！', icon: 'success' });
    nextStep();
  } catch (e) {
    uni.showToast({ title: e.message || '缴纳失败', icon: 'none' });
  } finally { loading.value = false; }
};
</script>

<style lang="scss" scoped>
.page-auth {
  min-height: 100vh;
  background: #F5F6FA;
}

/* 步骤指示器 */
.steps-wrap {
  background: #fff;
  padding: 40rpx 40rpx 24rpx;
  margin-bottom: 20rpx;
}
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.step-circle {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #E8E8E8;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  transition: all 0.3s;
}
.step.active .step-circle {
  background: linear-gradient(135deg, #2979FF, #1565C0);
  color: #fff;
  box-shadow: 0 6rpx 20rpx rgba(41,121,255,0.3);
}
.step.done .step-circle {
  background: #00C853;
  color: #fff;
}
.step-label {
  font-size: 22rpx;
  color: #999;
}
.step.active .step-label {
  color: #2979FF;
  font-weight: 600;
}
.step.done .step-label {
  color: #00C853;
}
.step-connector {
  width: 80rpx;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 0 8rpx;
}
.sc-line {
  width: 100%;
  height: 4rpx;
  border-radius: 2rpx;
  background: #E8E8E8;
}
.step-connector.fill .sc-line {
  background: #00C853;
}

/* 表单卡片 */
.form-card {
  background: #fff;
  margin: 0 24rpx;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.form-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 32rpx;
}
.form-group {
  margin-bottom: 24rpx;
}
.form-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}
.form-label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}
.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.sms-btn {
  font-size: 26rpx;
  color: #2979FF;
  font-weight: 600;
  flex-shrink: 0;
  padding-left: 20rpx;
}

/* 按钮 */
.btn-primary {
  width: 100%;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2979FF, #1565C0);
  color: #fff;
  font-size: 32rpx;
  border-radius: 46rpx;
  border: none;
  font-weight: 600;
  margin-top: 32rpx;
}
.btn-primary[disabled] {
  background: #ccc;
  color: #fff;
}
.btn-outline {
  width: 100%;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #2979FF;
  font-size: 30rpx;
  border-radius: 46rpx;
  border: 2rpx solid #2979FF;
  font-weight: 600;
  margin-top: 20rpx;
}

/* 结果状态 */
.result-card {
  background: #fff;
  margin: 0 24rpx;
  border-radius: 24rpx;
  padding: 60rpx 40rpx 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.result-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24rpx;
}
.success-bg { background: #E8F5E9; }
.warn-bg { background: #FFF3E0; }
.danger-bg { background: #FFEBEE; }
.result-title {
  font-size: 36rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 12rpx;
}
.result-desc {
  font-size: 26rpx;
  color: #999;
  display: block;
  margin-bottom: 30rpx;
  line-height: 1.6;
}
.result-tips {
  text-align: left;
  background: #FFF8E1;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-top: 20rpx;
}
.tip-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #E65100;
  line-height: 2;
}

/* 保证金 */
.deposit-card {
  text-align: center;
  padding: 40rpx 0;
  background: linear-gradient(135deg, #FFF3E0, #FFF8E1);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}
.deposit-circle {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}
.deposit-amount {
  margin-bottom: 10rpx;
}
.da-symbol { color: #FF3D00; font-size: 32rpx; font-weight: 700; }
.da-value { color: #FF3D00; font-size: 68rpx; font-weight: 700; }
.da-unit { color: #FF3D00; font-size: 28rpx; font-weight: 700; }
.deposit-hint {
  font-size: 24rpx;
  color: #E65100;
}
.rules-box {
  background: #F5F6FA;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 10rpx;
}
.rules-title {
  font-size: 26rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 14rpx;
}
.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  font-size: 24rpx;
  color: #666;
  line-height: 2;
}
.rule-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #ccc;
  margin-top: 14rpx;
  flex-shrink: 0;
}
.skip-link {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: #bbb;
  margin-top: 24rpx;
}

/* 技能 */
.skill-section {
  padding: 16rpx 0 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}
.skill-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}
.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.skill-chip {
  padding: 14rpx 24rpx;
  border-radius: 10rpx;
  background: #F5F6FA;
  font-size: 26rpx;
  color: #666;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}
.skill-chip.picked {
  background: #E3F2FD;
  color: #1565C0;
  font-weight: 600;
}
.intro-textarea {
  width: 100%;
  height: 180rpx;
  font-size: 26rpx;
  background: #F5F6FA;
  border-radius: 12rpx;
  padding: 20rpx;
  box-sizing: border-box;
}
.intro-count {
  align-self: flex-end;
  font-size: 22rpx;
  color: #ccc;
  margin-top: 8rpx;
}
.upload-section {
  margin: 24rpx 0;
  padding: 40rpx;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.upload-text {
  font-size: 26rpx;
  color: #999;
}
.upload-hint {
  font-size: 22rpx;
  color: #ccc;
}

.safe-bottom {
  height: 60rpx;
}
</style>
