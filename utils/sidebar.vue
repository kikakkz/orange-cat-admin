<template>
  <div class="container">
    <el-menu
      default-active="main"
      :collapse="collapse"
      class="el-menu-vertical-demo menu"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router>
      <el-menu-item v-for="item in items" :key="item.index" :index="item.index">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
module.exports = {
  props: ['collapse'],
  data () {
    return {
      items: [{
          icon: 'el-icon-s-home',
          index: 'main',
          title: '信息台'
        }, {
          icon: 'el-icon-edit',
          index: 'bookmgr',
          title: '图书管理'
        }, {
          icon: 'el-icon-user',
          index: 'usermgr',
          title: '成员管理'
        }
      ]
    }
  }
}
</script>
<style scoped>
.container {
  background: #324157;
}
.menu {
  background: #324157;
}
</style>
