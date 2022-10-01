// Get example vtt file

import { spawn } from 'child_process';
import { ipcMain, IpcMainInvokeEvent } from 'electron';

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
  output_dir: string;

  // Verbose: Whether to print out the progress and debug messages (default: True)
  verbose?: boolean;

  // Task: Whether to perform X->EN speech
  task?: 'transcribe' | 'translate';

  // Language: Language spoken in the audio, specify None to perform language detection (default: None)
  language?:
    | 'Afrikaans'
    | 'Albanian'
    | 'Amharic'
    | 'Arabic'
    | 'Armenian'
    | 'Assamese'
    | 'Azerbaijani'
    | 'Bashkir'
    | 'Basque'
    | 'Belarusian'
    | 'Bengali'
    | 'Bosnian'
    | 'Breton'
    | 'Bulgarian'
    | 'Burmese'
    | 'Castilian'
    | 'Catalan'
    | 'Chinese'
    | 'Croatian'
    | 'Czech'
    | 'Danish'
    | 'Dutch'
    | 'English'
    | 'Estonian'
    | 'Faroese'
    | 'Finnish'
    | 'Flemish'
    | 'French'
    | 'Galician'
    | 'Georgian'
    | 'German'
    | 'Greek'
    | 'Gujarati'
    | 'Haitian'
    | 'Haitian Creole'
    | 'Hausa'
    | 'Hawaiian'
    | 'Hebrew'
    | 'Hindi'
    | 'Hungarian'
    | 'Icelandic'
    | 'Indonesian'
    | 'Italian'
    | 'Japanese'
    | 'Javanese'
    | 'Kannada'
    | 'Kazakh'
    | 'Khmer'
    | 'Korean'
    | 'Lao'
    | 'Latin'
    | 'Latvian'
    | 'Letzeburgesch'
    | 'Lingala'
    | 'Lithuanian'
    | 'Luxembourgish'
    | 'Macedonian'
    | 'Malagasy'
    | 'Malay'
    | 'Malayalam'
    | 'Maltese'
    | 'Maori'
    | 'Marathi'
    | 'Moldavian'
    | 'Moldovan'
    | 'Mongolian'
    | 'Myanmar'
    | 'Nepali'
    | 'Norwegian'
    | 'Nynorsk'
    | 'Occitan'
    | 'Panjabi'
    | 'Pashto'
    | 'Persian'
    | 'Polish'
    | 'Portuguese'
    | 'Punjabi'
    | 'Pushto'
    | 'Romanian'
    | 'Russian'
    | 'Sanskrit'
    | 'Serbian'
    | 'Shona'
    | 'Sindhi'
    | 'Sinhala'
    | 'Sinhalese'
    | 'Slovak'
    | 'Slovenian'
    | 'Somali'
    | 'Spanish'
    | 'Sundanese'
    | 'Swahili'
    | 'Swedish'
    | 'Tagalog'
    | 'Tajik'
    | 'Tamil'
    | 'Tatar'
    | 'Telugu'
    | 'Thai'
    | 'Tibetan'
    | 'Turkish'
    | 'Turkmen'
    | 'Ukrainian'
    | 'Urdu'
    | 'Uzbek'
    | 'Valencian'
    | 'Vietnamese'
    | 'Welsh'
    | 'Yiddish'
    | 'Yoruba';
  // | 'af'
  // | 'am'
  // | 'ar'
  // | 'as'
  // | 'az'
  // | 'ba'
  // | 'be'
  // | 'bg'
  // | 'bn'
  // | 'bo'
  // | 'br'
  // | 'bs'
  // | 'ca'
  // | 'cs'
  // | 'cy'
  // | 'da'
  // | 'de'
  // | 'el'
  // | 'en'
  // | 'es'
  // | 'et'
  // | 'eu'
  // | 'fa'
  // | 'fi'
  // | 'fo'
  // | 'fr'
  // | 'gl'
  // | 'gu'
  // | 'ha'
  // | 'haw'
  // | 'hi'
  // | 'hr'
  // | 'ht'
  // | 'hu'
  // | 'hy'
  // | 'id'
  // | 'is'
  // | 'it'
  // | 'iw'
  // | 'ja'
  // | 'jw'
  // | 'ka'
  // | 'kk'
  // | 'km'
  // | 'kn'
  // | 'ko'
  // | 'la'
  // | 'lb'
  // | 'ln'
  // | 'lo'
  // | 'lt'
  // | 'lv'
  // | 'mg'
  // | 'mi'
  // | 'mk'
  // | 'ml'
  // | 'mn'
  // | 'mr'
  // | 'ms'
  // | 'mt'
  // | 'my'
  // | 'ne'
  // | 'nl'
  // | 'nn'
  // | 'no'
  // | 'oc'
  // | 'pa'
  // | 'pl'
  // | 'ps'
  // | 'pt'
  // | 'ro'
  // | 'ru'
  // | 'sa'
  // | 'sd'
  // | 'si'
  // | 'sk'
  // | 'sl'
  // | 'sn'
  // | 'so'
  // | 'sq'
  // | 'sr'
  // | 'su'
  // | 'sv'
  // | 'sw'
  // | 'ta'
  // | 'te'
  // | 'tg'
  // | 'th'
  // | 'tk'
  // | 'tl'
  // | 'tr'
  // | 'tt'
  // | 'uk'
  // | 'ur'
  // | 'uz'
  // | 'vi'
  // | 'yi'
  // | 'yo'
  // | 'zh'

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

export default ipcMain.handle('run-whisper', async (_event: IpcMainInvokeEvent, args: WhisperArgs) => {
  const { inputPath, output_dir } = args;
  console.log('Running whisper script');
  console.log('args: ', args);
  console.log('event: ', _event);

  // const out = spawn('whisper', ['--model', 'base.en', '--output_dir', join(__dirname, '../src/debug/data')]);
  const out = spawn('whisper', [inputPath, '--model', 'base.en', '--output_dir', output_dir]);

  out.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  out.stderr.on('data', (err) => {
    console.log(`stderr: ${err}`);
  });
  out.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});
