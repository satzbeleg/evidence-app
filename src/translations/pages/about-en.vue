<template>
  <h1 class="title is-3">About the EVIDENCE Project"</h1>
  <p></p>

  <h2 class="subtitle is-5">Motivation</h2>
  <div class="content">
    <p>
      In many dictionaries, corpus references support the lexicographical description of a word. The selection of suitable and helpful sentence examples is a challenge because the operationalization of broad criteria such as 'quality' and 'appropriateness' of sentence examples into metrics is not trivial and professional lexicographers do not always achieve an unanimous judgment which sentence example fits best in the description of a lemma.
    </p>
  </div>

  <h2 class="subtitle is-5">Goals</h2>
  <div class="content">
    <p>
      In order to support lexicographers in their decision-making process, a system for the extraction, classification and evaluation of sentence examples is to be developed and integrated into the lexical information system of the DWDS. 
      The recommendation system suggests a group of sentence examples for each lemma, each of which is considered to be of high quality and together have a high variety and facets and nuances of word usage. 
      The recommendation system is to be developed to such an extent that sufficiently good sentence examples are suggested to the external users of the lexical information system even for lemmas that have not yet been fully lexically treated by an expert.
    </p>
  </div>

  <h2 class="subtitle is-5">Methodology</h2>
  <div class="content">
    <p>
      The application is primarily used to assess the goodness and diversity of sentence examples. The best-worst scaling method is used to assess the goodness. 
      The annotators are shown four sentence examples from which they can select the best and the worst sentence example. 
      The resulting rankings are used as target variables in a supervised learning algorithm. 
      In order to evaluate the diversity of sentence examples for a given lemma, users must use sliders to indicate to what extent they trade off goodness over diversity and which types of diversity are preferred (e.g. different grammar, semantics, source references). 
      With a quadratic optimization algorithm, the displayed sets of sentence examples are re-sorted based on these parameters until the user is satisfied with the displayed selection.
    </p>
  </div>

  <h2 class="subtitle is-5">Team members</h2>
  <div class="content">
    <ul>
      <li>
        <a href="https://web.archive.org/web/20210422143659/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/head_ukp/index.en.jsp">Prof. Dr. Iryna Gurevych</a>,
        Principal Investigator in Darmstadt
        (Technical University of Darmstadt, Ubiquitous Knowledge Processing Lab)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201025172725/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/geyken-alexander">PD Dr. Alex Geyken</a>,
        Principal Investigator in Berlin
        (Berlin-Brandenburg Academy of Sciences and Humanities, Research Centre for Language)
      </li>
      <li>
        <a href="https://web.archive.org/web/20210304072438/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/lemnitzer-lothar">Dr. Lothar Lemmnitzer</a>,
        Expert Lexicographer
        (Berlin-Brandenburg Academy of Sciences and Humanities, Research Centre for Language)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201022100203/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/staff_ukp/detailseite_mitarbeiter_1_42880.en.jsp">Ji-Ung Lee</a>,
        Doctoral researcher
        (Technical University of Darmstadt, Ubiquitous Knowledge Processing Lab)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201207164444/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/hamster-ulf">Ulf Hamster</a>,
        Research Software Engineer
        (Berlin-Brandenburg Academy of Sciences and Humanities, Research Centre for Language)
      </li>
    </ul>
  </div>

  <h2 class="subtitle is-5">Project partners</h2>
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

  <h2 class="subtitle is-5">Funding</h2>
  <div class="content">
    <p>
      This work was funded by the Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) - 433249742. Project duration: 2020-2023.
    </p>
    <a href="https://gepris.dfg.de/gepris/projekt/433249742">https://gepris.dfg.de/gepris/projekt/433249742</a>
  </div>

</template>


<script>
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "AboutEN",
  components: {},
  setup(){
    const { t } = useI18n();
    return { t }
  }
});
</script>