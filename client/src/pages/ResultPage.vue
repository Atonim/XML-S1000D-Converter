<template>
  <div class="result-page">
    <h1>Конвертированный документ</h1>
    <div class="result-page__btns">
      <button class="result-page__download-btn download-btn" @click="download">
        Скачать
      </button>
      <button
        class="result-page__back-btn back-bth"
        @click="$router.push({ name: 'home' })"
      >
        Назад
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async download() {
      const requestURL = "http://localhost:8085/converter";
      try {
        const response = await fetch(requestURL);
        if (response.ok) {
          console.log(response); //  delete
          /* const zipAsBase64 = await response.text()
					const blob = await b64ToBlob(zipAsBase64, 'application/zip')
					FileSaver.saveAs(blob, 'example.zip')*/ // ???
        } else {
          console.log("Error HTTP: " + response.status);
        }
      } catch (error) {
        console.log("Request execution error: " + error.message);
      }
    },
  },
};
</script>
