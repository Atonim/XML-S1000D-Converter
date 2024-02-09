<template>
  <div>
    <Preloader v-if="isLoading" />
    <div class="home-page" v-else>
      <h1>Конвертировать Word в XML S1000D</h1>
      <Uploader @drop.prevent="drop" @change="selectedFile"></Uploader>
      <span v-if="uploaderFile" class="file-info"
        >Имя загруженного файла: <strong>{{ uploaderFile.name }}</strong></span
      >
      <button
        class="home-page__next-btn next-bth"
        :class="{ disabled: !uploaderFile }"
        @click="uploaderFile ? sendRequest() : (message = true)"
      >
        Конвертировать
      </button>
      <span v-if="!uploaderFile && message">Сначала загрузите файл</span>
    </div>
  </div>
</template>

<script>
import Uploader from "@/components/Uploader";
import Preloader from "@/components/UI/Preloader";
import { ref } from "vue";
import FileSaver from "file-saver";
import b64ToBlob from "b64-to-blob";

export default {
  components: {
    Uploader,
    Preloader,
  },
  data: () => ({
    message: false,
    isLoading: false,
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
    async sendRequest() {
      const requestURL = "http://localhost:8085/converter";
      const formData = new FormData();
      formData.append("file", this.uploaderFile);

      console.log(formData); //  delete

      try {
        this.isLoading = !this.isLoading;
        const response = await fetch(requestURL, {
          method: "POST",
          mode: "cors",
          body: formData,
        });
        if (response.ok) {
          console.log(response); //  delete
          const zipAsBase64 = await response.text(); // move to download and connect btn backHome
          const blob = await b64ToBlob(zipAsBase64, "application/zip");
          FileSaver.saveAs(blob, "example.zip");
        } else {
          console.log("Error HTTP: " + response.status);
        }
      } catch (error) {
        console.log("Request execution error: " + error.message);
      } finally {
        this.isLoading = !this.isLoading;
        this.$router.push({ name: "result" });
      }
    },
  },
};
</script>
