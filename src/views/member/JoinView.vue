<template>
  <div class="signup-container">
    <h2>회원가입</h2>
    <form @submit.prevent="signup">
      <div class="input-group">
        <input type="text" placeholder="아이디" v-model="user.userId" maxlength="50" class="id-input" />
        <button type="button" class="check-btn" @click="checkUserId">중복 확인</button>
      </div>
      <p class="check-message" :class="{ success: isAvailable, error: !isAvailable && user.id }">{{ checkMessage }}</p>

      <input type="password" placeholder="비밀번호" v-model="user.userPswd" maxlength="50" />
      <input type="password" placeholder="비밀번호 확인" v-model="confirmPswd" maxlength="50" />
      <input type="text" placeholder="이름" v-model="user.userNm" maxlength="50" />
      <button type="submit" class="signup-btn">회원가입</button>
    </form>
    <p class="login-text">이미 계정이 있으신가요? <span @click="goLogin" class="login-link">로그인</span></p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { get, post } from '@/api/api';

const router = useRouter();
const confirmPswd = ref('');
const user = ref({
  userId: '',
  userPswd: '',
  userNm: '',
});

const isAvailable = ref(false);
const checkMessage = ref('');

const goLogin = () => {
  router.push('/login');
};

/**
 * 아이디 입력 값 변경 시 중복 체크 상태 초기화
 */
watch(
  () => user.value.userId,
  () => {
    isAvailable.value = false;
    checkMessage.value = ''; // 메시지도 초기화
  },
);

/**
 * 아이디 중복 체크
 */
const checkUserId = async () => {
  if (!user.value.userId.trim()) {
    checkMessage.value = '아이디를 입력하세요.';
    isAvailable.value = false;
    return;
  }

  await get('comm', '/user/duplicate-check', {
    params: { userId: user.value.userId },
    onSuccess: (response) => {
      if (response?.code === 200) {
        checkMessage.value = '사용 가능한 아이디입니다.';
        isAvailable.value = true;
      } else {
        checkMessage.value = '이미 사용 중인 아이디입니다.';
        isAvailable.value = false;
      }
    },
  });
};

/**
 * 회원가입
 */
const signup = async () => {
  if (!user.value.userId.trim()) {
    alert('아이디를 입력하세요.');
    return;
  } else if (!user.value.userPswd.trim()) {
    alert('비밀번호를 입력하세요.');
    return;
  } else if (!user.value.userNm.trim()) {
    alert('이름을 입력하세요.');
    return;
  }

  if (!isAvailable.value) {
    alert('아이디 중복 확인을 해주세요.');
    return;
  }

  if (user.value.userPswd == '' || user.value.userPswd !== confirmPswd.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  if (!confirm('회원가입을 하시겠습니까?')) return;

  await post('comm', '/user/signup', {
    data: user.value,
    onSuccess: (response) => {
      console.log(response);
      if (response?.code === 200) {
        alert('회원가입이 완료되었습니다!');
        router.push('/login');
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.signup-container {
  text-align: center;
  padding: 50px;
}

.input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 80%;
  max-width: 350px;
  margin: 0px auto;
}

.id-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.check-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.check-btn:hover {
  background-color: #2980b9;
}

.check-message {
  font-size: 14px;
  // margin-top: 2px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  width: 80%;
  max-width: 350px;
  color: #666;
}

.success {
  color: #2ecc71;
}

.error {
  color: #e74c3c;
}

input {
  display: block;
  width: 80%;
  max-width: 350px;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.signup-btn {
  display: block;
  width: 80%;
  max-width: 350px;
  margin: 20px auto;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  transition: all 0.3s ease;
}

.signup-btn:hover {
  background-color: #2980b9;
}

.login-text {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.login-link {
  cursor: pointer;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
