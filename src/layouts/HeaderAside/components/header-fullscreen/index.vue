<template>
  
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      isFullScreen: state => state.d2admin.isFullScreen
    })
  },
  methods: {
    ...mapMutations([
      'd2adminFullScreenToggle'
    ])
  }
}
</script>
