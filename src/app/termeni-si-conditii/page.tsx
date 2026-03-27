export const metadata = {
    title: "Termeni și condiții | Eurooptik",
    description:
        "Termenii și condițiile de utilizare ale site-ului Eurooptik.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-sand px-4 py-10 sm:px-8">
        <article className="mx-auto max-w-4xl space-y-8 rounded-3xl bg-white p-6 shadow-xl sm:p-10">
            <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Document legal
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
                Termeni și condiții
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
                Bună ziua! Vă aflați pe pagina de „Termeni și condiții” a site-ului
                www.eurooptik.ro. Vă rugăm să citiți cu atenție informațiile de mai
                jos. Prin accesarea site-ului, vă exprimați acordul asupra
                conținutului acestei secțiuni.
            </p>
            </header>

            <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
                1. Definiții și precizări
            </h2>
            <p className="text-slate-700">
                Deținător site: SC Eurooptik SRL, CIF 8951958, J2015000609041,
                cu sediul principal în Bacău, telefon: 0732 377 377, e-mail:
                office@eurooptik.ro.
            </p>
            <p className="text-slate-700">
                Utilizator: orice persoană care intră pe site-ul www.eurooptik.ro.
            </p>
            </section>

            <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
                2. Proprietate intelectuală
            </h2>
            <p className="text-slate-700">
                Logo-ul și însemnele grafice, mărcile, denumirea site-ului și a
                companiei sunt proprietatea SC Eurooptik SRL și nu pot fi utilizate
                fără acordul scris al proprietarului.
            </p>
            <p className="text-slate-700">
                Informațiile de pe www.eurooptik.ro nu pot fi folosite în scop
                comercial fără acordul scris al deținătorului site-ului. Informația
                medicală poate fi redistribuită doar cu menționarea sursei.
            </p>
            <p className="text-slate-700">
                Prin informație se înțelege orice element de pe site: articole,
                descrieri servicii, descrieri aparatură, fotografii, videoclipuri
                etc.
            </p>
            <p className="text-slate-700">
                Orice modificare neautorizată a site-ului este strict interzisă și
                poate fi sancționată conform legii.
            </p>
            </section>

            <section className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">2.1 Alte specificații</h3>
            <p className="text-slate-700">
                SC Eurooptik SRL este deținătorul tuturor drepturilor intelectuale
                asupra designului, imaginilor și funcționalităților site-ului.
            </p>
            <p className="text-slate-700">
                SC Eurooptik SRL nu poate fi făcută responsabilă pentru prejudicii
                create de informații publicate din erori care nu îi aparțin,
                imposibilitatea accesării website-ului sau prezența unor componente
                vătămătoare pe serverele de găzduire.
            </p>
            <p className="text-slate-700">
                SC Eurooptik SRL își rezervă dreptul de a modifica informațiile de
                pe site fără notificare prealabilă.
            </p>
            <p className="text-slate-700">
                Prețurile și serviciile afișate pe site sunt informative și pot
                suferi modificări fără notificare. Pentru detalii complete, vă
                rugăm să ne contactați telefonic sau prin e-mail.
            </p>
            </section>

            <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">3. Confidențialitate</h2>
            <p className="text-slate-700">
                Nicio informație transmisă între utilizator și deținător nu poate fi
                făcută publică fără acordul scris al uneia dintre părți.
            </p>
            <p className="text-slate-700">
                SC Eurooptik SRL poate contacta vizitatorul care completează
                formulare de contact/programare și solicită informații.
            </p>
            <p className="text-slate-700">
                Datele cu caracter personal pot fi folosite în scopuri comerciale
                (newsletter, oferte) doar cu acordul utilizatorului.
            </p>
            <p className="text-slate-700">
                Pentru detalii suplimentare, consultați pagina Politica de
                confidențialitate.
            </p>
            </section>

            <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">4. Cookies</h2>
            <p className="text-slate-700">
                Acest site folosește cookies. Pentru mai multe detalii, vă rugăm să
                consultați Politica de confidențialitate.
            </p>
            </section>

            <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
                5. Comunicări, altele decât cele comerciale
            </h2>
            <p className="text-slate-700">
                SC Eurooptik SRL își rezervă dreptul de a utiliza testimonialele sau
                mesajele primite de la utilizatori în scopul îmbunătățirii
                serviciilor, fără divulgarea datelor personale.
            </p>
            </section>

            <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Link-uri utile ANPC</p>
            <a
                href="https://reclamatiisal.anpc.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
                https://reclamatiisal.anpc.ro/
            </a>
            <a
                href="https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home2.show&lng=RO"
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
                https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home2.show&lng=RO
            </a>
            </section>
        </article>
        </main>
    );
}
