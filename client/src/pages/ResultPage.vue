<template>
  <div class="result-page">
    <Preloader/>
    <!--<h1>Конвертированный документ</h1>
    <button class="result-page__download-btn download-btn" @click="download">
      Скачать
    </button>
    <button class="result-page__back-btn back-bth" @click="$router.push('/')">
      Назад
    </button>-->
  </div>
</template>

<script>
import { startZip, startUnzip } from "../../../server/src/converter/jszip";
import Preloader from "@/components/UI/Preloader";

export default {
  components: {
    Preloader
  },
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