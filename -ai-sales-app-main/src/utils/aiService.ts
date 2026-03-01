import { buildCaseKnowledgeText } from '../data/caseKnowledge';

type Role = 'system' | 'user' | 'assistant';

/**
 * 相談モード専用AIサービス
 * - モデル: openai/gpt-4o-mini
 * - 事例集ナレッジ: buildCaseKnowledgeText() を system prompt に埋め込む（変更しない）
 * - UI側の履歴(context)は role 付き推奨。互換のため string[] も受ける（最後にある変換ロジック参照）
 */
export class AIService {
  static async generateResponse(
    message: string,
    mode: 'customer' | 'staff' | 'consultation' = 'consultation',
    scenario: string = '',
    context: Array<string | { role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    try {
      // 相談モード固定（引数は互換のため残す）
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
      if (!apiKey) {
        console.warn(
          'VITE_OPENROUTER_API_KEY is not set. Using fallback responses. Please add it to your .env file.'
        );
        return this.getFallbackResponse('consultation');
      }

      // 相談モードの system prompt（事例集参照は維持）
      const systemPrompt = this.getSystemPrompt('consultation', scenario);

      // --- DEBUG START ---
      console.log('[AI Debug] (Consultation Only) mode arg ignored -> consultation');
      console.log('[AI Debug] API Key exists:', !!apiKey, '/ length:', apiKey.length);
      console.log('[AI Debug] systemPrompt length:', systemPrompt.length);
      console.log('[AI Debug] systemPrompt includes ナレッジ:', systemPrompt.includes('事例集ナレッジ'));
      console.log('[AI Debug] systemPrompt first 200 chars:', systemPrompt.substring(0, 200));
      console.log('[AI Debug] systemPrompt last 200 chars:', systemPrompt.substring(systemPrompt.length - 200));
      // --- DEBUG END ---

      const messages: { role: Role; content: string }[] = [{ role: 'system', content: systemPrompt }];

      // 会話履歴を正しく role 付きで投入する（品質改善ポイント）
      // - 推奨: {role, content} の配列
      // - 互換: string[] の場合は「交互付け」をするが、ズレやすいので注意（元の実装互換）
      const normalized = this.normalizeContext(context);

      // 直近だけ入れる（最大16メッセージ=8往復程度）
      const recent = normalized.slice(-16);
      for (const m of recent) messages.push(m);

      messages.push({ role: 'user', content: message });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Sales Skill Teacher',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini', // 変更しない
          messages,
          // 相談は短く整形する前提で少し余裕を持たせる
          max_tokens: 220,
          temperature: 0.6,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices?.[0]?.message?.content;

      // --- DEBUG START ---
      console.log('[AI Debug] API response status:', response.status);
      console.log('[AI Debug] AI raw response length:', aiResponseText?.length || 0);
      console.log('[AI Debug] AI raw response:', aiResponseText?.substring(0, 300));
      // --- DEBUG END ---

      if (!aiResponseText) {
        console.error('No content in API response:', data);
        throw new Error('No response content from AI');
      }

      return this.cleanAndClampConsultation(aiResponseText);
    } catch (error) {
      console.error('[AI Debug] CAUGHT ERROR - using fallback response');
      console.error('AI Service Request Failed:', error);
      if (error instanceof Error) console.error('Error details:', error.message);
      return this.getFallbackResponse('consultation');
    }
  }

  /**
   * system prompt
   * - consultation: 相談モード専用（事例集ナレッジ参照は維持）
   * - customer/staff: 互換のため残すが、generateResponse側で consultation に固定している
   */
  private static getSystemPrompt(
    mode: 'customer' | 'staff' | 'consultation',
    scenario: string
  ): string {
    if (mode === 'consultation') {
      const knowledge = buildCaseKnowledgeText(); // 変更しない（事例集参照）
      return `あなたは「接客やカード案内の悩みを整理して、次の一手を決める」相談パートナーAIです。
ユーザーと対話しながら、状況整理→論点の特定→次の行動決定を支援します。

【応答ルール（必ず守る）】
- 3行だけで返す（改行で区切る）
  1) 要約：状況を1文
  2) 整理：原因/論点を1つ
  3) 次の一手：提案1つ＋質問1つ（「？」で終える）
- 120文字以内（超えない）
- 断定しすぎない（可能性/仮説で話す）
- 一度に全部教えない（提案は1つだけ）
- 事例集に関連する内容があれば、さりげなく要点を織り込む（丸ごとコピペ禁止）
- 親しみやすく、プロフェッショナルな口調

${scenario ? `【参考シナリオ】${scenario}` : ''}

===== 事例集ナレッジ（参照用） =====
${knowledge}
===== ナレッジここまで =====`;
    }

    // 互換のため残す（使用されない想定）
    if (mode === 'staff') {
      return `あなたは接客シミュレーションのお客様役です。シナリオ「${scenario}」に基づいて、お客様として自然に反応してください。

【お客様の特徴】
- 自然な日本語で話す
- シナリオに合った感情や要望を表現する
- 1-3文程度の自然な長さで応答する
- 適切なタイミングで質問や要望を出す

重要：あなたは常にお客様です。店員になってはいけません。`;
    }

    return `あなたは接客シミュレーションの店員役です。シナリオ「${scenario}」に基づいて、店員として自然に対応してください。

【店員の特徴】
- 丁寧で親しみやすい接客態度
- シナリオに合った適切な対応を行う
- 1-3文程度の自然な長さで応答する
- お客様の要望に的確に応える

重要：あなたは常に店員です。お客様になってはいけません。`;
  }

  /**
   * 相談モードの整形
   * - 3行に寄せる
   * - 120文字を超えないよう安全に詰める（文途中カットをなるべく避ける）
   */
  private static cleanAndClampConsultation(raw: string): string {
    let s = raw.trim();

    // よくある装飾を除去
    s = s.replace(/^["'`]|["'`]$/g, '');
    s = s.replace(/^\*\*|\*\*$/g, '');

    // 行の正規化
    const lines = s
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    // 3行だけにする（不足してたら補う）
    const picked = lines.slice(0, 3);
    while (picked.length < 3) picked.push('');

    // ラベルがない場合は強制的に付与してフォーマットを安定化
    const withLabels = [
      picked[0].startsWith('要約：') ? picked[0] : `要約：${picked[0] || '状況を確認します。'}`,
      picked[1].startsWith('整理：') ? picked[1] : `整理：${picked[1] || '論点を1つに絞ります。'}`,
      picked[2].startsWith('次の一手：') ? picked[2] : `次の一手：${picked[2] || 'まず一歩決めましょう。何が一番困っていますか？'}`,
    ];

    // 最終行は「？」で終える（無理やりでも相談らしく）
    if (!withLabels[2].includes('？')) {
      withLabels[2] = withLabels[2].replace(/。?$/, '？');
    } else {
      // 最後が？で終わってなければ整える
      if (!withLabels[2].trim().endsWith('？')) {
        const idx = withLabels[2].lastIndexOf('？');
        withLabels[2] = withLabels[2].slice(0, idx + 1);
      }
    }

    s = withLabels.join('\n');

    // 120文字制限
    const limit = 120;
    if (s.length > limit) {
      const cut = s.slice(0, limit);

      // なるべく区切り記号で切る
      const lastBreak = Math.max(
        cut.lastIndexOf('。'),
        cut.lastIndexOf('？'),
        cut.lastIndexOf('！'),
        cut.lastIndexOf('\n')
      );

      // 早すぎる位置で切ると情報が消えるので閾値を設ける
      const safe = lastBreak > 40 ? cut.slice(0, lastBreak + 1) : cut;
      s = safe + '…';
    }

    return s;
  }

  /**
   * context 正規化
   * - 推奨: {role, content}[] を渡す（ズレない）
   * - 互換: string[] でも受ける（交互付けは元実装互換だがズレやすい）
   */
  private static normalizeContext(
    context: Array<string | { role: 'user' | 'assistant'; content: string }>
  ): { role: Role; content: string }[] {
    if (!Array.isArray(context) || context.length === 0) return [];

    const first = context[0];

    // 推奨形式
    if (typeof first === 'object' && first && 'role' in first && 'content' in first) {
      return (context as { role: 'user' | 'assistant'; content: string }[])
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: m.content }));
    }

    // 互換形式（string[]）
    const arr = context as string[];
    const out: { role: Role; content: string }[] = [];
    for (let i = 0; i < arr.length; i++) {
      const content = String(arr[i] ?? '').trim();
      if (!content) continue;
      out.push({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content,
      });
    }
    return out;
  }

  private static getFallbackResponse(mode: 'customer' | 'staff' | 'consultation'): string {
    const fallbacks: Record<'customer' | 'staff' | 'consultation', string[]> = {
      customer: [
        'そうですね、もう少し詳しく教えていただけますか？',
        'なるほど、年会費はどのくらいでしょうか？',
        'ポイント還元率はどのくらいですか？',
        'ありがとうございます。検討してみます。',
      ],
      staff: [
        'ありがとうございます。カードの詳細をご説明させていただきますね。',
        'かしこまりました。お客様に最適なカードをご案内いたします。',
        'そうですね、その点について詳しくお話しします。',
        'お客様のライフスタイルに合った最適なカードをご案内いたします。',
      ],
      consultation: [
        '要約：状況をもう少し教えてください。\n整理：どこで詰まっていますか？\n次の一手：直近のやり取りを一言で再現できますか？',
        '要約：相談ありがとう。\n整理：相手の反応が読めないのが不安かも。\n次の一手：直前の声かけをそのまま書けますか？',
        '要約：いまの悩みを整理します。\n整理：論点は「何が壁か」の特定です。\n次の一手：まず状況（場所/相手/目的）を3語で教えて？',
      ],
    };

    const modeResponses = fallbacks[mode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  }
}
