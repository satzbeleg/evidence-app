<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="consent">
    <div class="container">
      <!-- put the following into components ... -->
      
      <h1 class="title is-3">{{ t('consent.title') }}</h1>
      <p>
      In er EVIDENCE App werden Sie gefragt, Satzbelege zu einem gegebenen Lemma zu bewerten. Um die Daten zu sammeln und weiter auswerten zu können, benötigen wir Ihre Einwilligung. Im Folgenden klären wir Sie darüber auf, welche Informationen zu welchem Zweck in dieser Studie gesammelt werden.
      </p>

      <h2 class="subtitle is-5">Lorem </h2>
      <div class="content">
        <p>ipsum</p>
      </div>

      <!-- put the above into components ... -->
    </div>
  </section>
</template>

