<script setup>
import Container from './Container.vue';
import Card from './Card.vue';


const data = [
    {
        id:1,
        username: 'John Doe',
        url: "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-28161-20140513-metallica-x1800-1399997244.jpg?w=1581&h=1054&crop=1",
        caption: "Rock on!"
    },
    {
        id:2,
        username: 'John Does',
        url: "https://media.pitchfork.com/photos/6384d8132433cfb2d45c761a/4:3/w_2664,h_1998,c_limit/Metallica.jpg",
        caption: "Hello"
    }
]
</script>

<template>
    <Container>
    <div class="flex items-center flex-col gap-5 mt-4">
        <Card v-for="post in data" :key="post.id" :post="post" />
    </div>
    </Container>
</template>