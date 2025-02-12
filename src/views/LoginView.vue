<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <input type="text" placeholder="아이디" v-model="userId">
      <input type="password" placeholder="비밀번호" v-model="userPw">
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const userId = ref('');
const userPw = ref('');

const login = () => {
    if (userId.value && userPw.value) {
        router.push('/home');
    } else {
        alert("값을 입력하세요");
    }
}

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