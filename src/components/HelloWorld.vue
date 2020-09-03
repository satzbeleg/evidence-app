<template>
  <div class="content">
    <h1 class="title">{{ msg }}</h1>

    <h2 class="subtitle">i18n Examples</h2>
    Fixed translation
    <ul>
      <li>{{ $t('message.hello') }}</li>
    </ul>
    
    Named formatting
    <ul>
      <li>{{ $t('message.foo', {msg: "cool"}) }}</li>
    </ul>

    List formatting (phrases with multiple blanks)
    <ul>
      <li>{{ $t('message.myphrase', ["catches", "horses"]) }}</li>
    </ul>

    Custom formatting
    <ul>
      <li>{{ $t('message.plural', { n: 4 }) }}</li>
      <li>{{ $t('message.select', { gender: 'male' }) }}</li>
      <li>{{ $t('message.number', { current: 0.5 }) }}</li>
      <li>{{ $t('message.time', { current: new Date() }) }}</li>
    </ul>

    <h2 class="subtitle">FontAwesome</h2>
    <b-icon pack="fas" icon="tachometer-alt" size="is-large" type="is-primary">  </b-icon>
    <b-icon pack="fas" icon="info-circle" size="is-medium" type="is-info">  </b-icon>
    <b-icon pack="fas" icon="check-square" size="is-small" type="is-success">  </b-icon>
    <b-icon pack="fas" icon="exclamation-triangle" size="is-large" type="is-warning">  </b-icon>
    <b-icon pack="fas" icon="ban" size="is-medium" type="is-danger">  </b-icon>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>


