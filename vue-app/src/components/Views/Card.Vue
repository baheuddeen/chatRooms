<script lang="ts">
import { defineComponent } from 'vue';
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';
import CardFacet, { Card } from './cardFacet';

export default defineComponent({
  props: {
    data: {
      type: () => null as unknown as Card,
    },
  },
  
  components: {
    Carousel,
    Button,
  },
  setup() {
    const cardFacet = new CardFacet();
    return cardFacet.setup();
  }
});
</script>
<template>
    <div class="card-section" ref="cardElement">
        <div class="m-2 text-center py-5 px-3 flex card-item row">
        <div class="col-md-4 p-4 left-section">
            <img :src="data?.image" :alt="data?.title" class="card-image shadow-2" />
        </div>
        <div class="card-text col-md-8  p-4 right-section">
            <h4 class="card-title mb-1">{{ data?.title }}</h4>
            <p class="card-desc mt-0">{{ data?.desc }}</p>
        </div>
        </div>
    </div>
</template>

<style scoped>
.card-section::after {
  background-color: rgb(66, 67, 61);
  content: "";
  height: .0625rem;
  width: 100%;
  position: relative;
  display: block;
  margin-top: 60px;
}
.card-image {
    width: 200px;
}
.card-text {
    text-align: center;
}
.card-title {
  font-size: 60px;
  font-weight: 600;
  letter-spacing: 0px;
}
.card-desc {
    text-align: left;
    padding-top: 25px;
    font-size: initial;
}
.card-item {
    height: 96%
}

@media (max-width: 766px) {
  .card-item {
    flex-direction: column;
    align-items: center;
  }

  .card-item img.card-image{
    width: 150px;
  }

  .card-desc {
    display: none !important;
  }

  .card-text {
    width: 100%;
  }

  .enc-img img {
    width: 35px;
  }

  .why-wee h1{
    font-size: 35px !important;
  }
}
</style>
