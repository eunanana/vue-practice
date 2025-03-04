<template>
  <div class="pjoin-container">
    <h2>회원가입</h2>
    <form @submit.prevent="join">
      <input type="text" placeholder="이름" v-model="user.userNm" />
      <div class="inputBtn">
        <input type="text" placeholder="아이디" v-model="user.userId" @input="changeUserId" />
        <button type="button" class="btn_grey" @click="checkId">중복확인</button>
      </div>
      <input type="password" placeholder="비밀번호" v-model="user.userPswd" />
      <input type="password" placeholder="비밀번호 확인" v-model="userPswdCheck" />
      <button type="submit" class="btnSubmit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { get, post } from '@/api/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = reactive({
  userNm: '',
  userId: '',
  userPswd: '',
});
const userPswdCheck = ref('');
const isAvailable = ref(false);  // 아이디 중복 체크 상태

// 아이디 중복 체크
const checkId = async () => {
  if(user.userId.length < 4){
    alert('아이디는 4자 이상으로 입력해주세요.');
    return;
  }

  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if(!alphanumericRegex.test(user.userId)) {
    alert('아이디는 영문과 숫자만 사용 가능합니다.');
    return;
  }

  await get('/comm/user/duplicate-check', {
    params: {
      userId: user.userId,
    },
    onSuccess: (res) => {
      if(res.code === 200){
        alert('사용 가능한 아이디입니다.');
        isAvailable.value = true;
      } else {
        alert('이미 사용 중인 아이디입니다.');
        isAvailable.value = false;
      }
    }
  });
}

// 아이디 입력 값 변경 시 중복 체크 상태 초기화
const changeUserId = () => {
  isAvailable.value = false;
}

// 유효성 검사
const validateForm = () => {
  if(user.userNm.length < 2){
    alert('이름은 2자 이상으로 입력해주세요.');
    return false;
  }
  if(!isAvailable.value){
    alert('아이디 중복 확인을 해주세요.');
    return false;
  }
  if(user.userPswd.length < 4){
    alert('비밀번호는 4자 이상으로 입력해주세요.');
    return false;
  }
  if(user.userPswd !== userPswdCheck.value){
    alert('비밀번호가 일치하지 않습니다.');
    return false;
  }

  return true;
}

// 회원가입
const join = async () => {
  if(!validateForm()) return;

  await post('/comm/user/signup', {
    data: user,
    onSuccess: (res) => {
      if(res.code === 200){
        alert('회원가입이 완료되었습니다.');
        router.push('/login');
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.pjoin-container{
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 50px;
  padding: 20px;

  h2{
    text-align: center;
    margin-bottom: 20px;
    font-weight: 600;
  }
  input{
    width: 100%;
    display: block;
    border-radius: 4px;
  }
}
button{
  padding: 0 10px;
  border-radius: 4px;
}
.inputBtn{
  display: flex;
  gap: 8px;
  button{
    flex: none;
  }
}
.btnSubmit{
  width: 100%;
  height: 40px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn_grey{
  background-color: #ccc;
}
form > *{
  margin-bottom: 10px;
}
</style>
