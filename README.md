# Pre-Flight VS-Code extension
##### Author: Zachary Cauchi

## What is this project?
The aims of this project are to provide a tool with which end-users can create and plan out 'interactive to-do lists' in their code where manual execution is required and such tasks cannot be automated. This tool will be implemented as an extension to the Visual Studio Code editor

This was initially a code-[kata](http://codekata.com/) to practice development of a publically available open-source project in as close a format to real-life projects as possible, while at the same time possibly helping my work colleagues.

## Who is responsible
As of writing, this is a one-person project with me being the key holder of the work.

## High-level details
The project is written primarily in Typescript seeing as it's the language of choice by vscode.

### Testing
[TODO] Add testing guidelines and procedures

### Style
The style used is strict Typescript.
[TODO] Elaborate on style used

The following acts as reference to the general guidelines for the maintenance of the project through conventions, guidelines, etc.

## Dev installation
To install, the following programs must be present on the dev machine for development:
- Visual Studio Code
- NodeJS
- Git

Once installed, clone the repository to the dev machine and run `npm install` inside the directory from a command terminal. This should set up all remaining dependencies for the project.

## Running the extension (dev)
To run the extension from Visual Studio Code, press F5 to build and run the extension in a newly-opened VSCode instance.

If built correctly, a new VSCode window should open, and the command 'Hello World' should be present in the Command Palette (open the palette by pressing `Ctrl+Shift+P`)
