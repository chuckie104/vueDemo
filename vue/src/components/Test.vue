<template>
  <div class="hello">
    <span>User:{{ $route.params }}</span>

  </div>
</template>


<script>
export default {
  name: 'test',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
