<template>
  <div class="main-page">
    <img 
      src="@/assets/img/preloader.png"
      alt="preloader"
      class="preloader"
      srcset="@/assets/img/preloader.svg"
      v-if="isLoading" />
    <div 
      class="main-page__content" 
      v-else>
      <h1 class="main-page__header header">
        Word в XML S1000D - всего в несколько кликов
      </h1>
      <FileUploader 
        @drop.prevent="drop" 
        @change="selectedFile"
      />
      <span 
        v-if="uploaderFile"> 
        Имя загруженного файла: <strong>{{ uploaderFile.name }}</strong>
      </span>
      <button 
        class="main-page__next-btn" 
        :class="{ 'main-page__next-btn_disabled' : !uploaderFile }"
        @click="uploaderFile ? sendRequest() : setMessage()">
        Конвертировать
      </button>
      <span 
        v-if="!uploaderFile && message"
        class="main-page__warning">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script>
import FileUploader from '@/components/FileUploader'
import b64ToBlob from 'b64-to-blob'
import FileSaver from 'file-saver'
import { ref } from 'vue'

export default {
  components: {
    FileUploader
  },

  setup() {
    let uploaderFile = ref('');
    const isLoading = ref(false);
    const message = ref('');

    const drop = (e) => {
      uploaderFile.value = e.dataTransfer.files[0];

      let type = uploaderFile.value.type
      if (type !== 'application/msword' && 
          type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          setMessage('Недопустимый формат файла: ' + uploaderFile.value.name)
          deleteFile()
          // Добавить код для обработки недопустимого формата файла!!!
      }
    };
    const selectedFile = () => {
      uploaderFile.value = document.querySelector('.uploaderFile').files[0];
    };
    const deleteFile = () => {
      uploaderFile.value = ''
    };
    const toggleLoading = () => {
      isLoading.value = !isLoading.value;
    };
    const setMessage = (text = 'Загрузите файл формата Word') => {
      message.value = text;
    };

    return {
      uploaderFile,
      isLoading,
      message,

      drop,
      selectedFile,
      deleteFile,
      toggleLoading,
      setMessage
    };
  },

  methods: {
    async sendRequest() {
      const requestURL = 'http://localhost:8085/converter'
      const formData = new FormData()
      formData.append('file', this.uploaderFile)

      try {
        this.toggleLoading()
        const response = await fetch(requestURL, {
          method: 'POST',
          mode: 'cors',
          body: formData,
        })
        if (response.ok) {
          const zipAsBase64 = await response.text()
          const blob = await b64ToBlob(zipAsBase64, 'application/zip')
          FileSaver.saveAs(blob, 'example.zip')
        } else {
          console.log('Error HTTP: ' + response.status)
        }
      } catch (error) {
        console.log('Request execution error: ' + error.message)
      } finally {
         this.toggleLoading()
         this.$router.push({ name: 'result-page' });
      }
    }
  },
};
</script>
