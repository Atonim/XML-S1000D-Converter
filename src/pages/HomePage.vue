<template>
    <div class="home-page">
      <h1>Конвертировать Word в XML S1000D</h1>
      <Uploader
       @drop.prevent="drop" @change="selectedFile"
      ></Uploader>
      <span 
       v-if="uploaderFile"
       class="file-info">Имя загруженного файла: <strong>{{ uploaderFile.name }}</strong></span>
      <button 
       class="home-page__next-btn next-bth"
       :class="{ disabled: !uploaderFile}"
       @click="uploaderFile ? $router.push('/getResult') : message = true"
      >Конвертировать</button>
      <span 
       v-if="!uploaderFile && message">Сначала загрузите файл</span>
    </div>
</template>

<script>
import Uploader from '@/components/Uploader';
import { ref } from 'vue';

export default {
  components: {
    Uploader
  },
  data: () => ({
    message: false,
  }),
  setup() {
    let uploaderFile = ref("");

    const drop = (e) => {
      uploaderFile.value = e.dataTransfer.files[0]
    };

    const selectedFile = () => {
       uploaderFile.value = document.querySelector('.uploaderFile').files[0];
    };

    return {
      uploaderFile, drop, selectedFile
    };
  },
}
</script>
