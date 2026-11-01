import { api } from "@/shared/api/baseApi";

export type AiReply = {
    reply: string;
    mode: "local" | "groq";
    providerStatus: "missing_key" | "unavailable" | "available" | "not_used";
    role: string;
    proposal?: {
        token: string;
        action: AiProposedAction;
    };
};

export type AiProposedAction =
    | { kind: "create_announcement"; title: string; message: string; audience: "ADMIN" | "OWNER" | "DRIVER"; ownerQuery?: string; recipientQuery?: string; allOwners?: boolean }
    | { kind: "update_announcement"; existingTitle: string; title?: string; message?: string }
    | { kind: "set_rickshaw_status"; plateNo: string; status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" }
    | { kind: "set_driver_status"; phone: string; status: "ONLINE" | "OFFLINE" | "ON_TRIP" };

/** Sends the localized chat prompt to the backend AI endpoint via shared RTK Query auth/cache. */
export const aiApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendAiMessage: builder.mutation<AiReply, { message: string; language: "en" | "bn" }>({
            query: (body) => ({
                url: "/ai/chat",
                method: "POST",
                body,
            }),
        }),
        confirmAiAction: builder.mutation<
            { actionId: string; targetId: string; message: string },
            { proposalToken: string }
        >({
            query: (body) => ({
                url: "/ai/actions/confirm",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Rickshaw", "Driver", "DriverLocation", "Announcement"],
        }),
        undoAiAction: builder.mutation<
            { message: string },
            { actionId: string }
        >({
            query: ({ actionId }) => ({
                url: `/ai/actions/${encodeURIComponent(actionId)}/undo`,
                method: "POST",
            }),
            invalidatesTags: ["Rickshaw", "Driver", "DriverLocation", "Announcement"],
        }),
    }),
});

export const {
    useSendAiMessageMutation,
    useConfirmAiActionMutation,
    useUndoAiActionMutation,
} = aiApi;
