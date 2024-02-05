<template>
	<div class="result-page">
		<h1 class="result-page__header header">
			Файл успешно сконвертирован и загружен
		</h1>
		<button 
			class="result-page__back-btn" 
			@click="$router.push({ name: 'main-page' })">
			Назад
		</button>
	</div>
</template>