import transformer from '../src/index'

const result = transformer(`
<!--对应wxml文件-->
<template>
  <div class="demo">233</div>
</template>
<!--对应js文件-->
<script>
  import { createPage } from '@mpxjs/core'

  createPage({
    onLoad () {
    },
    onReady () {
    }
  })
</script>
<!--对应wxss文件-->
<style lang="less">
.demo {
  width: 100px;
}
</style>
<!--对应json文件-->
<script type="application/json">
  {
    "usingComponents": {
      "list": "../components/list"
    }
  }
</script>
`)

result.then(res => {
  console.log('>>>>>>', res)
})
