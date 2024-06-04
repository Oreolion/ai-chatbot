import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";

try {
  const result = await fetch("scrimba-info.txt");
  const text = await result.text();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""], //default setting,
    chunkOverlap: 50,
  });
  const output = await splitter.createDocuments([text]);
  const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
  const sbURL = import.meta.env.VITE_SUPABASE_URL_LC_CHATBOT;
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const client = createClient(sbURL, sbApiKey);

  console.log(openaiKey)

  if (!sbApiKey || !sbURL || !openaiKey) {
    throw new Error("Environment variables for Supabase or OpenAI API keys are not set correctly.");
  }

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openaiAPIKey: openaiKey }),
    {
      client,
      tableName: "documents",
    }
  );
} catch (err) {
  console.log(err);
}
