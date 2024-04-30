/**
 * Made by running running `[...document.querySelector("#voiceselection").children].map((child) => child.innerText)`
 * on https://responsivevoice.org/
 */
type VoiceType =
    | "UK English Female"
    | "UK English Male"
    | "US English Female"
    | "US English Male"
    | "Arabic Male"
    | "Arabic Female"
    | "Armenian Male"
    | "Australian Female"
    | "Australian Male"
    | "Bangla Bangladesh Female"
    | "Bangla Bangladesh Male"
    | "Bangla India Female"
    | "Bangla India Male"
    | "Brazilian Portuguese Female"
    | "Chinese Female"
    | "Chinese Male"
    | "Chinese (Hong Kong) Female"
    | "Chinese (Hong Kong) Male"
    | "Chinese Taiwan Female"
    | "Chinese Taiwan Male"
    | "Czech Female"
    | "Danish Female"
    | "Deutsch Female"
    | "Deutsch Male"
    | "Dutch Female"
    | "Dutch Male"
    | "Estonian Male"
    | "Filipino Female"
    | "Finnish Female"
    | "French Female"
    | "French Male"
    | "French Canadian Female"
    | "French Canadian Male"
    | "Greek Female"
    | "Hindi Female"
    | "Hindi Male"
    | "Hungarian Female"
    | "Indonesian Female"
    | "Indonesian Male"
    | "Italian Female"
    | "Italian Male"
    | "Japanese Female"
    | "Japanese Male"
    | "Korean Female"
    | "Korean Male"
    | "Latin Male"
    | "Nepali"
    | "Norwegian Female"
    | "Norwegian Male"
    | "Polish Female"
    | "Polish Male"
    | "Portuguese Female"
    | "Portuguese Male"
    | "Romanian Female"
    | "Russian Female"
    | "Sinhala"
    | "Slovak Female"
    | "Spanish Female"
    | "Spanish Latin American Female"
    | "Spanish Latin American Male"
    | "Swedish Female"
    | "Swedish Male"
    | "Tamil Female"
    | "Tamil Male"
    | "Thai Female"
    | "Thai Male"
    | "Turkish Female"
    | "Turkish Male"
    | "Ukrainian Female"
    | "Vietnamese Female"
    | "Vietnamese Male"
    | "Afrikaans Male"
    | "Albanian Male"
    | "Bosnian Male"
    | "Catalan Male"
    | "Croatian Male"
    | "Esperanto Male"
    | "Icelandic Female"
    | "Latvian Male"
    | "Macedonian Male"
    | "Moldavian Female"
    | "Montenegrin Male"
    | "Serbian Male"
    | "Serbo-Croatian Male"
    | "Swahili Male"
    | "Welsh Male"
    | "Fallback UK Female";

interface VoiceOptions {
    /**
     * Pitch (range 0 to 2)
     */
    pitch?: number;
    /**
     * Rate (range 0 to 1.5)
     */
    rate?: number;
    /**
     * Volume (range 0 to 1)
     */
    volume?: number;
    /**
     * StartCallback
     */
    onStart?: () => void;
    /**
     * EndCallback
     */
    onEnd?: () => void;
}

interface TextReplacementOptions {
    /**
     * Text to be replaced. Regular expressions are supported.
     */
    searchvalue: string;
    /**
     * Replacement text
     */
    newvalue: string;
    /**
     * Voice name (from ResponsiveVoice collection) for which the replacement will be applied.
     * Can be a unique name or an array of names.
     */
    collectionvoices?: VoiceType | VoiceType[];
    /**
     * Voice name (from System voices collection) for which the replacement will be applied.
     * Can be a unique name or an array of names.
     */
    systemvoices?: string | string[];
}

interface ResponsiveVoice {
    /**
     * Starts speaking the text in a given voice.
     * @param {string} text The text to be spoken.
     * @param {VoiceType} voice Defaults to “UK English Female”. Choose from the available [ResponsiveVoices](https://responsivevoice.org/text-to-speech-languages/).
     * @param {VoiceOptions} options Used to add optional pitch (range 0 to 2), rate (range 0 to 1.5), volume (range 0 to 1) and callbacks.
     *
     * ***
     * ### Examples
     *
     * Pitch, rate and volume may not affect audio on some browser combinations, older versions of Chrome on Windows for example.
     *
     * ```js
     * responsiveVoice.speak("hello world");
     * ```
     *
     * <br/>
     *
     * ```js
     * responsiveVoice.speak("hello world", "UK English Male");
     * ```
     *
     * <br/>
     *
     * ```js
     * responsiveVoice.speak("hello world", "UK English Male", {pitch: 2});
     * ```
     *
     * <br/>
     *
     * ```js
     * responsiveVoice.speak("hello world", "UK English Male", {rate: 1.5});
     * ```
     *
     * <br/>
     *
     * ```js
     * responsiveVoice.speak("hello world", "UK English Male", {volume: 1});
     * ```
     *
     * <br/>
     *
     * ```js
     * responsiveVoice.speak("hello world", "UK English Male", {onstart: StartCallback, onend: EndCallback});
     * ```
     *
     * Speak a specified element on the page:
     *
     * ```js
     * responsiveVoice.speak(document.getElementById("article-container").textContent);
     * ```
     */
    speak(text: string): void;
    speak(text: string, voice: VoiceType): void;
    speak(text: string, voice: VoiceType, options: VoiceOptions): void;

    /**
     * Checks if browser supports native TTS
     */
    voiceSupport(): boolean;
    /**
     * Detects if native TTS or TTS audio element is producing output.
     */
    isPlaying(): boolean;
    /**
     * Returns a list of available voices
     */
    getVoices(): VoiceType[];
    /**
     * Allows setting a default voice, which will be used by responsiveVoice.speak whenever a voice is not specified as a parameter.
     */
    setDefaultVoice(voice: VoiceType): void;
    /**
     * Allows setting a default rate of speech, which will be used by responsiveVoice.speak whenever rate is not included in the parameters.
     * The rate parameter must be > 0 and <= 1.5.
     * Please note this might not work with all voices, as certain voices don’t support variable rate of speech.
     */
    setDefaultRate(rate: VoiceOptions["rate"]);
    /**
     * On some devices, such as mobile, browsers prevent audio from being played without a user gesture.
     * ResponsiveVoice can listen for a click on the window and take it as the user gesture required by the browser.
     * This will grant ResponsiveVoice permission to play any audio from that moment on.
     *
     * **Note**: This click hook is automatically enabled on mobile devices.
     */
    enableWindowClickHook(): void;

    /**
     * As an alternative to `enableWindowClickHook`, in the case that listening for a click on the window is not possible,
     * `responsiveVoice.clickEvent()` can be called directly from any user gesture and it will grant ResponsiveVoice the required permission.
     */
    clickEvent(): void;
    /**
     * Pauses speech
     */
    pause(): void;
    /**
     * Resumes speech
     */
    resume(): void;
    /**
     * Stops playing the speech.
     */
    cancel(): void;
    /**
     *
     * Replaces selected words or expressions in the text.
     * Useful for specifying pronunciation variations for different voices.
     *
     * `responsiveVoice.setTextReplacements` expects an **array of objects** where each object is a replacement.
     *
     * ***
     *
     * ### Examples
     *
     *
     * Replace “human” with “robot”. It will be replaced for any voice selected.
     *
     * ```js
     * responsiveVoice.setTextReplacements([{
     *     searchvalue: "human",
     *     newvalue: "robot"
     * }]);
     * ```
     *
     *
     * Replace “human” with “robot” and “dog” with “cat”.
     * ```js
     * responsiveVoice.setTextReplacements([
     *     {
     *         searchvalue: "human",
     *         newvalue: "robot"
     *     },
     *     {
     *         searchvalue: "dog",
     *         newvalue: "cat"
     *     }
     * ]);
     * ```
     *
     * Replace “human” with “robot” only for “UK English Female” voice profile.
     * ```js
     * responsiveVoice.setTextReplacements([{
     *     searchvalue: "human",
     *     newvalue: "robot",
     *     collectionvoices: "UK English Female"
     * }]);
     * ```
     *
     * Replace “human” with “robot” for “de-DE” and “fr-FR” system voices. These correspond to german and french on iOS devices.
     * ```js
     * responsiveVoice.setTextReplacements([{
     *     searchvalue: "human",
     *     newvalue: "robot",
     *     systemvoices: ["de-DE", "fr-FR"]
     * }]);
     * ```
     *
     * Replace any combination of numbers with the word “numbers”.
     * ```js
     * responsiveVoice.setTextReplacements([{
     *     searchvalue: /[0-9]+/g,
     *     newvalue: "numbers"
     * }]);
     * ```
     *
     */
    setTextReplacements(textReplacements: TextReplacementOptions);

    /**
     * Sometimes performance can have an impact on the TTS engine, causing unexpected behaviors when the system load is high.
     * ResponsiveVoice uses a timeout as a fallback mechanism so the onstart and onend events will be triggered normally even if the TTS engine
     * didn’t respond to the speak request. This is specially useful for a multiple phrase setup such as a dialog where the next phrase needs to
     * be played after the current one.
     *
     * ***Note**: enableEstimationTimeout is enabled by default.*
     *
     * *We recommend to disable this feature for non-latin character languages. It can be disabled by setting the parameter as `false`*
     */
    enableEstimationTimeout: boolean;
}

/**
 * ## [ResponsiveVoice Text To Speech API](https://responsivevoice.org/api/)
 *
 * Include the JS file in your page
 *
 * ```html
 * <script src="https://code.responsivevoice.org/responsivevoice.js?key=YOUR_UNIQUE_KEY"></script>
 * ```
 */
declare const responsiveVoice: ResponsiveVoice;
