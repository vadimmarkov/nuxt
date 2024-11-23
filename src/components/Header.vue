<script setup lang="ts">
const a = 1;
const b = 2;

const aff =
  'asdjfh aklsj dhfkajhsd flkj asdklf halkjsdfh klajsdhf lkjadsflk jaskldjf hakljsdfh lkajdfhlkjadfslk';

const foo = {
  bar: 'This is a bar.',
  baz: { qux: 'This is a qux' },
  difficult: 'to read',
}; // very long

const text = 'hahah';

console.log('fuck');
console.warn('fuck', foo);

const props = defineProps({
  some: {
    type: Number,
  },
});

onMounted(() => {
  console.log('hahahah');
});
</script>

<template>
  <h1>header</h1>
  <p v-html="text" />

  <ul>
    <li>dsfasdf</li>
  </ul>
</template>

<style scoped></style>
