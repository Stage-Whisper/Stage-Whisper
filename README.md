# Stage-Whisper

This is the main repo for Stage Whisper — a free, open-source, and easy-to-use audio transcription app. Stage Whisper uses OpenAI's Whisper machine learning model to produce very accurate transcriptions of audio files, and also allows users to store and edit transcriptions using a simple and intuitive graphical user interface.

## Quickstart

Stage Whisper consists of two connected components:

* A Python backend that interfaces with OpenAI's Whisper library
* A Node/Electron-powered interface

### Prerequisites

The eventual 1.0 release of Stage Whisper will (ideally) not require any additional software. For now, though, you will need the following installed on your machine to develop Stage Whisper. It is currently possible to separately work on the Electron interface or the Python backend, so f you are planning to only work on one or the other, you only have to install the requirements specific to that component.

* [Node](https://nodejs.org/en/) (required for Electron)
* [Yarn](https://yarnpkg.com/) (required for Electron)
* [Python 3.x](https://www.python.org/) (required for backend)
* [Rust](https://www.rust-lang.org/) (required for backend)
* [ffmpeg](https://ffmpeg.org/) (required for backend)
* [Poetry](https://python-poetry.org/) (required for backend)

There's any number of ways to get all these dependencies installed on your workstation, but here is one example of how you might install all of the above on a Mac (skip any step for something you have already installed):

```sh
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python, Node, Rust, ffmpeg, and Yarn
brew install python node rust ffmpeg yarn

# Install Poetry
curl -sSL https://install.python-poetry.org | POETRY_HOME=/etc/poetry python3 -
```

### Running the Python Backend

Install dependencies:

```sh
cd backend
poetry install
```

While the backend's primary purpose will be to run as a service for the Electron app to connect to, it can also be run as a standalone script. To do so, run:

```sh
poetry run python stagewhisper --input /path/to/audio/file.mp3
```

### Running the Electron Interface

```sh
cd electron
yarn
yarn dev
```

## Goal

Earlier this year, [OpenAI](https://openai.com/blog/whisper/) released [Whisper](https://github.com/openai/whisper), its automatic speech recognition (ASR) system that is trained on "680,000 hours of multilingual and multitask supervised data collected from the web." You can learn more by [reading the paper](https://cdn.openai.com/papers/whisper.pdf) [PDF] or looking at the [examples](https://openai.com/blog/whisper/) on OpenAI's website.

As Dan Nguyen [noted on Twitter](https://twitter.com/dancow/status/1572749731704573957), this could be a "godsend for newsrooms."

The only problem, as [@PeterSterne](https://github.com/petersterne) pointed out, is that not all journalists (or others who could benefit from this type of transcription tool) are comfortable with the command line and installing the dependencies required to run Whisper.

Our goal is to package Whisper in an easier to use way so that less technical users can take advantage of this neural net.

Peter came up with the project name, Stage Whisper.

## Who is involved

[@PeterSterne](https://github.com/petersterne) and [@filmgirl](https://github.com/filmgirl) (Christina Warren) created the project, and [@HarrisLapiroff](https://github.com/harrislapiroff) and [@Crazy4Pi314](https://github.com/crazy4pi314) (Sarah Kaiser) are leading the development with [@oenu](https://github.com/oenu) (Adam Newton-Blows) leading frontend development.

We'd love to collaborate with anyone who has ideas about how we could more easily package Whisper and make it easy to use for non-technical users.

## Project Status

The project is currently in the early stages of development. We have a working prototype that uses the [Electron](https://www.electronjs.org/) and [Mantine](https://mantine.dev/) frameworks to create an app that allows users to input audio files, transcribe them using Whisper, and then manage and edit the resulting transcriptions. The app will be available for MacOS, Windows, and Linux. We are currently working on implementing major improvements and hope to release a beta version soon.

- [Request features or ask questions](https://github.com/Stage-Whisper/Stage-Whisper/discussions) on the project discussions on GitHub.
- Find a bug? [Open an issue](https://github.com/Stage-Whisper/Stage-Whisper/issues/choose) so that we can see how we can fix it.
- Want to contribute? Check out our [good first issues](https://github.com/Stage-Whisper/Stage-Whisper/contribute) and our [contributing guide](CONTRIBUTING).
- [Join our Discord server](https://discord.gg/dKp7zpWKVK) to discuss the project's planning and development.

## License

Any code that we distribute will be open sourced and follow the license terms of any of the projects that we are using. Whisper is MIT licensed, but some of its dependencies (FFmpeg) are licensed under different terms. We will be sure to adhere to any/all licensing terms and in the event that we cannot bundle ffmpeg with Stage Whisper, we will make it as easy to obtain as possible for the end-user. Any Stage Whisper-specific code will be licensed under the MIT license.
