import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useSendAiMessageMutation } from "@/features/ai/api/aiApi";
import { Button } from "@/components/ui/button";
import { translate } from "@/shared/i18n";
import { getAuthenticatedRole } from "@/shared/authSession";

type Message = { id: number; sender: "user" | "assistant"; text: string };

function getErrorMessage(error: unknown) {
    if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
    ) {
        return error.data.message;
    }
    return "Could not reach the assistant. Please try again.";
}

export default function AiAssistant() {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState("");
    const [chatState, setChatState] = useState<{
        session: string;
        messages: Message[];
        mode: "local" | "groq";
    }>(() => ({ session: "guest", messages: [], mode: "local" }));
    const [sendMessage, request] = useSendAiMessageMutation();
    const { lang } = useAppSelector((state) => state.ui);
    useLocation();
    const role = getAuthenticatedRole();
    const session = localStorage.getItem("token") ?? "guest";
    const messages = useMemo(
        () => chatState.session === session ? chatState.messages : [],
        [chatState.messages, chatState.session, session],
    );
    const mode = chatState.session === session ? chatState.mode : "local";
    const listRef = useRef<HTMLDivElement>(null);
    const nextMessageId = useRef(0);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, request.isLoading]);

    const suggestions = role === "admin" || role === "super_admin"
        ? ["Show fleet summary", "Where is driver shamusl?", "Show traffic usage by area"]
        : role === "owner"
            ? ["Show my fleet summary", "Where is my assigned driver?", "Show my fleet's busiest areas"]
            : role === "driver"
                ? ["Show my driver status", "How do I share GPS?", "Give me road safety tips"]
                : ["What can this app do?", "How does GPS tracking work?", "Give me road safety tips"];

    async function submitMessage(event?: FormEvent<HTMLFormElement>, suggested?: string) {
        event?.preventDefault();
        const message = (suggested ? translate(lang, suggested) : draft).trim();
        if (!message || request.isLoading) return;

        const userMessage = { id: nextMessageId.current++, sender: "user" as const, text: message };
        setChatState((current) => ({
            session,
            mode: current.session === session ? current.mode : "local",
            messages: [
                ...(current.session === session ? current.messages : []),
                userMessage,
            ],
        }));
        setDraft("");

        try {
            const result = await sendMessage({ message, language: lang }).unwrap();
            setChatState((current) => current.session !== session
                ? current
                : {
                    ...current,
                    mode: result.mode,
                    messages: [
                        ...current.messages,
                        { id: nextMessageId.current++, sender: "assistant", text: result.reply },
                    ],
                });
        } catch (error) {
            setChatState((current) => current.session !== session
                ? current
                : {
                    ...current,
                    messages: [
                        ...current.messages,
                        { id: nextMessageId.current++, sender: "assistant", text: translate(lang, getErrorMessage(error)) },
                    ],
                });
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-[1000] sm:bottom-6 sm:right-6">
            {open && (
                <section
                    role="dialog"
                    aria-label={translate(lang, "Rickshaw AI assistant")}
                    className="mb-3 flex h-[min(620px,calc(100dvh-120px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                >
                    <header className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                                <Bot className="size-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-sm font-semibold">{translate(lang, "Rickshaw AI assistant")}</h2>
                                <p className="text-[11px] text-emerald-100">
                                    {role ? translate(lang, "Role-based fleet help") : translate(lang, "General help · no login needed")}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/15 hover:text-white"
                            aria-label={translate(lang, "Close assistant")}
                            onClick={() => setOpen(false)}
                        >
                            <X />
                        </Button>
                    </header>

                    <div className="flex items-center justify-between border-b px-4 py-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-emerald-700" aria-hidden="true" />
                            {mode === "groq"
                                ? translate(lang, "Groq AI")
                                : translate(lang, "Built-in assistant · no API key")}
                        </span>
                        <span>{role ? translate(lang, role) : translate(lang, "Guest")}</span>
                    </div>

                    <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50/80 p-3.5">
                        {messages.length === 0 && (
                            <div className="rounded-2xl rounded-tl-sm border bg-white p-3 text-sm leading-5 text-slate-700 shadow-sm">
                                {role
                                    ? translate(lang, "Ask a question. Your answers only include information your role is allowed to see.")
                                    : translate(lang, "Ask a general question or learn about the fleet app. Sign in for private fleet insights.")}
                            </div>
                        )}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-5 ${
                                    message.sender === "user"
                                        ? "ml-auto rounded-br-sm bg-emerald-700 text-white"
                                        : "rounded-tl-sm border bg-white text-slate-700 shadow-sm"
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {request.isLoading && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                                {translate(lang, "Thinking...")}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto border-t bg-white px-3 py-2">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                disabled={request.isLoading}
                                className="shrink-0 rounded-full border border-emerald-100 px-2.5 py-1 text-[11px] text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
                                onClick={() => void submitMessage(undefined, suggestion)}
                            >
                                {translate(lang, suggestion)}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={(event) => void submitMessage(event)} className="flex items-end gap-2 border-t bg-white p-3">
                        <label className="sr-only" htmlFor="ai-chat-message">
                            {translate(lang, "Ask the assistant")}
                        </label>
                        <textarea
                            id="ai-chat-message"
                            value={draft}
                            maxLength={500}
                            rows={1}
                            placeholder={translate(lang, "Type a question...")}
                            className="max-h-24 min-h-10 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            onChange={(event) => setDraft(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    void submitMessage();
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="size-10 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                            disabled={!draft.trim() || request.isLoading}
                            aria-label={translate(lang, "Send message")}
                        >
                            <Send aria-hidden="true" />
                        </Button>
                    </form>
                </section>
            )}
            <Button
                type="button"
                className="ml-auto flex size-14 rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-950/25 hover:bg-emerald-800"
                aria-label={translate(lang, open ? "Close assistant" : "Open AI assistant")}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
            </Button>
        </div>
    );
}
