# Stage-Whisper
The main repo for Stage Whisper, our easy to use AI transcriber, powered by OpenAI's Whisper

## Quickstart

Install [Poetry](https://python-poetry.org/). Then, from inside this repository:

```sh
poetry install  # Required for first run only
poetry run stagewhisper
```

## Goal

[OpenAI](https://openai.com/blog/whisper/) recently released [Whisper](https://github.com/openai/whisper), its automatic speech recognition (ASR) system that is trained on "680,000 hours of multilingual and multitask supervised data collected from the web." You can learn more by [reading the paper](https://cdn.openai.com/papers/whisper.pdf) [PDF] or looking at the [examples](https://openai.com/blog/whisper/) on OpenAI's website.

As Dan Nguyen [noted on Twitter](https://twitter.com/dancow/status/1572749731704573957), this could be a "godsend for newsrooms."

The only problem, as [@PeterSterne](https://github.com/petersterne) pointed out, is that not all journalists (or others who could benefit from this type of transcription tool) are comfortable with the command line and installing the dependecies requried to run Whisper.

Our goal is to package Whisper in an easier to use way so that less technical users can take advantage of this neural net.

Peter came up with the project name, Stage Whisper.

## Who is involved

Right now [@PeterSterne](https://github.com/petersterne) (Peter Sterne) and [@filmgirl](https://github.com/filmgirl) (Christina Warren) are involved but we'd love to collaborate with anyone who has ideas about how we could more easily package Whisper and make it easy to use for non-technical users.

## Project Status

The project is still in the planning stages (again, contributors are welcome), but we hope to move quickly to getting some sort of MVP available. If another solution becomes available in the interim that usurps our needs, we'll obviously be happy to link to that.

Project planning and contributions will take place here on GitHub, but we'll be happy to talk to people on Slack/Twitter/other channels.

## License

Any code that we distribute will be open sourced and follow the license terms of any of the projects that we are using. Whisper is MIT licensed, but some of its dependencies (ffmpeg) are licensed under different terms. We will be sure to adhere to any/all licensing terms and in the event that we cannot bundle ffmpeg with Stage Whisper, we will make it as easy to obtain as possible for the end-user. Any Stage Whsiper-specific code will be licensed under the MIT license.

