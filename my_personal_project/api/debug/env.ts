export default async function handler(_req: any, res: any) {
  return res.status(200).json({
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    hasGoogleGenerativeAiApiKey: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    hasGoogleApiKey: Boolean(process.env.GOOGLE_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || null,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
  });
}
