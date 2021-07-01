<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="privacy">
    <div class="container">
      <!-- put the following into components ... -->

      <h1 class="title is-3">{{ t('privacy.title') }}</h1>
      <p></p>

      <h2 class="subtitle is-5">Name und Kontaktdaten der Körperschaft sowie des betrieblichen Datenschutzbeauftragten</h2>
      <div class="content">
        <p>
            Berlin-Brandenburgische Akademie der Wissenschaften (BBAW) <br>
            Jägerstraße 22/23 <br>
            10117 Berlin
            <br>
            Vertreten durch den Präsidenten: <br>
            Prof. Dr. Dr. h. c. mult. Christoph Markschies <br>
            E-Mail: praesident@bbaw.de <br>
            Telefon: +49 (0)30 – 20370-0 <br>
            <br>
            Der Datenschutzbeauftragte der Berlin-Brandenburgischen Akademie der Wissenschaften, Prof. Dr. Matthäus Heil, ist unter der o.g. Anschrift beziehungsweise unter heil@bbaw.de erreichbar.
        </p>
      </div>

      <h2 class="subtitle is-5">Lorem </h2>
      <div class="content">
        <p>ipsum</p>
      </div>

      <h2 class="subtitle is-5">Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck und deren Verwendung</h2>
      <div class="content">
        <p>
        Die Webanwendung, die dazugehörige REST APIs, Datenbanken und Server speichern personenbezogene Daten i.S. des Art. 4 Nr. 1 DSGVO, z.B. Name, Adresse, E-Mailadressen, IP-Adresse.
        </p>
      </div>

      <h3 class="subtitle is-5">Protokolldateien</h3>
      <div class="content">
        <p>
        Bei jedem Zugriff eines Nutzers auf das Internet-Angebot der Berlin-Brandenburgischen Akademie der Wissenschaften und bei jedem Abruf einer Datei werden Daten über diesen Vorgang technisch bedingt vorübergehend in einer Protokolldatei gespeichert und verarbeitet:
        <ul>
          <li>die IP-Adresse (diese wird unmittelbar nach dem Zugriff anonymisiert)</li>
          <li>Datum und Uhrzeit</li>
          <li>aufgerufene Seite/Name der abgerufenen Datei</li>
          <li>übertragene Datenmenge</li>
          <li>Meldung, ob der Zugriff/Abruf erfolgreich war</li>
        </ul>
        </p>
        <p>
        Zweck der Datenerhebung ist der verpflichtende Schutz vor Angriffen des Netzwerks, die Verbesserung des Angebots sowie die Erstellung von Nutzungsstatistiken. Diese Daten werden eine Woche gespeichert.
        </p>
        <p>
        Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. b DSGVO (Erforderlichkeit zur Wahrung berechtigter Interessen).
        </p>
      </div>

      <h2 class="subtitle is-5">Cookies</h2>
      <div class="content">
        <p>
        Nach der erfolgreichen Anmeldung des Benutzer sendet die EVIDENCE REST API einen Access Token mit einer zeitlich begrenzten Gültigkeit (OAuth 2.0) an die EVIDENCE Webanwendung der in einem Cookie gespeichert wird. 
        Diese temporäre Cookies beinhalten keine personenbezogenen Daten.
        </p>
      </div>

      <h2 class="subtitle is-5">E-Mail und Passwort</h2>
      <div class="content">
        <p>
        Zwecks Authentfizierung wird die E-Mail und Zugangspasswort eines Benutzers in einer seperaten Authentfizierungsdatenbank gespeichert.
        Zwecks E-Mail-Bestätigung und Passwortwiederherstellung werden automatische E-Mails an den Benutzer gesendet.
        <br>
        Im Falle einer Löschungsanfrage nach Art. 17 DSGVO werden E-Email und Passwort des Benutzers dauerhaft und unwiderruflich aus der Authentfizierungsdatenbank gelöscht.
        </p>
      </div>

      <h2 class="subtitle is-5">Anmeldung via Google OAuth 2.0 Client ID</h2>
      <div class="content">
        <p>
        Die EVIDENCE App bietet optional die Anmeldung über einen "Google Button" an wodurch die Google-ID und Google E-Mail eines Benutzers in der EVIDENCE Authentfizierungsdatenbank gespeichert wird.
        <br>
        Im Falle einer Löschungsanfrage nach Art. 17 DSGVO werden Google ID und E-Email  des Benutzers dauerhaft und unwiderruflich aus der Authentfizierungsdatenbank gelöscht.
        <br>
        Es sei nochmals ausdrücklich darauf hingewiesen, dass sich nur um ein alternatives Anmeldungeverfahren für die EVIDENCE App handelt.
        <br>
        Die Benutzer, die dieses Anmeldeverfahren benutzen haben müssen in der Vergangenheit sich bereits ein Google-Konto eingerichtet haben und dabei den <a href="https://policies.google.com/privacy">Datenschutzbestimmungen der Firma Google</a> und den <a href="https://policies.google.com/terms">Nutzungsbedingungen der Fa. Google</a> zugestimmt haben. 
        Der Betreiber der EVIDENCE App übernimmt keine Haftung oder Gewähr für das Google-Konto des Benutzers. 
        </p>
      </div>

      <h2 class="subtitle is-5">Identifier eines Benutzer und Pseudonymisierung</h2>
      <div class="content">
        <p>
        Jeder Benutzer bekommt einen Identifier zugeordet, einen Universally Unique Identifier (UUID) in der Version 4, was eine pseudozufällig generierte 128-bit Zahl darstellt.
        <br>
        In der Authentifizierungsdatenbank ist die UUID eines Benutzers mit direkt personenbezogenen Daten (z.B. Email, Passwort) assoziiert, und wird als Pseudonym i.S. des Art. 4 Nr. 5 DSGVO in der Applikationsdatenbank mit Annotationen assoziiert (z.B. Rankingbewertungen durch einen Benutzer), 
        wenn der Benutzer der <a href="consent">Informierten Einwilligung</a> zugestimmt hat.
        <br>
        Im Falle einer Löschungsanfrage nach Art. 17 DSGVO werden alle Daten eines Benutzer aus der Authentifizierungsdatenbank gelöscht. Die UUIDs in Applikationsdatenbank können dann nicht mehr eindeutig einer spezifischen Person zugeordnet werden, d.h. es handelt sich um eine Pseudonymisierung i.S. des Art. 4 Nr. 5 DSGVO.
        <br>
        Die UUID Identifier in der Applikationsdatenbank sind Teil späterer Datenpublikationen falls der Benutzer der <a href="consent">Informierten Einwilligung</a> zugestimmt hat.
        </p>
      </div>

      <h2 class="subtitle is-5">Weitergabe von Daten an Dritte</h2>
      <div class="content">
        <p>
        Eine Übermittlung der direkt personenbezogene Daten an Dritte findet nur im Rahmen der gennanten Zwecke statt (z.B. Bestätigungslink via E-Mail versenden).
        Das EVIDENCE System ein KI-basiertes Empfehlungssystem (Recommender System), d.h. die pseudonymisierten Daten explizit für Profiling eingesetzt sind auch für eine Datenpublikation vorgesehen (Siehe Informierte Einwilligun). 
        </p>
      </div>

      <h2 class="subtitle is-5">Betroffenenrechte</h2>
      <div class="content">
        <p>
        Sie haben uns gegenüber hinsichtlich der Sie betreffenden personenbezogenen Daten die nachfolgenden Rechte:
        <ul>
        <li>gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen;</li>
        <li>gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;</li>
        <li>gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen (außer in den in Art. 17 Abs. 3 DSGVO genannten Fällen)</li>
        <li>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung eingelegt haben</li>
        <li>gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes oder unseres Standorts wenden.</li>
        </ul>

        Widerspruchsrecht:
        Da Ihre personenbezogenen Daten auf Grundlage von berechtigten Interessen gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO verarbeitet werden, haben Sie das Recht, gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen, soweit dafür Gründe vorliegen, die sich aus Ihrer besonderen Situation ergeben.
        </p>
      </div>
      

      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";


export default {
  name: "Privacy Policy",

  components: {
    TheNavbar
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('privacy.title');
    });

    return { t }
  }
}
</script>

