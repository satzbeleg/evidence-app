<template>
  <h1 class="title is-3">Informierte Einwilligung zur Datenspende</h1>
  <div class="content">
    <p>
      In der EVIDENCE App werden Sie gefragt, Satzbelege zu einem gegebenen Lemma zu bewerten. 
      Um die Daten zu sammeln und weiter auswerten zu können, benötigen wir Ihre Einwilligung. 
      Im Folgenden klären wir Sie darüber auf, welche Informationen zu welchem Zweck in der EVIDENCE App gesammelt werden.
    </p>
  </div>

  <h2 class="subtitle is-4">Kontakt</h2>
  <div class="content">
    <p>
      Berlin-Brandenburgische Akademie der Wissenschaften <br>
      - Projekt EVIDENCE - <br>
      Jägerstraße 22/23 <br>
      10117 Berlin
    </p>
    <p>
      Projektleiter am Standort Berlin: Dr. Alexander Geyken 
      <br>
      E-Mail: evidence ät bbaw dot de
    </p>
  </div>

  <h2 class="subtitle is-4">Ziel der App</h2>
  <div class="content">
    <p>
      Der Hauptzweck der App ist es von einer großen Anzahl von Benutzer Textbelege (z.B. Satzbelege, kurze Absätze)
      miteinander vergleichen zu lassen, und diese benutzerspezfischen Vergleiche, Rankings bzw. Evaluationen (im folgenden 'Evaluationsdaten') 
        in einem zentralen Datensatz dauerhaft zu speichern und öffentlich zugänglich zu machen.
      <!-- Benutzerschnittstellendaten die direkt mit der Generierung der Evaluationsdaten einhergingen, z.B. Zeiten zwischen  -->
      In der App kommen maschinelle Lernverfahren zum Einsatz, die benutzerspezifisch in der App trainiert werden und die daraus resulierenden benutzerspezfischen Modellparameter (im folgenden 'Modelldaten') 
        werden ebenfalls zentral in einem zentralen Datensatz gesammelt und veröffentlicht.
      In der App werden individuelle Angaben über den Benutzer abgefragt, 
        z.B. Alter, Geschlecht, Bildungsniveau, Dialektraum, Herkunftsland, Erstsprachen, Zweitsprachen, Sprachniveau, u.a.
        (im folgenden 'demographische Daten'), 
        die ebenso zentral in einem zentralen Datensatz gesammelt und veröffentlicht werden.
    </p>
  </div>

  <h2 class="subtitle is-4">Pseudonymisierung</h2>
  <div class="content">
    Jedes Benutzerkonto ist mit einer zufälligen Universally Unique Identifier (UUID) assoziiert, 
      die als Pseuodnym i.S. Art. 4 Nr. 5 DSGVO, 
      im zentralen Datensatz mit den <i>Evaluationsdaten, Modelldaten und demographische Daten</i> gesammelt und veröffentlicht werden.
    <br>
    Die <i>demographischen Daten</i> werden aber nur in einem Detailierheitsgrad veröffentlicht,
      der sicherstellt, dass mindestens 10 Benutzer eine bestimmte Kombination von veröffentlichen demographischen Merkmalen aufweist.
      Beispiel: Die Kombination <code>(Alter=30 bis 40, Erstsprache=Spanisch, Sprachniveau=C1)</code> muss mindestens 10 unterschiedlichen Benutzer aufweisen. 
      Wenn dies nicht der Fall ist müssen Merkmalsausprägungen gröber gewählt werden, z.B. <code>Alter=18 bis 60</code>,
      oder Merkmale komplett weggelassen werden, um die Mindestanzahl von 10 Benutzer zu erreichen.
  </div>

  <h2 class="subtitle is-4">Löschung der gesammelten Evaluationsdaten, Modelldaten und demographische Daten</h2>
  <div class="content">
    <p>
      Die nachträgliche <i>Evaluationsdaten, Modelldaten und demographische Daten</i> sind von der Löschung hiermit explizit ausgeschlossen,
      wenn die Benutzer die <i>Evaluationsdaten, Modelldaten und demographische Daten</i> mit einer CC0-Lizenz an die Datenbankserver übermittelt hat.
      <br>
      <i>Evaluationsdaten, Modelldaten und demographische Daten</i> ohne CC0-Lizenz werden von der App nicht an die Datenbankserver übertragen, 
      d.h. eine Löschanfrage ist nicht notwendig, weil die <i>Evaluationsdaten, Modelldaten und demographische Daten</i> nicht auf Servern gespeichert wurden.
    </p>
  </div>

  <h2 class="subtitle is-4">Verwendung der Evaluationsdaten, Modelldaten und demographische Daten</h2>
  <div class="content">
    <p>
      Die Evaluationsdaten, Modelldaten und demographische Daten werden zum 
      a) Training und Evaluierung Modellen aus dem Bereich des maschinellen Lernens und künstlichen Intelligenz verwendet,
      und auch b) für qualitativen Analysen, was Detailbetrachtungen mit einschließt.
    </p>
  </div>

  <h2 class="subtitle is-4">Weitergabe der Evaluationsdaten, Modelldaten und demographische Daten an Dritte</h2>
  <div class="content">
    <p>
      Die Evaluationsdaten, Modelldaten und demographische Daten werden im Internet veröffentlicht.
    </p>
  </div>

</template>


<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConsentDE",
  components: {},
  setup(){}
});
</script>