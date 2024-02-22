<script lang="ts">
import { defineComponent } from 'vue';
import HeroSectionFacet from './HeroSectionFacet';
import Card from './Card.vue';

export default defineComponent({
  components: {
    Card,
  },
  setup() {
    const heroSectionFacet = new HeroSectionFacet();
    return heroSectionFacet.setup();
  }
});
</script>
<template>
   <div class="hero-section">
    <Card v-for="card of cards" :data="card"/>
   </div>
</template>

<style scoped>
.hero-section::before {
  background-color: rgb(66, 67, 61);
  content: "";
  height: .0625rem;
  width: 100%;
  position: relative;
  display: block;
  margin-top: 60px;
}
</style>
