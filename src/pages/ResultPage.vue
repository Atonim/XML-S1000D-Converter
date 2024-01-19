<template>
  <div class="result-page">
    <h1>Конвертированный документ</h1>
    <button class="result-page__download-btn download-btn" @click="download">
      Скачать
    </button>
    <button class="result-page__back-btn back-bth" @click="$router.push('/')">
      Назад
    </button>
  </div>
</template>

<script>
import { startZip, startUnzip } from "@/converter/jszip";

export default {
  methods: {
    download() {
      startUnzip();
      //startZip();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>