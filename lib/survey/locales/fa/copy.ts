import {
  FINAL_QUESTION_MAX_LENGTH,
  FINAL_QUESTION_MIN_LENGTH,
} from "@/lib/survey-events";
import type { LocaleCopy } from "@/lib/survey/types";

export const FA_OTHER_OPTION = "سایر";

const faNumber = (value: number) => value.toLocaleString("fa-IR");

export const FA_COPY: LocaleCopy = {
  hero: {
    badge: "ویژهٔ صاحبان فروشگاه آنلاین",
    title: "در ساخت بهترین پلتفرم مدیریت فروش آنلاین با ما همراه باشید",
    subtitle:
      "تکمیل این پرسشنامه کمتر از ۵ دقیقه زمان می‌برد. لطفاً جریان کاری خود را شرح دهید و نام کاربری دقیق اینستاگرام خود را وارد کنید تا بتوانیم برای دسترسی زودهنگام با شما تماس بگیریم.",
    autosaveNote:
      "پیشرفت شما به‌صورت خودکار ذخیره می‌شود. هر زمان صفحه را بازخوانی کنید؛ پاسخ‌های شما همچنان در دسترس خواهند بود.",
    cta: "شروع پرسشنامه",
    continueCta: "ادامهٔ پرسشنامه",
    startFresh: "شروع مجدد",
    startFreshPrompt:
      "آیا مایلید پاسخ‌های ذخیره‌شده را پاک کرده و از ابتدا شروع کنید؟",
    sidebar: {
      tagline: "",
      title: "پرسشنامه بررسی مشکلات فروشگاه‌های آنلاین",
      body: "پاسخ‌های دقیق شما به ما کمک خواهد کرد تا نرم‌افزاری بسازیم که اکثر مشکلات شما عزیزان را حل کند و فروش و زمان شما را تا حد ممکن بهینه کند. پس در این فرآیند جذاب همراه ما باشید.",
    },
  },
  success: {
    title: "از وقتی که برای تکمیل پرسشنامه اختصاص دادید سپاسگزاریم.",
    description:
      "بازخورد شما ثبت شد. در صورت وارد کردن نام کاربری اینستاگرام، هنگام فراهم شدن دسترسی زودهنگام از طریق همان حساب با شما تماس خواهیم گرفت.",
    backLink: "بازگشت به صفحهٔ اصلی",
  },
  restore: {
    title: "ادامهٔ پرسشنامهٔ قبلی",
    description: "آیا مایلید از همان مرحله‌ای که متوقف شده بودید ادامه دهید؟",
    continue: "ادامه",
    startFresh: "شروع مجدد",
    cancel: "انصراف",
  },
  survey: {
    brandLabel: "پرسشنامه",
    headerTitle: "لطفاً در درک جریان کاری کسب‌وکار خود به ما کمک کنید",
    headerSubtitle:
      "پاسخ‌های شما به‌صورت خودکار ذخیره می‌شود. هر زمان صفحه را بازخوانی کنید و از همان نقطه ادامه دهید.",
    instagramLabel: "نام کاربری دقیق اینستاگرام",
    instagramHelper:
      "لطفاً نام کاربری دقیق اینستاگرام خود را وارد کنید تا بتوانیم برای دسترسی زودهنگام با شما تماس بگیریم. از درج فاصله خودداری کنید و دقیقاً همان‌گونه که در اینستاگرام نمایش داده می‌شود بنویسید.",
    instagramPlaceholder: "مثال: @sarasboutique",
    submitLabel: "ارسال پرسشنامه",
    submittingLabel: "در حال ارسال…",
    incompleteHint: "لطفاً برای ارسال، همهٔ سؤالات الزامی را تکمیل کنید.",
    submitErrorTitle: "ارسال انجام نشد",
    otherFieldLabel: (otherOption) =>
      `لطفاً گزینهٔ «${otherOption}» را بیشتر توضیح دهید`,
    otherFieldPlaceholder: "لطفاً مشخص کنید…",
    finalQuestionPlaceholder:
      "لطفاً مسیر کامل سفارش را از اولین تماس مشتری تا زمان ارسال شرح دهید…",
    characterCount: (current, max, min) => {
      const base = `${faNumber(current)} / ${faNumber(max)} (حداکثر)`;
      return min !== undefined && current < min
        ? `${base} — حداقل ${faNumber(min)} کاراکتر`
        : base;
    },
    progress: {
      complete: (percentage) => `${faNumber(percentage)}٪ تکمیل‌شده`,
      questionOf: (current, total) =>
        `سؤال ${faNumber(current)} از ${faNumber(total)}`,
      ariaLabel: (percentage, current, total) =>
        `پیشرفت پرسشنامه: ${faNumber(percentage)} درصد تکمیل‌شده، سؤال ${faNumber(current)} از ${faNumber(total)}`,
    },
  },
  errors: {
    invalidData: "اطلاعات پرسشنامه نامعتبر است. لطفاً پاسخ‌های خود را بررسی کنید.",
    saveFailed: "در ذخیرهٔ پاسخ‌ها خطایی رخ داد. لطفاً دوباره تلاش کنید.",
  },
  validation: {
    selectOption: "لطفاً یک گزینه را انتخاب کنید.",
    describeAnswer: "لطفاً پاسخ خود را توضیح دهید.",
    requiredText: "تکمیل این فیلد الزامی است.",
    instagramUsername: "لطفاً نام کاربری دقیق اینستاگرام خود را وارد کنید.",
    invalidInstagramUsername:
      "لطفاً نام کاربری معتبر اینستاگرام وارد کنید (فقط حروف انگلیسی، اعداد، . و _).",
    maxTwoSelections: "لطفاً حداکثر ۲ گزینه انتخاب کنید.",
    maxThreeSelections: "لطفاً حداکثر ۳ گزینه انتخاب کنید.",
    finalMinLength: (min) => `لطفاً حداقل ${faNumber(min)} کاراکتر بنویسید.`,
    finalMaxLength: (max) => `لطفاً پاسخ را کمتر از ${faNumber(max)} کاراکتر نگه دارید.`,
  },
};

export const FA_VALIDATION_LIMITS = {
  finalMinLength: FINAL_QUESTION_MIN_LENGTH,
  finalMaxLength: FINAL_QUESTION_MAX_LENGTH,
} as const;

/** Persian survey content is ready for the `/fa` route. */
export const FA_CONTENT_STATUS = {
  uiCopy: "ready",
  questions: "ready",
} as const;
