<template>
  <div class="result-page">
    <h1>Конвертированный документ</h1>
    <button 
         class="result-page__download-btn download-btn"
         :class="{ disabled: true }"
    >Скачать</button>
    <button 
         class="result-page__back-btn back-bth"
         @click="$router.push('/')"
        >Назад</button>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>