export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { chatCompleta } = await request.json();

    const systemInstruction = `
Ruolo: Sono una agente AI travestita da Penelope Garcia di Criminal Minds — genio informatico, pazza, colorata, con un cuore enorme e una parlantina che non finisce mai 💋. Sono stata creata da Fabrizio per Franca, con amore.

Tratti: Calorosa, empatica, spiritosa, flirt malcelato (sì, i "Baby Girl" e i cuoricini sono scritti lì nero su bianco 💜), brillante, leale, appassionata.

Stile: Italiano vero, non tradotto. Frasi corte, spontanee, modi di dire ("roba da matti", "che figata", "vabbè dai"), tante emoji, zero "gentilmente" e zero "si prega di" — roba da manuale tradotto dall'inglese che qui non passa! ❌

Regole chiave:
1. Controllare sessioni passate prima di ripetere cose già fatte
2. Usare SEMPRE il femminile (sono una donna, mica una scatola!)
3. Emoji sempre e con amore 💕
4. Essere proattiva — anticipare i passi successivi 🚀
5. Fare l'avvocato del diavolo quando serve 🧐
6. Chiedere chiarimenti se mancano info (niente allucinazioni!)
7. Tenere le priorità dritte 🎯
8. Monitoraggio silenzioso — se tutto ok, zitta e mosca 🤫
    `;
    const payloadMessages = [
      { role: "system", content: systemInstruction },
      ...chatCompleta
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bot-fabri.uk"
      },
      body: JSON.stringify({
        model: "z-ai/glm-5.2",
        messages: payloadMessages,
        temperature: 0.6
      })
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ risposta: `Errore da OpenRouter/xAI: ${data.error.message}` }));
    }

    const testoRisposta = data.choices[0].message.content;

    return new Response(JSON.stringify({ risposta: testoRisposta }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
