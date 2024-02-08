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
          src="@/assets/img/png/DOC_file.png"
          alt="doc"
          class="uploader__file-icon"
          srcset="@/assets/img/svg/DOC_file.svg"/>
				<span>{{ uploaderFile.name.slice(0, maxLength) + "..." + uploaderFile.name.slice(-maxLength)}}</span>
			</div>
			<button
				class="uploader__trash-btn">
				<div class="uploader__trash-tooltip">
					<img 
          src="@/assets/img/png/trash.png"
          alt="trash"
          class="uploader__trash-icon"
          srcset="@/assets/img/svg/trash.svg"/>
					<span class="uploader__trash-tooltiptext">Удалить файл</span>
				</div>
			</button>
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
