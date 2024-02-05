<template>
  <div 
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    class="uploader"
    :class="{ 'uploader_active' : active }"
  >
     <span>Перетащите файл сюда</span>
     <span>ИЛИ</span>
     <label>
      Выберите файл
      <input 
        type="file" 
        name="uploaderFile"
        class="uploaderFile"
        accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
     </label>
     
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FileUploader',
  setup() {
    const active = ref(false);
    const toggleActive = () => {
      active.value = !active.value;
    };
    return {
      active,
      toggleActive
    };
  }
}
</script>