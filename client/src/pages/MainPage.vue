<template>
  <div class="main-page">
    <div 
      class="preloader" 
      v-if="isLoading">
      <img 
          src="@/assets/img/png/preloader.png"
          alt="preloader"
          class="preloader__loader"
          srcset="@/assets/img/svg/preloader.svg"/>
    </div>
    <div 
      class="main-page__content" 
      v-else>
      <h1 class="main-page__header">
        Word &#8594 XML S1000D
      </h1>
        <FileUploader 
          @drop.prevent="drop" 
          @change="selectedFile"
          @deleteFile="deleteFile"
          :uploaderFile="uploaderFile"
        />
      <button 
        class="main-page__btn" 
        :class="{ 'main-page__btn_disabled' : !uploaderFile }"
        @click="uploaderFile ? sendRequest() : setMessage()">
        Конвертировать
      </button>
      <span 
        v-if="!uploaderFile && message"
        class="main-page__warning">
        <img 
          src="@/assets/img/png/error.png"
          alt="error"
          class="icon"
          srcset="@/assets/img/svg/error.svg"/>
        {{ message }}
      </span>
      <DialogWindow 
        :isDownload="isDownload"
        @hideWindow="showHideDialogWindow"/>
    </div>
  </div>
</template>

<script>
import FileUploader from '@/components/FileUploader'
import DialogWindow from '@/components/DialogWindow.vue'
import b64ToBlob from 'b64-to-blob'
import FileSaver from 'file-saver'
import { ref } from 'vue'

export default {
  components: {
    FileUploader,
    DialogWindow,
},

  setup() {
    let uploaderFile = ref('');
    const message = ref('');
    const isLoading = ref(false);
    const isDownload = ref(false);
    
    const drop = (e) => {
      uploaderFile.value = e.dataTransfer.files[0];

      let type = uploaderFile.value.type
      if (type !== 'application/msword' && 
          type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          setMessage('Недопустимый формат файла: .' + getFileExtension())
          deleteFile()
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
    const setMessage = 
      (text = 'Прикрепите недостающий документ в формате .doc или .docx') => {
      message.value = text;
    };
    const getFileExtension = () => {
      return uploaderFile.value.name.split('.').pop();
    };
    const showHideDialogWindow = () => {
      isDownload.value = !isDownload.value;
    };

    return {
      uploaderFile,
      isDownload,
      isLoading,
      message,

      drop,
      selectedFile,
      deleteFile,
      toggleLoading,
      setMessage,
      getFileExtension,
      showHideDialogWindow
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
        this.showHideDialogWindow()
        this.deleteFile()
      }
    }
  },
};
</script>

