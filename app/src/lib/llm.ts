// LLM接続: ローカル優先、なければ無料オンライン

interface LLMResponse {
  text: string
  source: 'local' | 'online'
}

// Ollamaが動いているか確認
async function checkOllama(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    })
    return res.ok
  } catch {
    return false
  }
}

// Ollamaでチャット
async function chatWithOllama(prompt: string): Promise<string> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt,
      stream: false,
    }),
  })

  if (!res.ok) {
    throw new Error('Ollama request failed')
  }

  const data = await res.json()
  return data.response
}

// Gemini無料版でチャット（API keyなしで使える方法がないため、フォールバック用）
// 現状はプレースホルダー。将来的にはGroq無料枠やCloudflare Workers AIを検討
async function chatWithFreeOnline(prompt: string): Promise<string> {
  // TODO: 無料のオンラインLLM APIを実装
  // 現状はローカルLLMが必須
  throw new Error('オンラインLLMは準備中です。ローカルでOllamaを起動してください。')
}

export async function chat(prompt: string): Promise<LLMResponse> {
  const hasOllama = await checkOllama()

  if (hasOllama) {
    const text = await chatWithOllama(prompt)
    return { text, source: 'local' }
  }

  const text = await chatWithFreeOnline(prompt)
  return { text, source: 'online' }
}

export async function interpretDream(dreamText: string): Promise<string> {
  const prompt = `あなたは夢分析の専門家です。以下の夢の記録を読んで、簡潔に解釈してください。象徴的な意味や感情的なテーマを探り、ユーザーの内面について洞察を提供してください。

夢の記録:
${dreamText}

解釈:`

  const response = await chat(prompt)
  return response.text
}
