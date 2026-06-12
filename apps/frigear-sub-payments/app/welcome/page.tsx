"use client";
import React from "react";
import AnimateHeroLogo from "@/components/ui/AnimateHeroLogo/AnimateHeroLogo";
import InfoCard from "@/components/ui/Info/infoCard";

const WelcomePage = () => {
    return (
        <div>
            <>
                <div>
                    <AnimateHeroLogo />
                    <InfoCard
                        title="Check din email!"
                        description="Du er der næsten, check din email for at bekræfte din konto."
                    />
                </div>
            </>
        </div>
    );
};

export default WelcomePage;
