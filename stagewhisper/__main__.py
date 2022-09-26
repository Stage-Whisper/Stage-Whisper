from gooey import Gooey, GooeyParser
import wx

# Imports copied from https://github.com/openai/whisper/blob/c85eaaa/whisper/transcribe.py
import argparse
import os
import warnings
import numpy as np
import torch
from whisper.tokenizer import LANGUAGES, TO_LANGUAGE_CODE, get_tokenizer
from whisper.utils import exact_div, format_timestamp, optional_int, optional_float, str2bool, write_vtt

from whisper.transcribe import transcribe


IS_DARK = wx.SystemSettings.GetAppearance().IsUsingDarkBackground()
APPEARANCE_LIGHT = {
    'body_bg_color': '#F5F5F5',
}
APPEARANCE_DARK = {
    'header_bg_color': '#222',
    'body_bg_color': '#222',
    'footer_bg_color': '#222',
    'terminal_panel_color': '#222',
    'terminal_font_color': '#FFF',
    'label_color': '#ffffff',
    'help_color': '#e5e5e5'
}


@Gooey(
    program_name="Stage Whisper",
    tabbed_groups=True,
    **APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT,
)
def cli():
    """
    This function is copied and modified from the original whisper CLI
    function at
    https://github.com/openai/whisper/blob/c85eaaa/whisper/transcribe.py#L227

    This code has been copied in order to modify the arguments to provide
    better hints to Gooey for how to render widgets
    """
    parser = GooeyParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    basic_group = parser.add_argument_group("Basic", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group = parser.add_argument_group("Advanced Options", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)

    from whisper import available_models

    basic_group.add_argument("audio", nargs="+", type=str, help="Audio file(s) to transcribe", widget="MultiFileChooser", gooey_options={**APPEARANCE_DARK, 'full_width': True} if IS_DARK else {**APPEARANCE_LIGHT, 'full_width': True})
    basic_group.add_argument("--model", default="small", choices=available_models(), help="Model to use. Smaller models are more efficient, but are less accurate.", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--device", default="cuda" if torch.cuda.is_available() else "cpu", help="device to use for PyTorch inference", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    basic_group.add_argument("--output_dir", "-o", type=str, default=".", help="directory to save the outputs", widget="DirChooser", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--verbose", type=str2bool, default=True, help="Whether to print out the progress and debug messages", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)

    advanced_group.add_argument("--task", type=str, default="transcribe", choices=["transcribe", "translate"], help="whether to perform X->X speech recognition ('transcribe') or X->English translation ('translate')", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    basic_group.add_argument("--language", type=str, default=None, choices=sorted(LANGUAGES.keys()) + sorted([k.title() for k in TO_LANGUAGE_CODE.keys()]), help="language spoken in the audio, specify None to perform language detection", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)

    advanced_group.add_argument("--temperature", type=float, default=0, help="temperature to use for sampling", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--best_of", type=optional_int, default=5, help="number of candidates when sampling with non-zero temperature", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--beam_size", type=optional_int, default=5, help="number of beams in beam search, only applicable when temperature is zero", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--patience", type=float, default=0.0, help="optional patience value to use in beam decoding, as in https://arxiv.org/abs/2204.05424, the default (0.0) is equivalent to not using patience", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--length_penalty", type=float, default=None, help="optional token length penalty coefficient (alpha) as in https://arxiv.org/abs/1609.08144, uses simple lengt normalization by default", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)

    advanced_group.add_argument("--suppress_tokens", type=str, default="-1", help="comma-separated list of token ids to suppress during sampling; '-1' will suppress most special characters except common punctuations", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--fp16", type=str2bool, default=True, help="whether to perform inference in fp16; True by default", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)

    advanced_group.add_argument("--temperature_increment_on_fallback", type=optional_float, default=0.2, help="temperature to increase when falling back when the decoding fails to meet either of the thresholds below", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--compression_ratio_threshold", type=optional_float, default=2.4, help="if the gzip compression ratio is higher than this value, treat the decoding as failed", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--logprob_threshold", type=optional_float, default=-1.0, help="if the average log probability is lower than this value, treat the decoding as failed", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)
    advanced_group.add_argument("--no_speech_threshold", type=optional_float, default=0.6, help="if the probability of the <|nospeech|> token is higher than this value AND the decoding has failed due to `logprob_threshold`, consider the segment as silence", gooey_options=APPEARANCE_DARK if IS_DARK else APPEARANCE_LIGHT)

    args = parser.parse_args().__dict__
    model_name: str = args.pop("model")
    output_dir: str = args.pop("output_dir")
    device: str = args.pop("device")
    os.makedirs(output_dir, exist_ok=True)

    if model_name.endswith(".en") and args["language"] != "en":
        warnings.warn(f"{model_name} is an English-only model but receipted '{args['language']}'; using English instead.")
        args["language"] = "en"

    temperature = args.pop("temperature")
    temperature_increment_on_fallback = args.pop("temperature_increment_on_fallback")
    if temperature_increment_on_fallback is not None:
        temperature = tuple(np.arange(temperature, 1.0 + 1e-6, temperature_increment_on_fallback))
    else:
        temperature = [temperature]

    from whisper import load_model
    model = load_model(model_name, device=device)

    for audio_path in args.pop("audio"):
        result = transcribe(model, audio_path, temperature=temperature, **args)

        audio_basename = os.path.basename(audio_path)

        # save TXT
        with open(os.path.join(output_dir, audio_basename + ".txt"), "w", encoding="utf-8") as txt:
            print(result["text"], file=txt)

        # save VTT
        with open(os.path.join(output_dir, audio_basename + ".vtt"), "w", encoding="utf-8") as vtt:
            write_vtt(result["segments"], file=vtt)


if __name__ == '__main__':
    cli()
