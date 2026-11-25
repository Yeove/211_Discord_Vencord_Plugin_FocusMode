/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { disableStyle, toggleStyle } from "@api/Styles";
import definePlugin, { OptionType } from "@utils/types";

import style from "./style.css?managed";

const settings = definePluginSettings({
    keybind: {
        type: OptionType.STRING,
        description: "Keybind that toggles focus mode, e.g. Ctrl+Space, Ctrl+Shift+F or F9",
        default: "Ctrl+Space"
    }
});

function onKeyDown(e: KeyboardEvent) {
    const modifiers = settings.store.keybind.toLowerCase().split("+").map(k => k.trim());
    const key = modifiers.pop();
    const has = (modifier: string) => modifiers.includes(modifier);

    const modifiersMatch = e.ctrlKey === has("ctrl") && e.altKey === has("alt") && e.shiftKey === has("shift") && e.metaKey === has("meta");
    const keyMatches = [e.key, e.code.replace(/^(Key|Digit)/, "")].some(k => k.toLowerCase() === key);
    if (e.repeat || !modifiersMatch || !keyMatches) return;

    e.preventDefault();
    toggleStyle(style);
}

export default definePlugin({
    name: "FocusMode",
    description: "Press a keybind (Ctrl+Space by default) to hide the side panels and keep only the message list",
    authors: [{ name: "Yeove", id: 0n }],
    settings,
    start: () => window.addEventListener("keydown", onKeyDown, true),
    stop() {
        window.removeEventListener("keydown", onKeyDown, true);
        disableStyle(style);
    }
});
