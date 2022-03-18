<template>
  <div class="counter">
    <button class="counter__btn" @click="count += 1">
      Up
    </button>
    <button class="counter__btn" @click="count -= 1">
      Down
    </button>
    <input class="counter__input" :value="count" readonly>

    <hr>
    <vue-icon />

    <div class="vue-icon-bg m-10 p-10" />
    <hr>
  </div>
</template>

<script>
  // eslint-disable-next-line import/no-unresolved
  import VueIcon from '../svg/icon.svg?as-vue-component';

  export default {
    components: {
      VueIcon,
    },
    data: () => ({ count: 0 }),
  };
</script>

<style lang="scss">
  .counter {
    padding: 2rem;
    color: black;
    background: #eee;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .vue-icon-bg {
    background-image: url('../svg/icon.svg');
    background-size: cover;
  }
</style>
