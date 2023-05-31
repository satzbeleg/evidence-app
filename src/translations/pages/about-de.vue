<template>
  <h1 class="title is-3">Über das EVIDENCE Projekt</h1>
  <p></p>

  <h2 class="subtitle is-5">Motivation</h2>
  <div class="content">
    <p>
      In vielen Wörterbüchern unterstützen Korpusbelege die lexikographische Beschreibung eines Wortes. 
      Die Auswahl passender und hilfreicher Korpusbelege stellt eine Herausforderung dar, weil die Operationalisierung von Kriterien wie bspw. „Qualität“ und „Angemessenheit“ von Korpusbelegen in Messgrößen nicht trivial ist und professionelle Lexikograph*innen im Einzelfall nicht immer ein einstimmiges Urteil darüber erzielen, welcher Beleg am besten in die Beschreibung eines Lemmas passt.
    </p>
  </div>

  <h2 class="subtitle is-5">Ziele</h2>
  <div class="content">
    <p>
      Um Lexikograph*innen in ihrem Entscheidungsprozess zu unterstützen, soll ein System zur Extraktion, Klassifizierung und Bewertung von Korpusbelegen entwickelt und in das lexikalische Informationssystem des DWDS integriert werden. 
      Das Empfehlungssystem schlägt für jedes Lemma eine Gruppe von Satzbelegen vor, die jeweils als hochwertig angesehene werden und zusammen eine hohe Vielfalt und Facetten und Nuancen des Wortgebrauchs aufweisen. 
      Das Empfehlungssystem soll so weit entwickelt werden, dass die externen Nutzer*innen des lexikalischen Informationssystems auch für noch nicht vollständig lexikalisch behandelte Lemmata ausreichend gute Korpusbelege vorgeschlagen bekommen.
    </p>
  </div>

  <h2 class="subtitle is-5">Methodik</h2>
  <div class="content">
    <p>
      Die Applikation dient vor allem zur Beurteilung hinsichtlich der Güte und Vielfalt der Satzbelege.
      Zur Bewertung der Güte wird das Best-Worst-Scaling Verfahren eingesetzt. 
      Den Annotator*innen werden vier Satzbelege angezeigt, von denen sie den besten und den schlechtesten Satzbeleg auswählen. 
      Die resultierenden Ranglisten werden als Zielvariablen in einem Überwachten Lernverfahren eingesetzt. 
      Zur Bewertung der Vielfalt von Satzbelegen für ein bestimmtes Lemma müssen Benutzer*innen anhand von Schiebereglern angeben, inwiefern sie Güte gegenüber Vielfalt abwägen und welche Arten von Vielfalt präferiert werden (z.B. unterschiedliche Satzstrukturen, Semantik, Quellenhinweise). 
      Mit einem Quadratischen Optimierungsverfahren werden anhand dieser Parameter die angezeigten Satzbelege neusortiert, bis der*die Benutzer*in mit der angezeigten Auswahl zufrieden ist.
    </p>
  </div>

  <h2 class="subtitle is-5">Mitarbeiter*innen</h2>
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
        <a href="https://web.archive.org/web/20210304072438/https://www.bbaw.de/die-akademie/mitarbeiterinnen-mitarbeiter/lemnitzer-lothar">Dr. Lothar Lemnitzer</a>,
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
    <p>Diese Arbeit wurde von der Deutschen Forschungsgemeinschaft (DFG) gefördert - 433249742. Projektlaufzeit: 2020-2023.</p>
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