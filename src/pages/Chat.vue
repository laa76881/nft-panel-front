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
          <p class="capitalize">{{ chat.from?.full_name }}</p>
          <p class="color-secondary">{{ chat.from?.email }}</p>
        </div>
      </div>
    </div>

    <div class="chat__body">
      <ul class="chat__messages">
        <button class="app-button chat__load-more" @click="filters.page += 1">
          Load more
        </button>
        <ChatMessage
          v-for="(message, i) in messages"
          :key="i"
          :message="message"
        />
      </ul>

      <div class="chat__actions">
        <p class="chat__actions-activity" v-if="userActivity">
          <span class="capitalize">{{ chat.from?.full_name }}</span> is
          typing...
        </p>
        <textarea
          v-model="text"
          name="text"
          class="app-input chat__actions-input"
          @keypress="emitActivity"
          @keyup.enter="sendMessage"
        ></textarea>
        <button class="chat__actions-send" @click="sendMessage">
          <send-icon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import { io } from "socket.io-client";
import { useRoute, useRouter } from "vue-router";
import { useChats } from "@/store/chats.js";
import SendIcon from "@/assets/icons/send.vue";
import ChatMessage from "@/components/ChatMessage.vue";
import { useToast } from "@/main";

const route = useRoute();
const router = useRouter();
const chatsStore = useChats();

const chat = ref({});
const messages = ref([]);
const text = ref("");
const filters = ref({
  per_page: 10,
  page: 1,
  // status: statusOptions[0],
  // search: refDebounced(search, 1000),
});
const userActivity = ref(false);

watch(filters.value, () => {
  getMessages();
});

onMounted(() => {
  chatsStore
    .getChat(route.params.id)
    .then(async (data) => {
      chat.value = data;
      await getMessages();
      if (messages.value.length)
        scrollToMessageById(messages.value[messages.value.length - 1]._id);
    })
    .catch(() => router.push("/chats"));
});

const socket = io("ws://localhost:3000", {
  path: `/app/${import.meta.env.VITE_SOCKET_KEY}`,
  reconnectionDelayMax: 10000,
  // autoConnect: false, // need to connect socket.connect()
  auth: {
    chat_id: route.params.id,
    token: localStorage.getItem("token"),
  },
});

function emitActivity() {
  socket.emit("activity");
}

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
  await chatsStore
    .getMessages({
      per_page: filters.value.per_page,
      page: filters.value.page,
    })
    .then((data) => {
      messages.value.unshift(...data.reverse());
    });
}

socket.on("message", (data) => {
  // console.log("on message", data);
  userActivity.value = false;
  messages.value.push(data);
  scrollToMessageById(data._id);
});

socket.on("connected", () => {
  useToast(`${chat.value.from?.full_name} connected!`, "success");
});

socket.on("disconnected", () => {
  useToast(`${chat.value.from?.full_name} disconnected!`, "warning");
});

onBeforeUnmount(() => {
  socket.disconnect();
});

let activityTimer;
socket.on("activity", () => {
  userActivity.value = true;
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    userActivity.value = false;
  }, 2000);
});

function scrollToMessageById(id) {
  setTimeout(() => {
    const el = document.querySelector(`#message-${id}`);
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}
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
      width: fit-content;

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
    gap: 24px;
  }

  &__actions {
    padding: $app-padding-xs;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-height: fit-content;
    margin-top: auto;
    position: relative;

    &-activity {
      position: absolute;
      top: 2px;
      font-size: 14px;
    }

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

  &__load-more {
    width: fit-content;
    margin: 20px auto;
    padding: 0 24px;
  }
}
</style>