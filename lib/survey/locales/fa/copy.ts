import {
  FINAL_QUESTION_MAX_LENGTH,
  FINAL_QUESTION_MIN_LENGTH,
} from "@/lib/survey-events";
import type { LocaleCopy } from "@/lib/survey/types";

export const FA_OTHER_OPTION = "سایر";

export const FA_COPY: LocaleCopy = {
  hero: {
    badge: "برای صاحبان فروشگاه آنلاین",
    title: "به ما کمک کنید بهترین پلتفرم مدیریت فروش آنلاین را بسازیم",
    subtitle:
      "این پرسشنامه کمتر از ۵ دقیقه زمان می‌برد. جریان کاری خود را به اشتراک بگذارید و نام دقیق اینستاگرامتان را وارد کنید تا برای دسترسی زودهنگام با شما تماس بگیریم.",
    cta: "شروع پرسشنامه",
    continueCta: "ادامه پرسشنامه",
    startFresh: "شروع دوباره",
  },
  success: {
    title: "از وقتی که برای تکمیل پرسشنامه گذاشتید سپاسگزاریم!",
    description:
      "بازخورد شما ثبت شد. اگر نام کاربری اینستاگرام خود را وارد کرده‌اید، هنگام باز شدن دسترسی زودهنگام از طریق همان حساب با شما تماس می‌گیریم.",
    backLink: "بازگشت به صفحه اصلی",
  },
  restore: {
    title: "پرسشنامه قبلی را ادامه می‌دهید؟",
    description: "می‌خواهید از همان جایی که متوقف شده بودید ادامه دهید؟",
    continue: "ادامه",
    startFresh: "شروع تازه",
  },
  survey: {
    brandLabel: "Questionate",
    headerTitle: "به ما در درک جریان کاری کسب‌وکار شما کمک کنید",
    headerSubtitle:
      "پاسخ‌های شما به‌صورت خودکار ذخیره می‌شود — هر زمان صفحه را رفرش کنید و از همان‌جا ادامه دهید.",
    instagramLabel: "نام دقیق کاربری اینستاگرام شما",
    instagramHelper:
      "نام دقیق اینستاگرام خود را وارد کنید تا برای دسترسی زودهنگام آینده با شما تماس بگیریم. فاصله نگذارید — دقیقاً همان‌طور که در اینستاگرام نمایش داده می‌شود بنویسید.",
    instagramPlaceholder: "مثلاً @sarasboutique",
    submitLabel: "ارسال پرسشنامه",
    submittingLabel: "در حال ارسال…",
    incompleteHint: "برای ارسال، همه سؤالات الزامی را تکمیل کنید.",
  },
  validation: {
    selectOption: "لطفاً یک گزینه را انتخاب کنید",
    describeAnswer: "لطفاً پاسخ خود را توضیح دهید",
    requiredText: "پر کردن این فیلد الزامی است",
    instagramUsername: "لطفاً نام دقیق کاربری اینستاگرام خود را وارد کنید",
    invalidInstagramUsername:
      "نام کاربری اینستاگرام معتبر وارد کنید (فقط حروف انگلیسی، اعداد، . و _)",
    maxTwoSelections: "حداکثر ۲ گزینه انتخاب کنید",
    maxThreeSelections: "حداکثر ۳ گزینه انتخاب کنید",
    finalMinLength: (min) => `لطفاً حداقل ${min} کاراکتر بنویسید`,
    finalMaxLength: (max) => `لطفاً پاسخ را کمتر از ${max} کاراکتر نگه دارید`,
  },
};

export const FA_VALIDATION_LIMITS = {
  finalMinLength: FINAL_QUESTION_MIN_LENGTH,
  finalMaxLength: FINAL_QUESTION_MAX_LENGTH,
} as const;

/** Phase 3 will replace these placeholders with final Persian question text/options. */
export const FA_CONTENT_STATUS = {
  uiCopy: "ready",
  questions: "pending-translation",
} as const;
