import dotenv from "dotenv";
dotenv.config();

const graphVersion = "v22.0";

export async function sendWhatsAppText(to, body) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId || !to) {
    return { sent: false, reason: "WhatsApp Cloud API is not configured" };
  }

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: String(to).replace(/[+\\s()-]/g, ""),
        type: "text",
        text: { preview_url: false, body: String(body).slice(0, 3500) }
      })
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("WhatsApp API error:", data?.error?.message || response.status);
    return { sent: false, reason: "WhatsApp API request failed" };
  }
  return { sent: true, messageId: data?.messages?.[0]?.id || null };
}

export async function notifyOwner(message) {
  return sendWhatsAppText(process.env.OWNER_WHATSAPP_NUMBER, message);
}