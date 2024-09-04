<template>
  <div
    class="chat__message"
    :id="`message-${message._id}`"
    :class="{
      chat__message_self: message.from_id === me._id,
      'chat__message-attachment': message.attachment,
    }"
  >
    <div v-if="message.attachment" class="chat__message-attachment-icon">
      <img src="/img/attach.svg" />
    </div>

    <div class="chat__message-text">
      <p @click="message.attachment ? openFile() : ''">
        {{
          message.attachment ? setFileName(message.message) : message.message
        }}
      </p>

      <p v-if="message.attachment" class="chat__message-size">
        {{ setFileSize(message.attachment.size) }}
      </p>
    </div>

    <p class="chat__message-date">
      {{ setDate(message.createdAt) }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { setFileName } from "@/tools/helpers/formatName.js";
import { useAuth } from "@/store/auth.js";
import dayjs from "dayjs";

const authStore = useAuth();
const me = computed(() => authStore.me);

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

function openFile() {
  window.open(props.message.attachment?.path);
}

function setDate(date) {
  return dayjs(date).format("DD.MM.YYYY HH:mm")
}

function setFileSize(size) {
  if (size < 1000) return size + " Б";
  if (size < 1000000) return (size / 1000).toFixed(1) + " КБ";

  return (size / 1000 / 1000).toFixed(1) + " МБ";
}
</script>

<style lang="scss" scoped>
.chat__message {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 8px;
  max-width: 80%;
  background: $button-background;
  position: relative;

  &-date {
    position: absolute;
    font-size: 12px;
    bottom: -18px;
    white-space: nowrap;
    left: 0;
    color: $secondary-text-color;
  }

  &-text {
  }

  &-size {
    font-size: 12px;
    color: $color-violet;
  }

  &-attachment {
    .chat__message-text:hover {
      cursor: pointer;
      color: $color-violet;
    }

    &-icon {
      display: flex;
      margin-right: 4px;
      padding: 4px;
      border-radius: 100%;
      background: $card-background;
      border: 1px solid $color-violet;
      margin-right: 8px;

      img {
        width: 20px;
      }
    }
  }

  &_self &-attachment-icon {
    background: $button-background;
  }

  &_self {
    background: $card-background;
    margin-left: auto;
  }

  &_self &-date {
    right: 0;
    left: auto;
  }
}
</style>