import { createSlice } from "@reduxjs/toolkit";

type Lang = "en" | "bn";

type UIState = {
  lang: Lang;
  largeText: boolean;
};

// Header persists changes to localStorage; this slice keeps rendered UI in sync during the session.
const initialState: UIState = {
  lang:
    typeof window !== "undefined" && window.localStorage.getItem("lang") === "bn"
      ? "bn"
      : "en",
  largeText:
    typeof window !== "undefined" &&
    window.localStorage.getItem("largeText") === "true",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLang(state) {
      state.lang = state.lang === "bn" ? "en" : "bn";
    },
    toggleLargeText(state) {
      state.largeText = !state.largeText;
    },
  },
});

export const { toggleLang, toggleLargeText } = uiSlice.actions;
export default uiSlice.reducer;
