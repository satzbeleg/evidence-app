<template>
  <section class="section" id="about">
    <div class="container">
      <!-- put the following into components ... -->
      <h1 class="title is-3">EVIDENCE: Computerunterstützte interaktive Extraktion guter Wörterbuchbeispiele aus großen Korpora</h1>
      <div class="content">
        <p>
        Das DFG-Projekt löst ein zentrales lexikographisches Problem: Die Identifizierung und Extraktion guter Wörterbuchbeispiele aus einer großen Anzahl von Korpusbeispielen.
        </p>
      </div>

      <h2 class="subtitle is-5">Projektbeschreibung</h2>
      <div class="content">
        <p>
          In vielen Wörterbüchern unterstützen Korpusbelege die lexikographische Beschreibung eines Wortes. Dabei ist die Auswahl wirklich passender und hilfreicher Korpusbelege eine nicht zu unterschätzende Herausforderung. Da die Messwerte „Qualität“ und „Angemessenheit“ von Korpusbelegen nicht klar definiert sind, wird unter professionellen Lexikograph*innen im Einzelfall nicht immer ein einstimmiges Urteil darüber erzielt, welcher Beleg am besten in die Beschreibung eines Lemmas passt. Der Einsatz von interaktiven Lernverfahren kann sie dabei unterstützen.
        </p>

        <p>
          Um dies zu ermöglichen, wird im Rahmen dieses Projektes ein System zur Extraktion, Klassifizierung und Bewertung von Korpusbelegen entwickelt und in das lexikalische Informationssystem des DWDS integriert. Die Anwendung wird die tägliche lexikographische Arbeit massiv erleichtern. Sie schlägt für jedes Stichwort eine Reihe von möglichst passenden Beispielen vor, die insgesamt ausreichend vielfältig sind, um die verschiedenen Facetten und Nuancen des Wortgebrauchs zu veranschaulichen. Darüber hinaus wird ein Mehrwert auch für die externen Nutzer des lexikalischen Informationssystems erzielt, da auch für Wörter, die noch nicht vollständig lexikalisch behandelt wurden, gute Korpusbelege extrahiert und im jeweiligen Wörterbuchartikel angezeigt werden.
        </p>

        <p>
          Es ist zu erwarten, dass diese Anwendung auch für andere Wörterbuchprojekte hilfreich sein wird, da das System sprachunabhängig arbeitet und einfach in existierende und zukünftige korpusbasierte lexikographische Arbeitsplätze und Informationssysteme zu integrieren ist.
        </p>
      </div>

      <h2 class="subtitle is-5">Mitarbeiter</h2>
      <div class="content">
        <ul>
          <li>
            <a target="_blank" href="https://web.archive.org/web/20201025172725/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/geyken-alexander">
              PD. Dr. Alexander Geyken
            </a>
            (Projektleiter, BBAW)
          </li>
          <li>
            <a target="_blank" href="https://web.archive.org/web/20201207164444/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/hamster-ulf">
              Ulf Hamster 
            </a>
            (Wissenschaftlicher Mitarbeiter, BBAW)
          </li>
          <li>
            <a target="_blank" href="https://web.archive.org/web/20201022100203/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/staff_ukp/detailseite_mitarbeiter_1_42880.en.jsp">
              Ji-Ung Lee 
            </a>
            (Wissenschaftlicher Mitarbeiter, UKP)
          </li>
        </ul>
      </div>

      <h2 class="subtitle is-5">Projektpartner</h2>

      <nav class="columns is-vcentered">
        <a target="_blank" href="https://www.informatik.tu-darmstadt.de/ukp"
           class="column has-text-centered">
          <!-- <p class="title is-6"></p>
          <p class="subtitle is-6">Ubiquitous Knowledge Processing (UKP) Lab</p> -->
          <figure>
            <img style="width: 256px;" 
              src="https://www.informatik.tu-darmstadt.de/media/ukp/logo/ukp_logo_182x0.png"
              alt="Ubiquitous Knowledge Processing (UKP) Lab, Techische Universität Darmstadt">
          </figure>
        </a>

        <a target="_blank" href="https://www.dfg.de/"
           class="column has-text-centered">
          <!-- <p class="title is-6">Deutsche Forschungsgemeinschaft (DFG)</p> -->
          <figure>
            <img style="width: 256px;" 
              src="https://www.dfg.de/includes/images/layout/dfg_logo_schriftzug.svg"
              alt="Deutsche Forschungsgemeinschaft (DFG)">
          </figure>
        </a>

        <a target="_blank" href="https://www.bbaw.de/" 
           class="column has-text-centered">
          <!-- <p class="title is-6">Techische Universität Darmstadt</p>
          <p class="subtitle is-6">Ubiquitous Knowledge Processing (UKP) Lab</p> -->
          <figure>
            <img style="width: 256px;" 
              src="https://www.bbaw.de/typo3conf/ext/bbaw/Resources/Public/Images/Berlin-Brandenburgische_Akademie_der_Wissenschaften.svg"
              alt="Berlin-Brandenburg Academy of Sciences and Humanities (BBAW)">
          </figure>
        </a>
      </nav>

      <h2 class="subtitle is-5">Weitere Informationen</h2>
      <div class="content">
        <ul>
          <li>
            <a target="_blank" href="https://web.archive.org/web/20201207165047/https://gepris.dfg.de/gepris/projekt/433249742?context=projekt&task=showDetail&id=433249742">
              GEPRIS, Projektnummer 433249742
            </a>
          </li>
          <li>
            <a target="_blank" href="https://web.archive.org/web/20201207164749/https://www.informatik.tu-darmstadt.de/ukp/research_6/current_projects/ukp_evidence/ukp_project_evidence.en.jsp">
              Projekt-Webseite des UKP
            </a>
          </li>
        </ul>
      </div>

      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";


export default {
  name: "About",

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('header.about');
    });

    return { t }
  }
}
</script>


<style scoped>
/* .column {
  display: flex;
} */
</style>