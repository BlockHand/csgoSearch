<template>
  <div class="layout">
    <div class="content">
      <div class="wrap">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout',
}
</script>


<style scoped lang="less">
.layout {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    .content {
        display: flex;
        justify-content: flex-start;
        width: 100%;
    }
    .wrap {
        flex: 1;
        display: flex;
        padding: 20px;
        width: 1000px;
    }
}
</style>
