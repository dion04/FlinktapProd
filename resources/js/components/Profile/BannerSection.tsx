import React from 'react';

interface BannerSectionProps {
    bannerUrl?: string;
}

const BannerSection: React.FC<BannerSectionProps> = ({ bannerUrl }) => {
    // Use placeholder image if no banner uploaded
    const src = bannerUrl || 'https://interreg-danube.eu/build/assets/default-banner-CkCxyCKr.svg';

    return (
        <div className="h-40 w-full overflow-hidden sm:h-40">
            <img src={src} alt="Profile Banner" className="h-full w-full object-cover" />
        </div>
    );
};

export default BannerSection;
