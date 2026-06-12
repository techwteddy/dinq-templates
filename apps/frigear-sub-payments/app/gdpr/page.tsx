"use client";
import AnimateHeroLogo from "@/components/ui/AnimateHeroLogo/AnimateHeroLogo";
import React from "react";

const GDPRPage = () => {
    const sectionStyle =
        "w-full max-w-3xl m-auto my-8 border border-zinc-700 rounded-md p-5";
    const headingStyle = "text-2xl font-medium mb-2";
    const textStyle = "text-zinc-300 whitespace-pre-line";
    return (
        <div>
            <AnimateHeroLogo />
            <div className="px-4 py-10">
                <div className={sectionStyle}>
                    <h2 className={headingStyle}>Privatlivspolitik</h2>
                    <p className={textStyle}>
                        Frigear tager dit privatliv alvorligt. Denne politik forklarer, hvordan vi håndterer dine personoplysninger.
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>1. Hvem er vi?</h2>
                    <p className={textStyle}>
                        Foreningen Frigear
                        {"\n"}Email: kontakt@frigear.nu
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>2. Hvilke data indsamler vi?</h2>
                    <p className={textStyle}>
                        Vi indsamler følgende oplysninger:
                        {"\n"}- Navn
                        {"\n"}- Adresse
                        {"\n"}- Email
                        {"\n"}- Telefonnummer
                        {"\n"}- Betalingsoplysninger (ved kontingentbetaling)
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>3. Hvordan bruger vi dine data?</h2>
                    <p className={textStyle}>
                        - Til medlemsadministration
                        {"\n"}- Til nyhedsbreve (hvis du har givet samtykke)
                        {"\n"}- Til planlægning af og invitationer til events
                        {"\n"}- Til opkrævning af kontingent
                        {"\n"}- Til overholdelse af juridiske forpligtelser
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>4. Deling af dine oplysninger</h2>
                    <p className={textStyle}>
                        Vi deler ikke dine oplysninger med tredjeparter uden dit samtykke, medmindre det er lovpligtigt eller nødvendigt for regnskabsføring.
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>5. Opbevaring og sletning af data</h2>
                    <p className={textStyle}>
                        Vi opbevarer dine oplysninger, så længe det er nødvendigt for ovenstående formål.
                        {"\n"}Når du ikke længere er medlem, slettes dine oplysninger efter 12 måneder, medmindre vi er forpligtet til at gemme dem længere.
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>6. Dine rettigheder</h2>
                    <p className={textStyle}>
                        Du har ret til at:
                        {"\n"}- Anmode om indsigt i dine data
                        {"\n"}- Få rettet eller slettet dine oplysninger
                        {"\n"}- Begrænse behandlingen af dine data
                        {"\n"}- Trække dit samtykke tilbage
                        {"\n"}- Klage til Datatilsynet
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>7. Cookies og sociale medier</h2>
                    <p className={textStyle}>
                        Vær opmærksom på, at Facebook og andre sociale medier kan indsamle data om dig, når du besøger vores side, i henhold til deres egne privatlivspolitikker.
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>8. Kontakt os</h2>
                    <p className={textStyle}>
                        Hvis du har spørgsmål, kan du kontakte os på kontakt@frigear.nu.
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>9. Juridisk grundlag</h2>
                    <p className={textStyle}>
                        Behandlingen af dine personoplysninger sker på baggrund af:
                        {"\n"}- Dit samtykke (GDPR artikel 6, stk. 1, litra a)
                        {"\n"}- Nødvendighed for at opfylde en kontrakt (GDPR artikel 6, stk. 1, litra b)
                        {"\n"}- Juridiske forpligtelser (GDPR artikel 6, stk. 1, litra c)
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>10. Ændringer i privatlivspolitikken</h2>
                    <p className={textStyle}>
                        Vi forbeholder os retten til at opdatere denne privatlivspolitik løbende. Væsentlige ændringer vil blive meddelt via vores hjemmeside.
                    </p>
                </div>

                <div className={sectionStyle}>
                    <h2 className={headingStyle}>Sidst opdateret</h2>
                    <p className="text-sm text-zinc-400">Februar 2025</p>
                </div>
            </div>
        </div>
    )
}

export default GDPRPage;
