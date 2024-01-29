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
    this.emitter.on('fileTransfer', message => { // temp
      console.log('Working!');
    });
		this.showToggle()
	},
  
	methods: {
		download() {
			//startUnzip();
			//startZip();
		},
		showToggle() {
			// temp
			setTimeout(() => {
				this.show = false
			}, 5000)
		},
	},
}
</script>

<style lang="scss" scoped></style>
