import os
import warnings
from pathlib import Path

import rich_click as click
import torch
import whisper
from whisper.utils import write_vtt


@click.command()
@click.option(
    "--input",
    "-i",
    type=click.Path(),
    required=True,
    help="Audio file to transcribe.",
)
@click.option(
    "--model",
    required=False,
    default="base",
    type=click.Choice(whisper.available_models(), case_sensitive=True),
    show_default=True,
    help=(
        "Model to use. Smaller models are more efficient, but are less accurate."
        " Models that end in '.en' are English-only models."
    ),
)
@click.option(
    "--device",
    required=False,
    default="cuda" if torch.cuda.is_available() else "cpu",
    type=click.Choice(['cuda', 'cpu'], case_sensitive=False),
    show_default=True,
    help="What device to use for PyTorch inference",
)
@click.option(
    "--output_dir",
    "-o",
    required=False,
    default=".",
    show_default=True,
    type=click.Path(),
    help="Where to save output text files",
)
@click.option(
    "--verbose",
    "-v",
    is_flag=True,
    help="Whether to print out the progress and debug messages",
)
@click.option(
    "--task",
    "-t",
    required=False,
    default="transcribe",
    type=click.Choice(['translate', 'transcribe'], case_sensitive=False),
    show_default=True,
    help=(
        "Whether to perform X->X speech recognition ('transcribe')"
        " or X->English translation ('translate')"
    ),
)
@click.option(
    "--language",
    required=False,
    default=None,
    show_default=True,
    type=str,
    help="Language spoken in the audio, specify 'None' to perform language detection",
)
def cli(in_file, model, device, output_dir, verbose, task, language):
    """
    Command line interface for Stage Whisper Python component.
    Uses the whisper package to transcribe and translate audio files,
    as well as format the output text.
    This function is copied and modified from the original whisper CLI
    function at
    https://github.com/openai/whisper/blob/c85eaaa/whisper/transcribe.py#L227
    """
    os.makedirs(output_dir, exist_ok=True)
    if model.endswith(".en") and language != "en":
        warnings.warn(
            f"{model} is an English-only model but '{language}' was selected;"
            f" using English instead."
        )
        language = "en"

    loaded_model = whisper.load_model(model, device=device)
    result = loaded_model.transcribe(in_file, language=language, verbose=verbose)

    audio_basename = Path(in_file).name
    out_file = Path(output_dir) / f"{audio_basename}.vtt"
    # # save TXT
    # with open(os.path.join(output_dir, audio_basename + ".txt"), "w", encoding="utf-8") as txt:
    #     print(result["text"], file=txt)

    # save VTT
    with open(out_file, "w", encoding="utf-8") as vtt:
        write_vtt(result["segments"], file=vtt)

    print(result["text"])


if __name__ == '__main__':
    cli()
