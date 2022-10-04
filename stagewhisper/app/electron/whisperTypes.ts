// Create an indexed array of langauges and their codes
export enum whisperLanguages {
  // TODO: Check the country codes
  Afrikaans = 'af',
  Albanian = 'sq',
  Amharic = 'am',
  Arabic = 'ar',
  Armenian = 'hy',
  Assamese = 'as',
  Azerbaijani = 'az',
  Bashkir = 'ba',
  Basque = 'eu',
  Belarusian = 'be',
  Bengali = 'bn',
  Bosnian = 'bs',
  Breton = 'br',
  Bulgarian = 'bg',
  Burmese = 'my',
  Castilian = 'es',
  Catalan = 'ca',
  Chinese = 'zh',
  Croatian = 'hr',
  Czech = 'cs',
  Danish = 'da',
  Dutch = 'nl',
  English = 'en',
  Estonian = 'et',
  Faroese = 'fo',
  Finnish = 'fi',
  Flemish = 'nl',
  French = 'fr',
  Galician = 'gl',
  Georgian = 'ka',
  German = 'de',
  Greek = 'el',
  Gujarati = 'gu',
  Haitian = 'ht',
  'Haitian Creole' = 'ht',
  Hausa = 'ha',
  Hawaiian = 'haw',
  Hebrew = 'he',
  Hindi = 'hi',
  Hungarian = 'hu',
  Icelandic = 'is',
  Indonesian = 'id',
  Italian = 'it',
  Japanese = 'ja',
  Javanese = 'jv',
  Kannada = 'kn',
  Kazakh = 'kk',
  Khmer = 'km',
  Korean = 'ko',
  Lao = 'lo',
  Latin = 'la',
  Latvian = 'lv',
  Letzeburgesch = 'lb',
  Lingala = 'ln',
  Lithuanian = 'lt',
  Luxembourgish = 'lb',
  Macedonian = 'mk',
  Malagasy = 'mg',
  Malay = 'ms',
  Malayalam = 'ml',
  Maltese = 'mt',
  Maori = 'mi',
  Marathi = 'mr',
  Moldavian = 'mo',
  Moldovan = 'mo',
  Mongolian = 'mn',
  Myanmar = 'my',
  Nepali = 'ne',
  Norwegian = 'no',
  Nynorsk = 'nn',
  Occitan = 'oc',
  Panjabi = 'pa',
  Pashto = 'ps',
  Persian = 'fa',
  Polish = 'pl',
  Portuguese = 'pt',
  Punjabi = 'pa',
  Pushto = 'ps',
  Romanian = 'ro',
  Russian = 'ru',
  Sanskrit = 'sa',
  Serbian = 'sr',
  Shona = 'sn',
  Sindhi = 'sd',
  Sinhala = 'si',
  Sinhalese = 'si',
  Slovak = 'sk',
  Slovenian = 'sl',
  Somali = 'so',
  Spanish = 'es',
  Sundanese = 'su',
  Swahili = 'sw',
  Swedish = 'sv',
  Tagalog = 'tl',
  Tajik = 'tg',
  Tamil = 'ta',
  Tatar = 'tt',
  Telugu = 'te',
  Thai = 'th',
  Tibetan = 'bo',
  Turkish = 'tr',
  Turkmen = 'tk',
  Ukrainian = 'uk',
  Urdu = 'ur',
  Uzbek = 'uz',
  Valencian = 'ca',
  Vietnamese = 'vi',
  Welsh = 'cy',
  Yiddish = 'yi',
  Yoruba = 'yo'
}

export const whisperCodes = Object.values(whisperLanguages);

export interface WhisperArgs {
  // Input Path
  inputPath: string;

  // Model: Name of the Whisper model to use (default: small)
  model?: 'tiny.en' | 'tiny' | 'base.en' | 'base' | 'small.en' | 'small' | 'medium.en' | 'medium' | 'large';

  // ModelDir: The path to save model files; uses ~/.cache/whisper by default (default: None)
  model_dir?: string;

  // Device: Device to use for PyTorch inference (default: cpu)
  device?: string;

  // OutputDir: Directory to save the outputs (default: .)
  output_dir?: string;

  // Verbose: Whether to print out the progress and debug messages (default: True)
  verbose?: boolean;

  // Task: Whether to perform X->EN speech
  task?: 'transcribe' | 'translate';

  // Language: Language spoken in the audio, specify None to perform language detection (default: None)
  language?: keyof typeof whisperLanguages;

  // Temperature: Temperature for the top-k sampling (default: 0)
  temperature?: number;

  // BestOf: number of candidates when sampling with non-zero temperature (default: 5)
  best_of?: number;

  // BeamSize: Number of beams in beam search, only applicable when temperature is zero (default: 5)
  beam_size?: number;

  // Patience: Optional patience value to use in beam decoding, as in https://arxiv.org/abs/2204.05424, the default (1.0) is equivalent to conventional beam search (default: None)
  patience?: number;

  // LengthPenalty: optional token length penalty coefficient (alpha) as in https://arxiv.org/abs/1609.08144, uses simple length normalization by default (default: None)
  length_penalty?: number;

  // Suppress_Tokens comma-separated list of token ids to suppress during sampling; '-1' will suppress most special characters except common punctuations (default: -1)
  suppress_tokens?: string;

  // Optional text to provide as a prompt for the first window(default: None)
  initial_prompt?: string;

  //condition_on_previous_text: if True, provide the previous output of the model as a prompt for the next window; disabling may make the text inconsistent across windows, but the model becomes less prone to getting stuck in a failure loop (default: True)
  condition_on_previous_text?: boolean;

  // Whether to use half-precision (16-bit) inference (default: True)
  fp16?: boolean;
  //temperature_increment_on_fallback: Temperature to increase when falling back when the decoding fails to meet either of the thresholds below (default: 0.2)
  temperature_increment_on_fallback?: number;

  //compression_ratio_threshold: If the gzip compression ratio is higher than this value, treat the decoding as failed (default: 2.4)
  compression_ratio_threshold?: number;

  //logprob_threshold: If the average log probability is lower than this value, treat the decoding as failed (default: -1.0)
  logprob_threshold?: number;

  //no_speech_threshold: If the probability of the <|nospeech|> token is higher than this value AND the decoding has failed due to `logprob_threshold`,consider the segment as silence (default: 0.6)
  no_speech_threshold?: number;
}
