# SaladBind [![Compilation Test](https://github.com/VukkyLtd/SaladBind/actions/workflows/compile-test.yml/badge.svg)](https://github.com/VukkyLtd/SaladBind/actions/workflows/compile-test.yml)

If you want to contribute to SaladBind, please read our [contributing guide](CONTRIBUTING.md).

## Table of Contents

[Features](#Features) <br>
[Installation](#Installation) <br>
[Configuration](#Configuration) <br>
[Miner Setup Guide](#Miner-Setup-Guide) <br>
[Compiling](#Compiling)

**This application is not affiliated with Salad Technologies.** It is made by Vukky Limited, for the entire Salad community.

## Features

- Switch between miners, pools, and algorithms
- Shows only miners and algorithms that are supported by your GPU
- Easy to use interface
- Built-in configuration editor
- Automatic updates, miners and the app itself
- Three methods of setting up SaladBind: scanning for the Rig ID, getting it from your Salad Auth token, and entering your Rig ID manually
- Discord Rich Presence
- No extra programs needed
- Set advanced miner arguments
- Save your advanced miner arguments

## Installation

A video guide can be found here:

[![SaladBind Video Tutorial](https://img.youtube.com/vi/OxFyikoAoco/0.jpg)](https://www.youtube.com/watch?v=OxFyikoAoco)

Head to our [GitHub Releases](https://github.com/VukkyLtd/SaladBind/releases/latest) page, download the latest release for your operating system, and just run it if you're on Windows. **BUT KEEP READING TO LEARN HOW TO SET UP AND USE IT!**

### Platform-specific prerequisites

If you're not on macOS, Linux, or Windows 7, you can skip this section.

#### macOS and Linux

If you are on macOS or Linux, please note that these platforms are untested and you may encounter bugs.

For these platforms, you'll need to run SaladBind from the terminal, due to how SaladBind works. If you need help with using the terminal, don't be afraid to Google a bit - you'll have to use `cd` to be in the same folder that SaladBind is in.

Use these commands to start SaladBind, for macOS or Linux respectively:

```bash
chmod +x ./saladbind-macos # You only need to run this once
./saladbind-macos
```

```bash
chmod +x ./saladbind-linux # You only need to run this once
./saladbind-linux
```

#### Windows 7

**SaladBind does not, by default, support Windows 7. Only use these steps if you know what you are doing.**

However, [you can make a bat file](https://www.wikihow.com/Write-a-Batch-File#Saving-the-Batch-File) with Notepad in the same location as SaladBind to allow it to run, and use it to open SaladBind instead of the exe.

```bat
set NODE_SKIP_PLATFORM_CHECK="1"
saladbind-win
```

### Configuration

Once you start SaladBind for the first time, it'll prompt you to enter your mining details.

You can do this by letting SaladBind search your log file, enter your Salad Auth token, which grabs your Rig ID automatically, or enter your Rig ID manually.

#### Automatic (Read from Salad logs)

SaladBind will search your Salad's log file for your Rig ID and save it automatically.

1. Start mining with the Salad app normally for 5-15 minutes (the "Chopping" stage)
2. Choose Automatic on SaladBind (Read from Salad logs)

#### Automatic (Get with Salad Auth token)

You will be prompted to enter your access token. It is recommended to use a Chromium-based browser like Google Chrome or the new Microsoft Edge.
To get your access token follow these steps:

1. Log in to [https://app.salad.io/](https://app.salad.io)
2. Click the lock symbol in the address bar
3. Open `Cookies` and uncollapse `app-api.salad.io`
4. Look for `sAccessToken` and copy it (right click and click `Select all` as it is very long)
5. Paste the token into the terminal (on Windows, right-click in the SaladBind window to paste)

#### Manual

1. Start mining with the Salad app normally, if you have already been mining for over ~3h you need to restart Salad 
2. Mine for around 5-15 minutes (the "Chopping" stage)
3. Find your Salad logs. A guide can be found [here](https://support.salad.com/hc/en-us/articles/360042215512-How-To-Find-Your-Salad-Log-Files)
4. Search for "rig ID" in the main.log file and copy it. Both Ethermine worker ID and Nicehash rig ID are supported
5. Paste the Rig ID into the terminal (on Windows, right-click in the SaladBind window to paste)

You are now ready to go!

### Miner Setup Guide

If you don't know what miner, algorithm or pool to pick, we have a [handy guide](MINERS.md).

## Compiling

If you don't want to use our pre-compiled binaries you can compile SaladBind yourself. You'll need to install [Node.js](https://nodejs.org/).

1. Clone the repository
2. Open a terminal in the folder and run `npm install`
3. Run `npm run compile` (This may display a warning, but it's safe to ignore it)
4. Your compiled binary will be in the `bin` folder
