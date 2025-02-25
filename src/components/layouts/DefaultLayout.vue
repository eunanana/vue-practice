<template>
  <div id="wrap">
    <Header></Header>
    <!--contents-->
    <div id="contents">
      <router-view></router-view>
    </div>
    <div id="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script setup>
import Header from './AppHeader.vue';
import Footer from './AppFooter.vue';
// export default {
//   components: {
//     Header,
//     Footer,
//     LoadingBar
//   },
//   data: function() {
//     return {
//     }
//   }
// }
</script>

<style lang="scss" scoped>
#wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  min-width: 1200px;
  min-height: 800px;
}

#contents {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 20px;
  height: calc(100% - 180px);
  background-color: #f8f8f8;
}

#footer {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  border-top: 1px solid #efefef;
  font-size: 10px;
  color: #888;
  padding: 16px 20px;
  z-index: 0;
}
#footer span:nth-child(1) {
  padding-right: 12px;
}
#footer span {
  padding: 0 4px;
}
</style>
