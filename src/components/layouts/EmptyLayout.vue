<template>
  <div id="wrap">
    <!-- <Header></Header> -->
    <div id="contents">
      <router-view></router-view>
    </div>
    <div id="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script setup>
// import Header from './EmptyHeaderLayout.vue';
import Footer from './AppFooter.vue';
</script>

<style lang="scss" scoped>
/*-----------------------contents-----------------------*/
#contents {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  height: calc(100% - 122px);
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
