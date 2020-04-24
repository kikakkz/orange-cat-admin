<template>
  <div class="header-container">
    <div class="collapse-btn" @click="onCollapseBtnClick">
      <i :class="[collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
    </div>
    <p class="title">{{ title }}</p>
  </div>
</template>
<script>
module.exports = {
  data () {
    return {
      collapse: false,
      title: '517读书后台管理系统'
    }
  },
  methods: {
    onCollapseBtnClick: function () {
      this.collapse = !this.collapse;
      this.$emit('oncollapsesidebar', this.collapse)
    }
  }
}
</script>
<style scoped>
.collapse-btn {
  line-height: 50px;
  font-size: 30px;
  color: #fff;
  margin: 0 5px;
}
.title {
  line-height: 50px;
  margin: 0;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 18px;
  color: #fff;
  margin: 0 5px;
}
.header-container {
  display: flex;
  padding: 10px;
  background: #242f42;
}
</style>
