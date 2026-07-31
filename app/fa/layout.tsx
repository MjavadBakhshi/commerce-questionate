import type { Metadata } from "next";
import { persianFont } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "پرسشنامه صاحبان فروشگاه آنلاین",
  description:
    "به ما کمک کنید بزرگ‌ترین چالش‌های فروش آنلاین را بفهمیم تا نرم‌افزار بهتری بسازیم.",
};

export default function PersianLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${persianFont.variable} min-h-full font-sans`}
    >
      {children}
    </div>
  );
}
