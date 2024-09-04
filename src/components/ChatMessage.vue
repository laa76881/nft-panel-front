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
      <img src="/img/attach-doc.svg" />
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
import { useAuth } from "@/store/auth.js";
import {
  setFileName,
  setDate,
  setFileSize,
} from "@/tools/helpers/formatChatData.js";

const authStore = useAuth();
const me = computed(() => authStore.me);

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const openFile = () => {
  window.open(props.message.attachment?.path);
};
</script>

<style lang="scss" scoped>
.chat__message {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 6px 12px;
  border-radius: $default-border-radius;
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
      padding: 8px;
      border-radius: 100%;
      background: $card-background;
      border: 1px solid $color-violet;
      margin-right: 8px;

      img {
        width: 22px;
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