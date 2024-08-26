<template>
  <div class="chat" v-if="chat">
    <div class="chat__head">
      <div class="chat__head-fullname" @click="router.push(`/user/${chat.from?._id}`)">
        <img v-if="chat.from?.avatar" :src="`${chat?.from.avatar}`" />
        <img v-else src="/img/default_avatar.svg" />
        <div>
          <p>{{ chat.from?.full_name }}</p>
          <p class="color-secondary"> {{ chat.from?.email }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChats } from "@/store/chats.js";

const route = useRoute();
const router = useRouter()
const chat = ref({});
const chatsStore = useChats();

onMounted(() => {
  chatsStore.getChat(route.params.id)
    .then((data) => (chat.value = data))
    .catch(() => router.push('/chats'))
});

const messages = ref([]);

const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", () => {
  // socket.send("iloveyou");
});

socket.addEventListener("message", (value) => {
  console.log("client message", value.data);
  messages.value.push(JSON.parse(value.data).message);
  // socket.send('message');
});

socket.addEventListener("close", () => {
  socket.send("close");
});

const sendMessage = () => {
  console.log("socket", socket);
  let sendMessage = JSON.stringify({
    event: ".send_message",
    message: "Send someting...",
  });
  socket.send(sendMessage);
};
</script>

<style lang="scss" scoped>
.chat {
  &__head {
    padding-bottom: 10px;
    border-bottom: 1px solid $default-border-color;

    &-fullname {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 64px;
        height: 64px;
        border-radius: 100%;
        // border: 1px solid $default-border-color;
        object-fit: cover;
        margin-right: 10px;
      }
    }
  }
}
</style>