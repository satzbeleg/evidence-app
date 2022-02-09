<template>
  <h1 class="title is-3">{{ t('about.title') }}</h1>
  <p></p>

  <h2 class="subtitle is-5">{{ t('about.motivation.heading') }}</h2>
  <div class="content">
    <p>{{ t('about.motivation.text') }}</p>
  </div>

  <h2 class="subtitle is-5">{{ t('about.goals.heading') }}</h2>
  <div class="content">
    <p>{{ t('about.goals.text') }}</p>
  </div>

  <h2 class="subtitle is-5">{{ t('about.method.heading') }}</h2>
  <div class="content">
    <p>{{ t('about.method.text') }}</p>
  </div>

  <h2 class="subtitle is-5">{{ t('about.team.heading') }}</h2>
  <div class="content">
    <ul>
      <li>
        <a v-bind:href="t('about.team.member1.www')">{{ t('about.team.member1.name') }}</a>,
        {{ t('about.team.member1.role') }}
        ({{ t('about.team.member1.inst') }})
      </li>
      <li>
        <a v-bind:href="t('about.team.member2.www')">{{ t('about.team.member2.name') }}</a>,
        {{ t('about.team.member2.role') }}
        ({{ t('about.team.member2.inst') }})
      </li>
      <li>
        <a v-bind:href="t('about.team.member3.www')">{{ t('about.team.member3.name') }}</a>,
        {{ t('about.team.member3.role') }}
        ({{ t('about.team.member3.inst') }})
      </li>
      <li>
        <a v-bind:href="t('about.team.member4.www')">{{ t('about.team.member4.name') }}</a>,
        {{ t('about.team.member4.role') }}
        ({{ t('about.team.member4.inst') }})
      </li>
      <li>
        <a v-bind:href="t('about.team.member5.www')">{{ t('about.team.member5.name') }}</a>,
        {{ t('about.team.member5.role') }}
        ({{ t('about.team.member5.inst') }})
      </li>
    </ul>
  </div>

  <h2 class="subtitle is-5">{{ t('about.partners.heading') }}</h2>
  <nav class="columns is-vcentered">
    <a target="_blank" href="https://web.archive.org/web/20210418050350/https://www.informatik.tu-darmstadt.de/ukp/research_ukp/ukp_research_projects/ukp_project_evidence/index.en.jsp"
        class="column has-text-centered">
      <figure>
        <img style="width: 256px;" 
          src="http://web.archive.org/web/20201207164752if_/https://www.informatik.tu-darmstadt.de/media/ukp/logo/ukp_logo_182x0.png"
          alt="Ubiquitous Knowledge Processing (UKP) Lab, Techische Universität Darmstadt">
      </figure>
    </a>
    <a target="_blank" href="https://gepris.dfg.de/gepris/projekt/433249742"
        class="column has-text-centered">
      <figure>
        <img style="width: 256px;" 
          src="http://web.archive.org/web/20210612151857if_/https://www.dfg.de/includes/images/layout/dfg_logo_schriftzug.svg"
          alt="Deutsche Forschungsgemeinschaft (DFG)">
      </figure>
    </a>
    <a target="_blank" href="https://web.archive.org/web/20210304060300/https://www.bbaw.de/forschung/evidence" 
        class="column has-text-centered">
      <figure>
        <img style="width: 256px;" 
          src="http://web.archive.org/web/20210613014610if_/https://www.bbaw.de/typo3conf/ext/bbaw/Resources/Public/Images/Berlin-Brandenburgische_Akademie_der_Wissenschaften.svg"
          alt="Berlin-Brandenburg Academy of Sciences and Humanities (BBAW)">
      </figure>
    </a>
  </nav>

  <h2 class="subtitle is-5">{{ t('about.funding.heading') }}</h2>
  <div class="content">
    <p>{{ t('about.funding.text') }}</p>
    <a href="https://gepris.dfg.de/gepris/projekt/433249742">https://gepris.dfg.de/gepris/projekt/433249742</a>
  </div>

</template>


<script>
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "AboutDE",
  components: {},
  setup(){
    const { t } = useI18n();
    return { t }
  }
});
</script>