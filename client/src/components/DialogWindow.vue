<template>
  <div 
    class="dialog-window" 
    v-if="isDownload">
    <div class="dialog-window__content">
      <button 
        class="dialog-window__btn-close" 
        @click="hideDialogWindow">
        <img 
            src="@/assets/img/png/close.png"
            alt="close"
            class="dialog-window__close-icon"
            srcset="@/assets/img/svg/close.svg"/>
      </button>
      <span>Преобразование файла завершено.</span>
      <span>Файл успешно загружен.</span>
      <!--а если не успешно, спросить-->
    </div>
    <div class="dialog-window__overlay"></div>
  </div>
</template>

<script>
export default {
  name: 'DialogWindow',
  props: {
    isDownload: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const hideDialogWindow = () => {
      context.emit('hideWindow')
    }
    return {
      hideDialogWindow
    }
  }
}
</script>

<style scoped lang="scss"> // move to global
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.dialog-window {
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;

	&__content {
		position: relative;
		z-index: 2;
		width: $widthDragDrop;
    @include breakpoint(md) {
			width: $widthDragDrop_md;
		}
		min-height: 150px;
		background: $gray_1;
		border-radius: 10px;
    @include flex();
		row-gap: 8px;
		padding: 16px;
    margin: auto;
    transition: $transition;
	}

	&__btn-close {
		position: absolute;
		right: 10px;
		top: 10px;
		border: none;
		background: none;
	}

  &__close-icon {
    width: 15px;
		height: 15px;
		@include breakpoint(md) {
			width: 18px;
			height: 18px;
		}
  }

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: black;
		opacity: 0.6;
		z-index: 0;
	}
}
</style>