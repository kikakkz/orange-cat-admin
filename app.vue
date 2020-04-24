<template>
  <div>
    <haeder @oncollapsesidebar="onCollapseSideMenu"></haeder>
    <div class="container">
      <sidebar :collapse="collapseSideMenu"></sidebar>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
module.exports = {
  components: {
    'sidebar': httpVueLoader('utils/sidebar.vue'),
    'haeder': httpVueLoader('utils/haeder.vue')
  },
  data () {
    return {
      collapseSideMenu: false
    }
  },
  methods: {
    onCollapseSideMenu: function (collapse) {
      this.collapseSideMenu = collapse
    }
  }
}
</script>
<style scoped>
.container {
  display: flex;
}
</style>