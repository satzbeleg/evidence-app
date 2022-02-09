<template>
  <h1 class="title is-3">Über das EVIDENCE Projekt</h1>
  <p></p>

  <h2 class="subtitle is-5">Motivation</h2>
  <div class="content">
    <p>
      In vielen Wörterbüchern helfen Korpusbelege bei der Beschreibung von einem Wort. Korpusbelege oder Satzbelege sind Beispiele aus anderen Texten. 
      Die Auswahl von Korpusbelegen ist nicht leicht. 
      Es ist schwer zu sagen, wann ein Korpusbeleg „gut“ oder „angemessen“ ist. 
      Die Autoren von Wörterbüchern heißen Lexikographen. 
      Sie wählen die Korpusbeispiele für Wörter aus. 
      Oft sind sie sich uneinig, welches Beispiel das Wort am besten beschreibt.
    </p>
  </div>

  <h2 class="subtitle is-5">Ziele</h2>
  <div class="content">
    <p>
      Lexikographen sollen Hilfe bei der Entscheidung für einen guten Korpusbeleg bekommen. 
      Deshalb entwickeln wir ein Programm, das Korpusbelege raussucht, in Klassen einteilt und bewertet.
      Das Programm soll Teil vom DWDS werden. 
      Es zeigt für jedes Wort eine Gruppe von Beispielen an. Die Beispiele beschreiben das Wort besonders gut. 
      Sie zeigen mehrere Kontexte, in denen das Wort vorkommen kann. 
      Manchmal haben Wörter noch keinen vollständigen Wörterbucheintrag. 
      Das Programm soll trotzdem schon gute Beispiele für diese Wörter anzeigen.
    </p>
  </div>

  <h2 class="subtitle is-5">Vorgehen</h2>
  <div class="content">
    <p>
      Die App ist dazu da, gute und vielfältige Satzbelege zu bewerten. Dafür nutzen wir das Best-Worst-Scaling Verfahren. 
      Die Nutzer sehen vier Satzbelege. Sie wählen den besten und den schlechtesten aus. 
      Daraus entstehen Ranglisten. Also Listen, die zeigen, welches Beispiel die Nutzer gut oder schlecht finden. 
      Das Programm lernt daraus, selbst solche Ranglisten zu erstellen. 
      Es kann dann sagen, welche Satzbelege gut und vielfältig sind. In der Informatik heißt das Überwachtes Lernverfahren. 
      Manchen Nutzern ist wichtiger, dass ein Satzbeleg gut oder vielfältig ist. 
      Das zeigen sie mit Schiebereglern. 
      Sie sollen auch sagen, was genau ihnen bei Vielfalt wichtig ist. 
      Zum Beispiel die Struktur vom Satz, die Bedeutung oder die Quelle. 
      Das merkt sich das Programm und zeigt den Nutzern immer neue passende Satzbelege an. 
      Die werden so lange neu sortiert, bis der Nutzer mit den Satzbelegen zufrieden ist. 
      Die Methode, mit der die Satzbelege neu sortiert werden, heißt Quadratisches Optimierungsverfahren.
    </p>
  </div>

  <h2 class="subtitle is-5">Mitarbeiter</h2>
  <div class="content">
    <ul>
      <li>
        <a href="https://web.archive.org/web/20210422143659/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/head_ukp/index.en.jsp">Prof. Dr. Iryna Gurevych</a>,
        Projektleiterin am Standort Darmstadt
        (Technische Universität Darmstadt, Ubiquitous Knowledge Processing Lab)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201025172725/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/geyken-alexander">PD Dr. Alex Geyken</a>,
        Projektleiter am Standort Berlin
        (Berlin-Brandenburgische Akademie der Wissenschaften, Zentrum Sprache)
      </li>
      <li>
        <a href="https://web.archive.org/web/20210304072438/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/lemnitzer-lothar">Dr. Lothar Lemmnitzer</a>,
        Experte Lexikographie
        (Berlin-Brandenburgische Akademie der Wissenschaften, Zentrum Sprache)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201022100203/https://www.informatik.tu-darmstadt.de/ukp/ukp_home/staff_ukp/detailseite_mitarbeiter_1_42880.en.jsp">Ji-Ung Lee</a>,
        Wissenschaftlicher Mitarbeiter
        (Technische Universität Darmstadt, Ubiquitous Knowledge Processing Lab)
      </li>
      <li>
        <a href="https://web.archive.org/web/20201207164444/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/hamster-ulf">Ulf Hamster</a>,
        Wissenschaftlicher Mitarbeiter, Softwareentwicklung
        (Berlin-Brandenburgische Akademie der Wissenschaften, Zentrum Sprache)
      </li>
    </ul>
  </div>

  <h2 class="subtitle is-5">Projektpartner</h2>
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

  <h2 class="subtitle is-5">Finanzierung</h2>
  <div class="content">
    <p>
      Diese Arbeit wurde von der Deutschen Forschungsgemeinschaft (DFG) gefördert - 433249742. Projektlaufzeit: 2020-2023.
    </p>
    <a href="https://gepris.dfg.de/gepris/projekt/433249742">https://gepris.dfg.de/gepris/projekt/433249742</a>
  </div>

</template>


<script>
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "AboutDELeicht",
  components: {},
  setup(){
    const { t } = useI18n();
    return { t }
  }
});
</script>