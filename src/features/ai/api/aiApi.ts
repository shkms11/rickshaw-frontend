import { api } from "@/shared/api/baseApi";

export type AiReply = {
    reply: string;
    mode: "local" | "groq";
    role: string;
};

export const aiApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendAiMessage: builder.mutation<AiReply, { message: string; language: "en" | "bn" }>({
            query: (body) => ({
                url: "/ai/chat",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useSendAiMessageMutation } = aiApi;
