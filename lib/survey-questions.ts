import { OTHER_OPTION } from "@/types/survey";
import type { SurveyQuestion, SurveySection } from "@/types/survey";

export const SURVEY_SECTIONS: SurveySection[] = [
  {
    id: "business-info",
    number: 1,
    title: "Section 1 — Business Information",
    description: "Tell us about your business and how you sell online.",
  },
  {
    id: "order-workflow",
    number: 2,
    title: "Section 2 — Order Management Workflow",
    description: "Help us understand how you handle orders from first contact to fulfillment.",
  },
  {
    id: "current-tools",
    number: 3,
    title: "Section 3 — Current Tools",
    description: "Which apps you use daily and how much context-switching your workflow requires.",
  },
  {
    id: "challenges",
    number: 4,
    title: "Section 4 — Biggest Challenges",
    description: "What's consuming your time and causing friction in your business.",
  },
  {
    id: "software-budget",
    number: 5,
    title: "Section 5 — Software & Budget",
    description: "Your current software stack and what you'd invest in automation.",
  },
];

export const FINAL_QUESTION_SECTION = {
  id: "final",
  title: "Final Question",
  description:
    "Walk us through a recent order so we can understand your real-world workflow.",
} as const;

const q = (
  question: Omit<SurveyQuestion, "required"> & { required?: boolean },
): SurveyQuestion => ({ required: true, ...question });

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  q({
    id: "q1",
    number: 1,
    sectionId: "business-info",
    type: "radio",
    label: "What type of products do you sell?",
    options: [
      "Fashion & Clothing",
      "Shoes",
      "Beauty & Cosmetics",
      "Electronics",
      "Food & Beverage",
      "Home & Living",
      "Accessories",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q2",
    number: 2,
    sectionId: "business-info",
    type: "radio",
    label: "How many orders do you receive per day?",
    options: ["Less than 5", "5–20", "20–50", "50–100", "More than 100"],
  }),
  q({
    id: "q3",
    number: 3,
    sectionId: "business-info",
    type: "radio",
    label: "How many people manage your business?",
    options: ["Just me", "Two people", "Three to five people", "More than five"],
  }),
  q({
    id: "q4",
    number: 4,
    sectionId: "business-info",
    type: "checkbox",
    label: "Which sales channels do you currently use?",
    options: [
      "Instagram",
      "WhatsApp",
      "Website",
      "Facebook",
      "TikTok",
      "Etsy",
      "Amazon",
      "eBay",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q5",
    number: 5,
    sectionId: "order-workflow",
    type: "checkbox",
    label: "Where do most of your customers first contact you?",
    description: "Select up to 2 options",
    maxSelections: 2,
    options: [
      "Instagram DM",
      "WhatsApp",
      "Facebook Messenger",
      "Website Chat",
      "Email",
      "Phone",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q6",
    number: 6,
    sectionId: "order-workflow",
    type: "radio",
    label: "After a customer decides to buy, what is your first step?",
    options: [
      "Check inventory",
      "Collect shipping information",
      "Send payment instructions",
      "Create the order",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q7",
    number: 7,
    sectionId: "order-workflow",
    type: "radio",
    label: "Where do you record customer orders?",
    options: [
      "I don't record them",
      "Excel / Google Sheets",
      "Notebook",
      "CRM",
      "E-commerce Platform",
      "ERP",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q8",
    number: 8,
    sectionId: "order-workflow",
    type: "radio",
    label: "How do you manage inventory?",
    options: [
      "Memory",
      "Spreadsheet",
      "Inventory software",
      "Website",
      "ERP",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q9",
    number: 9,
    sectionId: "order-workflow",
    type: "checkbox",
    label: "How do you confirm customer payments?",
    description: "Select up to 2 options",
    maxSelections: 2,
    options: [
      "Bank transfer verification",
      "Payment gateway",
      "PayPal",
      "Stripe",
      "Cash on delivery",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q10",
    number: 10,
    sectionId: "order-workflow",
    type: "checkbox",
    label: "What happens after payment is confirmed?",
    description: "Select up to 3 steps you usually take",
    maxSelections: 3,
    options: [
      "Package the order",
      "Print invoice",
      "Create shipping label",
      "Send tracking number",
      "Update inventory",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q11",
    number: 11,
    sectionId: "current-tools",
    type: "checkbox",
    label: "Which tools do you use every day?",
    options: [
      "Instagram",
      "WhatsApp",
      "Google Sheets",
      "Excel",
      "Shopify",
      "WooCommerce",
      "Etsy",
      "Amazon Seller",
      "Trello",
      "Notion",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q12",
    number: 12,
    sectionId: "current-tools",
    type: "radio",
    label: "Approximately how many times per day do you switch between different apps?",
    options: ["Less than 10", "10–30", "30–50", "More than 50"],
  }),
  q({
    id: "q13",
    number: 13,
    sectionId: "current-tools",
    type: "radio",
    label: "Approximately how many times do you copy and paste customer information each day?",
    options: ["Less than 5", "5–10", "10–20", "More than 20"],
  }),
  q({
    id: "q14",
    number: 14,
    sectionId: "challenges",
    type: "checkbox",
    label: "Which tasks consume the most time?",
    description: "Select up to 3 that take the most time in your week",
    maxSelections: 3,
    options: [
      "Replying to customers",
      "Creating orders",
      "Managing inventory",
      "Confirming payments",
      "Shipping",
      "Customer support",
      "Reporting",
      "Marketing",
      "Content creation",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q15",
    number: 15,
    sectionId: "challenges",
    type: "checkbox",
    label: "Which problems have you experienced during the last week?",
    options: [
      "Oversold products",
      "Lost orders",
      "Incorrect addresses",
      "Late shipping",
      "Missing payments",
      "Slow customer replies",
      "None",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q16",
    number: 16,
    sectionId: "challenges",
    type: "radio",
    label: "If you could completely eliminate one task from your daily work, which would it be?",
    options: [
      "Replying to messages",
      "Creating orders",
      "Managing inventory",
      "Shipping",
      "Payment verification",
      "Reporting",
      OTHER_OPTION,
    ],
    hasOther: true,
  }),
  q({
    id: "q17",
    number: 17,
    sectionId: "software-budget",
    type: "radio",
    label: "Do you currently use any software to manage your business?",
    options: ["Yes", "No"],
  }),
  q({
    id: "q18",
    number: 18,
    sectionId: "software-budget",
    type: "textarea",
    label: "If yes, which software do you use?",
    conditionalOn: { questionId: "q17", value: "Yes" },
  }),
  q({
    id: "q19",
    number: 19,
    sectionId: "software-budget",
    type: "textarea",
    label: "What is the biggest weakness of your current software?",
  }),
  q({
    id: "q20",
    number: 20,
    sectionId: "software-budget",
    type: "radio",
    label:
      "How much would you be willing to pay each month for software that automates most of your daily work?",
    options: ["Less than $10", "$10–30", "$30–75", "$75–150", "More than $150"],
  }),
  q({
    id: "qFinal",
    number: "final",
    sectionId: "final",
    type: "textarea",
    label: "Please describe the last order you completed from beginning to end.",
    description:
      "Start from the moment the customer contacted you until the order was shipped.",
    minLength: 100,
    maxLength: 1000,
  }),
];

/** Questions grouped by section id */
export function getQuestionsBySection(sectionId: string): SurveyQuestion[] {
  return SURVEY_QUESTIONS.filter((question) => question.sectionId === sectionId);
}

/** Returns the `_other` field name for a question, if applicable */
export function getOtherFieldId(questionId: string): string {
  return `${questionId}_other`;
}

/** Whether a question should be visible given current form values */
export function isQuestionVisible(
  question: SurveyQuestion,
  values: Record<string, string | string[] | undefined>,
): boolean {
  if (!question.conditionalOn) return true;
  const { questionId, value } = question.conditionalOn;
  return values[questionId] === value;
}
