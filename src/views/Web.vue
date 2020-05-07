<template>
  <v-container pa-0 fluid>
    <system-application></system-application>
  </v-container>
</template>
<script>
import SystemApplication from '@/components/SystemApplication.vue'

export default{
  data: () => {
    return {
      name: 'test'
    }
  },
  components: {
    SystemApplication
  },
  methods: {
    
  }
}
</script>