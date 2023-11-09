<script lang="ts">
import { defineComponent } from 'vue';
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';
import CarouselFacet from './CarouselFacet';

export default defineComponent({
  components: {
    Carousel,
    Button,
  },
  setup() {
    const carouselFacet = new CarouselFacet();
    return carouselFacet.setup();
  }
});
</script>
<template>
    <Carousel :value="cards" :numVisible="2" :numScroll="1" :responsiveOptions="responsiveOptions">
        <template #item="slotProps">
            <div class="border-1 surface-border border-round m-2 text-center py-5 px-3 flex card-item row">
            <div class="col-4 p-4">
                <img :src="slotProps.data.image" :alt="slotProps.data.title" class="card-image shadow-2" />
            </div>
            <div class="card-text col-8 p-4">
                <h4 class="card-title mb-1">{{ slotProps.data.title }}</h4>
                <p class="card-desc mt-0">{{ slotProps.data.desc }}</p>
            </div>
            </div>


        </template>
    </Carousel>
</template>

<style scoped>
.card-image {
    width: 100%;
}
.card-text {
    text-align: center;
}
.card-title {
    font-size: x-large;
}
.card-desc {
    text-align: left;
    padding-top: 25px;
    font-size: initial;
}
.card-item {
    height: 96%
}
</style>
