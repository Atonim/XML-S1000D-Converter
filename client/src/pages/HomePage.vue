<template>
  <div class="home-page">
    <h1>Конвертировать Word в XML S1000D</h1>
    <Uploader @drop.prevent="drop" @change="selectedFile"></Uploader>
    <span v-if="uploaderFile" class="file-info">Имя загруженного файла: <strong>{{ uploaderFile.name }}</strong></span>
    <button class="home-page__next-btn next-bth" :class="{ disabled: !uploaderFile }"
      @click="uploaderFile ? startConverter() : (message = true)">
      Конвертировать
    </button>
    <span v-if="!uploaderFile && message">Сначала загрузите файл</span>
  </div>
</template>

<script>
import Uploader from "@/components/Uploader";
import { ref } from "vue";
import FileSaver from 'file-saver';
import b64ToBlob from 'b64-to-blob';

export default {
  components: {
    Uploader,
  },
  data: () => ({
    message: false,
  }),
  setup() {
    let uploaderFile = ref("");

    const drop = (e) => {
      uploaderFile.value = e.dataTransfer.files[0];
    };

    const selectedFile = () => {
      uploaderFile.value = document.querySelector(".uploaderFile").files[0];
    };

    return {
      uploaderFile,
      drop,
      selectedFile,
    };
  },
  methods: {
    async sendRequest(file) {
      const requestURL = 'http://localhost:8085/converter'

      const formData = new FormData()
      formData.append('file', file)
      console.log(file) //  delete
      console.log(formData) //  delete
      try {
        const response = await fetch(requestURL, {
          method: 'POST',
          mode: 'cors',
          body: formData,
        })
        if (response.ok) {
          console.log(response) //  delete
          const zipAsBase64 = await response.text() // move to download and connect btn backHome
          const blob = await b64ToBlob(zipAsBase64, 'application/zip')
          FileSaver.saveAs(blob, 'example.zip')
        } else {
          console.log('Error HTTP: ' + response.status)
        }
      } catch (error) {
        console.log('Request execution error: ' + error.message)
      }
    },
    fileToBase64(file) {
      return new Promise( (resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
          const base64 = btoa(encodeURIComponent(reader.result));
          resolve(base64);
        }
        reader.onerror = function () {
          reject(reader.error);
        };
      })
    },

    async startConverter() {
      try {
        const base64File = await this.fileToBase64(this.uploaderFile);
        this.sendRequest(this.uploaderFile); // move to ResultPage
        this.$router.push({ name: 'result', query: { file: base64File } });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
