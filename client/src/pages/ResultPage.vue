<template>
	<div>
		<div class="result-page">
			<h1>Конвертированный документ</h1>
			<Preloader v-if="isLoading" />
			<div v-else class="result-page__btns">
				<button
					class="result-page__download-btn download-btn"
					@click="download"
				>
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
	</div>
</template>

<script>
//import { startZip, startUnzip } from '../../../server/src/converter/jszip' // delete
import Preloader from '@/components/UI/Preloader'

export default {
	components: {
		Preloader,
	},
	data: () => {
		return {
			isLoading: true,
			base64File: ''
		}
	},
	created() {
		this.base64File = this.$route.query.file;
		console.log(this.base64File);
		/*const decodeBase64 = decodeURIComponent(window.atob(encodeBase64));
		console.log(decodeBase64)*/
	},
	mounted() {
		this.showToggle();
	},
	methods: {
		download() {
			//startUnzip();
			//startZip();
		},
		showToggle() {
			// temp
			setTimeout(() => {
				this.isLoading = false;
			}, 5000);
		},
	},
}
</script>
