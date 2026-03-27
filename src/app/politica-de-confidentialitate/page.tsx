export const metadata = {
    title: "Politica de confidențialitate | Eurooptik",
    description:
        "Informații despre prelucrarea datelor cu caracter personal pe site-ul Eurooptik.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-sand px-4 py-10 sm:px-8">
        <article className="mx-auto max-w-4xl space-y-8 rounded-3xl bg-white p-6 shadow-xl sm:p-10">
            <header className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Document legal
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                    Politica de confidențialitate
                </h1>
                <p className="text-sm leading-relaxed text-slate-600">
                    Această politică descrie modul în care SC Eurooptik SRL colectează,
                    utilizează și protejează datele cu caracter personal ale
                    utilizatorilor site-ului www.eurooptik.ro.
                </p>
            </header>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">1. Operatorul de date</h2>
                <p className="text-slate-700">
                    Operator: SC Eurooptik SRL, CIF 8951958, J2015000609041,
                    Bacău, e-mail: office@eurooptik.ro, telefon: 0732 377 377.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">2. Date colectate</h2>
                <p className="text-slate-700">
                    Putem colecta date transmise voluntar prin formulare de contact sau
                    programare: nume, număr de telefon, e-mail și informații relevante
                    pentru solicitare.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">3. Scopul prelucrării</h2>
                <ul className="list-disc space-y-2 pl-6 text-slate-700">
                    <li>gestionarea programărilor și solicitărilor;</li>
                    <li>comunicare cu utilizatorii privind serviciile solicitate;</li>
                    <li>îmbunătățirea serviciilor și a experienței pe site;</li>
                    <li>transmiterea de informări comerciale doar cu consimțământ.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">4. Temeiul legal</h2>
                <p className="text-slate-700">
                    Datele sunt prelucrate în baza consimțământului utilizatorului,
                    executării unei solicitări precontractuale și/sau a obligațiilor
                    legale aplicabile.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">5. Stocare și securitate</h2>
                <p className="text-slate-700">
                    Datele sunt păstrate pe perioada necesară îndeplinirii scopurilor
                    menționate și sunt protejate prin măsuri tehnice și organizatorice
                    adecvate.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">6. Drepturile utilizatorilor</h2>
                <p className="text-slate-700">
                    Utilizatorii au dreptul de acces, rectificare, ștergere,
                    restricționare, opoziție, portabilitate și dreptul de a retrage
                    consimțământul, conform legislației în vigoare.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">7. Cookies</h2>
                <p className="text-slate-700">
                    Site-ul poate folosi module cookie pentru funcționalitate și
                    analiză. Prin continuarea navigării vă exprimați acordul pentru
                    utilizarea cookie-urilor, conform setărilor browserului.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">8. Contact</h2>
                <p className="text-slate-700">
                    Pentru întrebări privind prelucrarea datelor, ne puteți contacta la
                    office@eurooptik.ro.
                </p>
            </section>
        </article>
        </main>
    );
}
