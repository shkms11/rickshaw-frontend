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

/** Global role-aware chat UI; sends the current language and request to the AI feature API. */
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
        // Do not show one account's conversation after the active token changes.
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
                    className="mb-3 flex h-[min(640px,calc(100dvh-112px))] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-950/5"
                >
                    <header className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-white via-emerald-50/70 to-white px-4 py-3.5 text-slate-900">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm shadow-emerald-900/15">
                                <Bot className="size-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-sm font-semibold">{translate(lang, "Rickshaw AI assistant")}</h2>
                                <p className="text-xs text-slate-600">
                                    {role ? translate(lang, "Role-based fleet help") : translate(lang, "General help · no login needed")}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-10 rounded-xl text-slate-600 hover:bg-emerald-100 hover:text-emerald-900"
                            aria-label={translate(lang, "Close assistant")}
                            onClick={() => setOpen(false)}
                        >
                            <X />
                        </Button>
                    </header>

                    <div className="flex min-h-10 items-center justify-between gap-2 border-b border-slate-100 bg-white px-4 py-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-emerald-700" aria-hidden="true" />
                            {mode === "groq"
                                ? translate(lang, "Groq AI")
                                : translate(lang, "Built-in assistant · no API key")}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{role ? translate(lang, role) : translate(lang, "Guest")}</span>
                    </div>

                    <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50/80 p-4">
                        {messages.length === 0 && (
                            <div className="rounded-2xl rounded-tl-sm border border-emerald-100 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                                {role
                                    ? translate(lang, "Ask a question. Your answers only include information your role is allowed to see.")
                                    : translate(lang, "Ask a general question or learn about the fleet app. Sign in for private fleet insights.")}
                            </div>
                        )}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                    message.sender === "user"
                                        ? "ml-auto rounded-br-sm bg-emerald-700 text-white"
                                        : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {request.isLoading && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                                {translate(lang, "Thinking...")}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-3 py-2.5">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                disabled={request.isLoading}
                                className="min-h-9 shrink-0 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 text-xs font-medium text-emerald-900 transition-colors hover:bg-emerald-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                                onClick={() => void submitMessage(undefined, suggestion)}
                            >
                                {translate(lang, suggestion)}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={(event) => void submitMessage(event)} className="flex items-end gap-2 border-t border-slate-100 bg-white p-3">
                        <label className="sr-only" htmlFor="ai-chat-message">
                            {translate(lang, "Ask the assistant")}
                        </label>
                        <textarea
                            id="ai-chat-message"
                            value={draft}
                            maxLength={500}
                            rows={1}
                            placeholder={translate(lang, "Type a question...")}
                            className="max-h-24 min-h-11 flex-1 resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                            className="size-11 rounded-xl bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
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
                className="ml-auto flex size-14 rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                aria-label={translate(lang, open ? "Close assistant" : "Open AI assistant")}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
            </Button>
        </div>
    );
}
