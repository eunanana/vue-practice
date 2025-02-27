<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <input type="text" placeholder="아이디" v-model="userId" maxlength="50" />
      <input type="password" placeholder="비밀번호" v-model="userPw" maxlength="50" />
      <button type="submit">로그인</button>
    </form>
    <p class="signup-text">아직 계정이 없으신가요? <span @click="goSignup" class="signup-link">회원가입</span></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore(); // Pinia Store

const userId = ref('user1');
const userPw = ref('1q2w3e4r!');

const login = async () => {
  await authStore.login(userId.value, userPw.value);
  // router.push(route.query.redirect || '/home');
  router.push('/home'); // 로그인 성공 후 이동
};

const goSignup = () => {
  router.push('/join');
};
</script>

<style lang="scss" scoped>
.login-container {
  text-align: center;
  padding: 50px;
}

input {
  display: block;
  width: 80%;
  max-width: 300px;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  display: block;
  width: 80%;
  max-width: 300px;
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

button:hover {
  background-color: #2980b9;
}

.signup-text {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.signup-link {
  cursor: pointer;
  font-weight: bold;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
