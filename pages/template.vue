<script setup lang="ts">
const templateStr = ref('')
const props = ref('')
const username = ref()
const password = ref()

const login = async () => {
  const res: any = await $fetch('/api/v1/user/login', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value
    },
    
  })

  const token = res.data.token; 
  const userId = res.data.user.id;
  localStorage.setItem('token', token)
  localStorage.setItem('userId', userId)
  console.log(`登录`, res)
}

const regist = async () => {
  const res = await $fetch('/api/v1/user/regist', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value
    },
  })

  console.log(`注册`, res)
}

const createTemplate = async () => {

  const res = await $fetch('/api/v1/template/create', {
    method: 'POST',
    body: {
      name: '测试' + +new Date(),
      template: templateStr.value,
      props: JSON.parse(props.value),
      userId: localStorage.getItem('userId') || ''
    },
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    },
  })

  console.log(`创建模板`, res)
}

</script>

<template>
 <div class="flex flex-col">
  <div class="login">
    <Input v-model="username" placeholder="用户名"></Input>
    <Input v-model="password" placeholder="密码"></Input>
    <Button @click="login">登录</Button>
    <Button @click="regist">注册</Button>
  </div>
  <div class="input">
    <Textarea v-model="templateStr" placeholder="输入模板"></Textarea>
    <Textarea v-model="props" placeholder="输入 props 数据"></Textarea>
    <Button @click="createTemplate"> 保存</Button>
  </div>

 </div>
</template>