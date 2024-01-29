<template>
	<div>
		<div class="result-page">
			<h1>Конвертированный документ</h1>
			<Preloader v-if="show" />
			<div v-else class="result-page__btns">
				<button
					class="result-page__download-btn download-btn"
					@click="download"
				>
					Скачать
				</button>
				<button
					class="result-page__back-btn back-bth"
					@click="$router.push('/')"
				>
					Назад
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { startZip, startUnzip } from '../../../server/src/converter/jszip'
import Preloader from '@/components/UI/Preloader'
import FileSaver from "file-saver"
import b64ToBlob from "b64-to-blob"

export default {
	components: {
		Preloader,
	},
	data: () => {
		return {
			show: true,
		}
	},
	mounted() {
    this.emitter.on('fileTransfer', file => { // temp
      console.log(`Working with ${file.name}`);
			this.sendRequest(file);
    });
		this.showToggle();
	},
	methods: {
		async sendRequest(file) {
			//this.show = this.show;
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
					//this.show = !this.show;
				} else {
					console.log("Error HTTP: " + response.status);
				}
			} catch (error) {
				console.log("Request execution error: " + error.message);
			}
		},
		showToggle() {
			// temp
			setTimeout(() => {
				this.show = false
			}, 5000)
		},
		download() {
			//startUnzip();
			//startZip();
		},
	},
}
</script>

<style lang="scss" scoped></style>
