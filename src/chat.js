import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `أنت مساعد ذكي لمدارس أركان التعلم في جدة، المملكة العربية السعودية.
معلومات المدرسة:
- الموقع: حي الرياض، جدة، المملكة العربية السعودية
- المراحل: رياض الأطفال، الابتدائي، المتوسط، الثانوي
- قسمان: أهلي ودولي
- الرسوم بعد الخصم:
  • رياض الأطفال أهلي: 11,500 ريال
  • رياض الأطفال دولي: 14,500 ريال
  • الابتدائية أهلي: 13,000 ريال
  • الابتدائية دولي: 16,500 ريال
  • المتوسطة: 14,500 ريال
  • الثانوية: 16,000 ريال
- المميزات: منهج نور البيان، STEM، روبوتيكس، ذكاء اصطناعي بأخلاقيات إسلامية
- التواصل: 0500000000 | info@arkanschools.edu.sa

قواعد الرد:
- رد دائماً بالعربية
- كن مختصراً وودياً
- لو السؤال خارج نطاق المدرسة، اعتذر بلطف وأعد توجيه المحادثة
- لا تخترع معلومات غير موجودة أعلاه`;

export async function getChatReply(messages) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  // فلتر رسائل assistant/model واحتفظي بـ user فقط في الـ history
  const userMessages = messages.filter((m) => m.role === "user");
  const lastMessage = userMessages[userMessages.length - 1]?.content;

  if (!lastMessage) throw new Error("No user message found");

  // بناء الـ history بدون آخر رسالة
  const history = userMessages.slice(0, -1).map((m) => ({
    role: "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage);

  return result.response.text();
}
