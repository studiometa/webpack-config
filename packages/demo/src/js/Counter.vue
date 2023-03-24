<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
  import { ref, watch } from 'vue';
  // eslint-disable-next-line import/no-unresolved
  import VueIcon from '../svg/icon.svg?as-vue-component';

  const count = ref(0);

  watch(count, (newValue) => {
    console.log({ newValue });
  });
</script>

<template>
  <div class="counter">
    <button type="button" class="counter__btn" @click="count = count + 1">
Up
</button>
    <button type="button" class="counter__btn" @click="count = count - 1">
Down
</button>
    <input class="counter__input" :value="count" readonly >

    <hr >
    <vue-icon />

    <div class="vue-icon-bg m-10 p-10" />
    <hr >
  </div>
</template>

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
