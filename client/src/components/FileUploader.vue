<template>
	<div
		@dragenter.prevent="toggleActive"
		@dragleave.prevent="toggleActive"
		@dragover.prevent
		@drop.prevent="toggleActive"
		class="uploader"
		:class="{ uploader_active: active }"
	>
		<span>Перетащите файл сюда</span>
		<span>ИЛИ</span>
		<label>
			Выберите файл
			<input
				type="file"
				name="uploaderFile"
				class="uploaderFile"
				accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			/>
		</label>

		<div
			class="uploader__view-file"
			v-if="uploaderFile">
			<div class="uploader__icon-file"></div>
			<span>{{ uploaderFile.name.slice(0, maxLength) + "..." + uploaderFile.name.slice(-maxLength)}}</span>
			<!--button?-->
		</div>
		<!--<span 
			v-if="uploaderFile">
		</span>-->
	</div>
</template>

<script>
import { ref } from 'vue'

export default {
	name: 'FileUploader',
	props: {
		uploaderFile: {
			required: true,
		},
	},
	setup() {
		const active = ref(false)
		const maxLength = 11;
		const toggleActive = () => {
			active.value = !active.value
		}

		return {
			active,
			maxLength,
			toggleActive
		}
	},
}
</script>
