<template>
  <div
    class="chat__message"
    :class="{ chat__message_self: message.from_id === me._id }"
  >
    <span>
      {{ message.message }}
    </span>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuth } from "@/store/auth.js";

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
  padding: 8px;
  border-radius: 8px;
  max-width: 80%;
  background: $button-background;

  &_self {
    background: $card-background;
    margin-left: auto;
  }
}
</style>