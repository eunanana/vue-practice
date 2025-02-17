<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <input type="text" placeholder="아이디" v-model="userId" />
      <input type="password" placeholder="비밀번호" v-model="userPw" />
      <button type="submit">로그인</button>
    </form>
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
  await router.push('/home'); // 로그인 성공 후 이동
};

// watchEffect(() => {
//   if (authStore.isLogin && !authStore.userInfo) {
//     authStore.getUser(); // 로그인 상태면 사용자 정보 가져오기
//   }
// });
</script>

<style scoped>
.login-container {
  text-align: center;
  padding: 50px;
}
input {
  display: block;
  margin: 10px auto;
  padding: 10px;
}
button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
