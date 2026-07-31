import { Vazirmatn } from "next/font/google";

/**
 * Persian webfont for `/fa`. Uses Vazirmatn until licensed BYekan files are added
 * under `public/fonts/byekan/` (see Phase 5).
 */
export const persianFont = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-sans",
  display: "swap",
});
