<template>
  <div v-if="chat" class="chat">
    <div class="chat__head">
      <div
        class="chat__head-fullname"
        @click="router.push(`/user/${chat.from?._id}`)"
      >
        <img v-if="chat.from?.avatar" :src="`${chat?.from.avatar}`" />
        <img v-else src="/img/default_avatar.svg" />
        <div>
          <p>{{ chat.from?.full_name }}</p>
          <p class="color-secondary">{{ chat.from?.email }}</p>
        </div>
      </div>
    </div>

    <div class="chat__body">
      <ul class="chat__messages">
        <ChatMessage
          v-for="(message, i) in messages"
          :key="i"
          :message="message"
        />
      </ul>

      <div class="chat__actions">
        <!-- <p class="activity"></p> -->
        <textarea
          v-model="text"
          name="text"
          class="app-input chat__actions-input"
        ></textarea>
        <button class="chat__actions-send" @click="sendMessage">
          <send-icon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { io } from "socket.io-client";
import { useRoute, useRouter } from "vue-router";
import { useChats } from "@/store/chats.js";
import SendIcon from "@/assets/icons/send.vue";
import ChatMessage from "@/components/ChatMessage.vue";
import { useToast } from "@/main";

const route = useRoute();
const router = useRouter();
const chat = ref({});
const chatsStore = useChats();

onMounted(() => {
  chatsStore
    .getChat(route.params.id)
    .then((data) => {
      chat.value = data;
      getMessages()
    })
    .catch(() => router.push("/chats"));
});

const messages = ref([]);
const text = ref("");

const socket = io("ws://localhost:3000", {
  path: `/app/${import.meta.env.VITE_SOCKET_KEY}`,
  reconnectionDelayMax: 10000,
  auth: {
    token: localStorage.getItem("token"),
  },
  // query: {
  //   "my-key": "my-value"
  // }
});

// const activity = document.querySelector(".activity");
// const msgInput = document.querySelector("input");

async function sendMessage(e) {
  await chatsStore
    .sendMessage({
      message: text.value,
    })
    .then((message) => {
      socket.emit("message", message);
      text.value = "";
    });
}

async function getMessages() {
  // add pagination
  
}

socket.on("message", (data) => {
  // activity.textContent = "";
  console.log("on message", data);
  messages.value.push(data);
});

socket.on("connected", (data) => {
  useToast(`${chat.value.from?.full_name} connected!`, "success");
});

socket.on("disconnected", (data) => {
  useToast(`${chat.value.from?.full_name} disconnected!`, "warning");
});

onBeforeUnmount(() => {
  socket.disconnect();
});

// msgInput.addEventListener("keypress", () => {
//   socket.emit("activity", socket.id.substring(0, 5));
// });
// let activityTimer;
// socket.on("activity", (name) => {
//   console.log("activity", name);
//   activity.textContent = `${name} is typing...`;

//   // Clear after 3 seconds
//   clearTimeout(activityTimer);
//   activityTimer = setTimeout(() => {
//     activity.textContent = "";
//   }, 3000);
// });
</script>

<style lang="scss" scoped>
.chat {
  &__head {
    padding-bottom: 10px;
    border-bottom: 1px solid $default-border-color;
    padding: $app-padding-xs;

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

  &__body {
    height: calc(100vh - 105px - 90px);
    display: flex;
    flex-direction: column;
  }

  &__messages {
    display: flex;
    flex-direction: column;
    padding: $app-padding-xs;
    overflow: scroll;
    gap: 8px;
  }

  &__actions {
    padding: $app-padding-xs;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-height: fit-content;
    margin-top: auto;

    &-input {
      min-height: 64px;
      width: 100%;
      padding: 8px;
    }

    &-send {
      width: 64px;
      height: 64px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $button-background;
      border: 1px solid $color-violet;
      transition: all 0.1s;

      svg {
        width: 48px;
        height: 48px;
      }

      &:hover:not(:disabled) {
        cursor: pointer;
        background: $color-violet;
        // color     : $button-background;
        color: white;
      }
    }
  }
}
</style>