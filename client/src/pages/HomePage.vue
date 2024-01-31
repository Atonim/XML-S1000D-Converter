<template>
  <div class="home-page">
    <h1>Конвертировать Word в XML S1000D</h1>
    <Uploader @drop.prevent="drop" @change="selectedFile"></Uploader>
    <span v-if="uploaderFile" class="file-info"
      >Имя загруженного файла: <strong>{{ uploaderFile.name }}</strong></span
    >
    <button
      class="home-page__next-btn next-bth"
      :class="{ disabled: !uploaderFile }"
      @click="uploaderFile ? startConverter(uploaderFile) : (message = true)"
    >
      Конвертировать
    </button>
    <span v-if="!uploaderFile && message">Сначала загрузите файл</span>
  </div>
</template>

<script>
import Uploader from "@/components/Uploader";
import { ref } from "vue";
import FileSaver from "file-saver";
import b64ToBlob from "b64-to-blob";

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
      const requestURL = "http://localhost:8085/converter";

      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      console.log(formData);
      try {
        const response = await fetch(requestURL, {
          method: "POST",
          mode: "cors",
          body: formData,
        });
        if (response.ok) {
          console.log(response);
          const zipAsBase64 = await response.text();
          const blob = await b64ToBlob(zipAsBase64, "application/zip");
          FileSaver.saveAs(blob, "example.zip");
        } else {
          console.log("Error HTTP: " + response.status);
        }
      } catch (error) {
        console.log("Request execution error: " + error.message);
      }
    },

    startConverter(file) {
      //startZip();
      this.sendRequest(file);
      //startUnzip(file);
      this.$router.push("/getResult");
    },
  },
};
</script>
