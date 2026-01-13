/**
 * Language information mapping from 3-letter ISO 639-2/T codes to 2-letter codes and names
 * Names provided in both Spanish and English
 */

interface LanguageInfo {
    code2: string; // ISO 639-1 (2-letter code)
    nameEnglish: string;
    nameSpanish: string;
}

const LANGUAGE_MAP: Record<string, LanguageInfo> = {
    // Spanish and Catalan languages
    spa: { code2: "es", nameEnglish: "Spanish", nameSpanish: "Español" },
    lat: {
        code2: "es",
        nameEnglish: "Latinamerican Spanish",
        nameSpanish: "Español Latino",
    },
    cat: { code2: "ca", nameEnglish: "Catalan", nameSpanish: "Catalán" },

    // English and related
    eng: { code2: "en", nameEnglish: "English", nameSpanish: "Inglés" },

    // Asian languages
    jpn: { code2: "ja", nameEnglish: "Japanese", nameSpanish: "Japonés" },
    kor: { code2: "ko", nameEnglish: "Korean", nameSpanish: "Coreano" },
    chi: { code2: "zh", nameEnglish: "Chinese", nameSpanish: "Chino" },
    tha: { code2: "th", nameEnglish: "Thai", nameSpanish: "Tailandés" },
    vie: { code2: "vi", nameEnglish: "Vietnamese", nameSpanish: "Vietnamita" },
    ind: { code2: "id", nameEnglish: "Indonesian", nameSpanish: "Indonesio" },

    // European languages
    fre: { code2: "fr", nameEnglish: "French", nameSpanish: "Francés" },
    ger: { code2: "de", nameEnglish: "German", nameSpanish: "Alemán" },
    dut: { code2: "nl", nameEnglish: "Dutch", nameSpanish: "Holandés" },
    ita: { code2: "it", nameEnglish: "Italian", nameSpanish: "Italiano" },
    por: { code2: "pt", nameEnglish: "Portuguese", nameSpanish: "Portugués" },
    ron: { code2: "ro", nameEnglish: "Romanian", nameSpanish: "Rumano" },
    rus: { code2: "ru", nameEnglish: "Russian", nameSpanish: "Ruso" },
    pol: { code2: "pl", nameEnglish: "Polish", nameSpanish: "Polaco" },
    cze: { code2: "cs", nameEnglish: "Czech", nameSpanish: "Checo" },
    hun: { code2: "hu", nameEnglish: "Hungarian", nameSpanish: "Húngaro" },
    tur: { code2: "tr", nameEnglish: "Turkish", nameSpanish: "Turco" },
    fin: { code2: "fi", nameEnglish: "Finnish", nameSpanish: "Finlandés" },
    swe: { code2: "sv", nameEnglish: "Swedish", nameSpanish: "Sueco" },
    nor: { code2: "no", nameEnglish: "Norwegian", nameSpanish: "Noruego" },
    dan: { code2: "da", nameEnglish: "Danish", nameSpanish: "Danés" },
    heb: { code2: "he", nameEnglish: "Hebrew", nameSpanish: "Hebreo" },
    gre: { code2: "el", nameEnglish: "Greek", nameSpanish: "Griego" },

    // Middle Eastern and African languages
    ara: { code2: "ar", nameEnglish: "Arabic", nameSpanish: "Árabe" },

    // Baltic and Slavic languages
    lit: { code2: "lt", nameEnglish: "Lithuanian", nameSpanish: "Lituano" },
    lav: { code2: "lv", nameEnglish: "Latvian", nameSpanish: "Letón" },
    est: { code2: "et", nameEnglish: "Estonian", nameSpanish: "Estonio" },
    slv: { code2: "sl", nameEnglish: "Slovenian", nameSpanish: "Esloveno" },
    slo: { code2: "sk", nameEnglish: "Slovak", nameSpanish: "Eslovaco" },
    ukr: { code2: "uk", nameEnglish: "Ukrainian", nameSpanish: "Ucraniano" },
    bul: { code2: "bg", nameEnglish: "Bulgarian", nameSpanish: "Búlgaro" },
};

export interface LanguageReturnOptions {
    code2?: boolean;
    nameEnglish?: boolean;
    nameSpanish?: boolean;
}

/**
 * Get language information from a 3-letter language code
 * @param code3 - 3-letter ISO 639-2/T language code (e.g., "spa", "eng", "jpn")
 * @param options - Options for what information to return. Defaults to returning all if not specified.
 * @returns Object containing requested language information, or null if language not found
 */
export function getLanguageInfo(
    code3: string,
    options?: LanguageReturnOptions
): Partial<LanguageInfo> | null {
    const normalizedCode = code3.toLowerCase();
    const languageInfo = LANGUAGE_MAP[normalizedCode];

    if (!languageInfo) {
        return null;
    }

    // If no options specified, return all information
    if (!options || Object.keys(options).length === 0) {
        return languageInfo;
    }

    // Return only requested information
    const result: Partial<LanguageInfo> = {
        code2: "Not found",
        nameEnglish: "Not found",
        nameSpanish: "Not found",
    };

    if (options.code2) {
        result.code2 = languageInfo.code2;
    }
    if (options.nameEnglish) {
        result.nameEnglish = languageInfo.nameEnglish;
    }
    if (options.nameSpanish) {
        result.nameSpanish = languageInfo.nameSpanish;
    }

    return result;
}

/**
 * Get all available language codes
 * @returns Array of 3-letter language codes
 */
export function getAvailableLanguageCodes(): string[] {
    return Object.keys(LANGUAGE_MAP);
}

/**
 * Check if a language code is supported
 * @param code3 - 3-letter language code to check
 * @returns true if language is supported, false otherwise
 */
export function isLanguageSupported(code3: string): boolean {
    return Object.hasOwn(LANGUAGE_MAP, code3.toLowerCase());
}
