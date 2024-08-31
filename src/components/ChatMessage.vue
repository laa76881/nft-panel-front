<template>
  <div
    class="chat__message"
    :class="{ chat__message_self: message.from_id === me._id }"
    :id="`message-${message._id}`"
  >
    <p>
      {{ message.message }}
    </p>

    <p class="chat__message-date">
      {{ dayjs(message.createdAt).format("DD.MM.YYYY HH:mm") }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
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
</script>

<style lang="scss" scoped>
.chat__message {
  display: flex;
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