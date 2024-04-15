import chrome from "~/assets/icons/chrome.png";
import react from "~/assets/icons/react.png";
import typescript from "~/assets/icons/typescript.png";
import electron from "~/assets/icons/electron.png";
import nodejs from "~/assets/icons/nodejs.png";
import webpack from "~/assets/icons/webpack.png";
import license from "~/assets/icons/license.png";

import bookordCircle from "~/assets/icons/brand/bookord-circle.svg";
import bookordSquare from "~/assets/icons/brand/bookord-square.svg";
import bookordStandalone from "~/assets/icons/brand/bookord-standalone.svg";
import bookordLogo from "~/assets/icons/brand/bookord-logo.svg";
import bookordLogoStandalone from "~/assets/icons/brand/bookord-logo-standalone.svg";

export const icons = {
    chrome,
    react,
    typescript,
    electron,
    nodejs,
    webpack,
    license,
    bookordCircle,
    bookordSquare,
    bookordStandalone,
    bookordLogo,
    bookordLogoStandalone,
};

export type Icon = keyof typeof icons;
