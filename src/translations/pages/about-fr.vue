<template>
  <h1 class="title is-3">À propos du projet EVIDENCE</h1>
  <p></p>

  <h2 class="subtitle is-5">Motivation</h2>
  <div class="content">
    <p>
      Dans plusieurs dictionnaires, la description lexicographique des mots est étayée par des exemples de corpus. Le choix d'exemples appropriés et utiles constitue un défi en raison de la difficulté d'opérationnaliser en métrique des critères tels que la „qualité“ et l'„adéquation“. 
      De plus, les lexicographes professionel·le·s n'arrivent pas toujours à déterminer à l'unanimité quel est l'exemple le plus approprié pour décrire un lemme.
    </p>
  </div>

  <h2 class="subtitle is-5">Objectifs</h2>
  <div class="content">
    <p>
      Un système d'extraction, de classification et d'évaluation des exemples de corpus est développé et intégré dans le système d'information lexicale du DWDS afin d'assister des lexicographes dans leur prise de décisions. 
      Ce système de recommandation a été conçu afin que des exemples suffisamment pertinents puissent être proposés aux utilisat·eur·rice·s externes du système d'infomations lexicales même pour des lemmes qui n'ont pas encore fait l'objet d'un traitement lexical complet par un·e expert·e.
    </p>
  </div>

  <h2 class="subtitle is-5">Méthodologie</h2>
  <div class="content">
    <p>
      L'application sert surtout à l'évaluation de la qualité et de la diversité des exemples. La qualité des exemples est mesurée à l'aide de l'échelle de différence maximale. 
      Les annotat·eur·rice·s doivent choisir le meilleur exemple et le pire parmi les quatre qui leur sont présentés. 
      Les classements ainsi obtenus sont utilisés comme variable cible dans un procédé d'apprentissage surveillé. 
      Pour évaluer la diversité des exemples d'un certain lemme, il est demandé aux utilisat·eur·rice·s de mettre en balance la qualité et la diversité et de spécifier quels genres de diversité leur convient le mieux (par exemple, des structures de phrase différentes, la sémantique, des indications de source) en ajustant des curseurs. 
      Les exemples présentés sont réorganisés avec un procédé d'optimisation quadratique selon ces paramètres jusqu'à ce que l'utilisat·eur·rice soit satisfait·e de la sélection affichée.
    </p>
  </div>

  <h2 class="subtitle is-5">Collaborat·eur·rice·s</h2>
  <div class="content">
    <ul>
      <li>
        <a href="https://web.archive.org/web/20210422143659/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/head_ukp/index.en.jsp">Prof. Dr. Iryna Gurevych</a>,
        Responsable de projet au site de Darmstadt
        (Université Technique de Darmstadt, Ubiquitous Knowledge Processing Lab)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201025172725/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/geyken-alexander">PD Dr. Alex Geyken</a>,
        Responsable de projet au site de Berlin
        (Académie des Sciences de Berlin-Brandebourg, Centre de recherche sur le langage)
      </li>
      <li>
        <a href="https://web.archive.org/web/20210304072438/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/lemnitzer-lothar">Dr. Lothar Lemmnitzer</a>,
        Expert de lexicographie
        (Académie des Sciences de Berlin-Brandebourg, Centre de recherche sur le langage)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201022100203/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/staff_ukp/detailseite_mitarbeiter_1_42880.en.jsp">Ji-Ung Lee</a>,
        Collaborateur scientifique
        (Université Technique de Darmstadt, Ubiquitous Knowledge Processing Lab)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201207164444/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/hamster-ulf">Ulf Hamster</a>,
        Collaborateur scientifique, développement de logiciels
        (Académie des Sciences de Berlin-Brandebourg, Centre de recherche sur le langage)
      </li>
    </ul>
  </div>

  <h2 class="subtitle is-5">Partenaires de projet</h2>
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

  <h2 class="subtitle is-5">Financement</h2>
  <div class="content">
    <p>Ce travail a été financé par la Deutsche Forschungsgemeinschaft (DFG) - 433249742. Durée du projet: 2020-2023.</p>
    <a href="https://gepris.dfg.de/gepris/projekt/433249742">https://gepris.dfg.de/gepris/projekt/433249742</a>
  </div>

</template>


<script>
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "AboutFR",
  components: {},
  setup(){
    const { t } = useI18n();
    return { t }
  }
});
</script>