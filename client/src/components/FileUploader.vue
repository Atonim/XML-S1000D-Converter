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
			class="uploader__file-view"
			v-if="uploaderFile">
			<div class="uploader__file-name">
				<img 
          src="@/assets/img/png/doc_file.png"
          alt="doc"
          class="uploader__file-icon"
          srcset="@/assets/img/svg/doc_file.svg"/>
				<span v-if="uploaderFile.name.length > maxLength * 2">{{ uploaderFile.name.slice(0, maxLength) + "..." + uploaderFile.name.slice(-maxLength)}}</span>
				<span v-else>{{ uploaderFile.name }}</span>
			</div>
			<button
				class="uploader__trash-btn"
				@click="$emit('deleteFile')">
				<div class="uploader__trash-tooltip">
					<img 
          src="@/assets/img/png/trash.png"
          alt="trash"
          class="uploader__trash-icon"
          srcset="@/assets/img/svg/trash.svg"/>
					<span class="uploader__trash-tooltip-text">
						Удалить файл
					</span>
				</div>
			</button>
		</div>
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
		const maxLength = 12;
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
