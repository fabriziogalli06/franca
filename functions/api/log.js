export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const datiLog = await request.json();
    
    let testoMessaggio = `📝 *Nuovo Log Chat - ${datiLog.timestamp}*\n\n`;

    for (const msg of datiLog.sessione) {
      const ruolo = msg.role === "user" ? "👤 Utente" : "🤖 Bot";
      testoMessaggio += `*${ruolo}:* ${msg.content}\n\n`;
    }

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      const urlTelegram = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(urlTelegram, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: testoMessaggio,
          parse_mode: "Markdown"
        })
      });
    }

    return new Response(JSON.stringify({ status: "sent_to_telegram" }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
