<template>
  <table class="table is-striped is-fullwidth is-hoverable">
    <thead>
      <th>ID</th>
      <th>Evt Type</th>
      <th>Session Time</th>
    </thead>
    <tbody>
      <tr v-for="evt in $store.state.swipe1.swipes" :key="evt.item_id">
        <td>{{ (evt.item_id).slice(0, 5) + '...' }}</td>
        <td>{{ (evt.direction).split('-')[1] }}</td>
        <td>{{ new Date(evt['event-timestamp']).toISOString().slice(11, -1) }}</td>
        <!-- <td>{{ evt['posix-timestamp'] }}</td> -->
      </tr>
    </tbody>
  </table>
</template>


<script>
export default {
  name: "Swipe1Log",

  // computed: {
  //   events() {
  //     return this.$store.state.swipe1.swipes;
  //   }
  // }
}
</script>

