---
name: script-bug-reference-skill
description: A comprehensive reference guide and checklist to detect, debug, and fix common errors, edge cases, and design flaws in Windows Batch (.bat) and Linux Shell (.sh) scripts.
author: Antigravity
version: 1.0.0
tags:
  - scripting
  - bash
  - batch
  - debugging
  - devops
---

# Shell and Batch Script Debugging & Best Practices Skill

This document serves as a standardized reference card ("skill") for checking, writing, and debugging script code. It compiles common pitfalls, critical bugs, security risks, and optimization patterns for both Windows Batch (`.bat`/`.cmd`) and Linux Shell (`.sh`) environments.

---

## 📂 Windows Batch (`.bat`) Pitfalls & Best Practices

### 1. Missing Delayed Expansion (`setlocal enabledelayedexpansion`)
* **The Problem:** Variables inside complex blocks (like `if` statements, `for` loops, or group blocks enclosed in parentheses) are evaluated once when the block is parsed, not when it executes. This leads to empty values or incorrect evaluations.
* **Bad Example:**
  ```batch
  set "CHOICE=1"
  if "%CHOICE%"=="1" (
      set /p "SCHOICE=Enter choice: "
      if "%SCHOICE%"=="2" (  :: ERROR: %SCHOICE% is empty/not updated yet!
          echo Doing something...
      )
  )
  ```
* **Good Example:**
  ```batch
  @echo off
  setlocal enabledelayedexpansion
  set "CHOICE=1"
  if "!CHOICE!"=="1" (
      set /p "SCHOICE=Enter choice: "
      if "!SCHOICE!"=="2" (  :: Correct: Using ! for runtime evaluation
          echo Doing something...
      )
  )
  ```

### 2. Path Handling with Spaces & Quotes
* **The Problem:** Hardcoded paths containing spaces will break if not properly encapsulated in double quotes. Conversely, appending quotes to variables that already contain them creates double-quoting issues.
* **Bad Example:**
  ```batch
  set SAVE_DIR=D:\My Videos  :: Typo/space issue
  cd %SAVE_DIR%              :: Fails due to unquoted space
  ```
* **Good Example:**
  ```batch
  set "SAVE_DIR=D:\My Videos"
  if not exist "%SAVE_DIR%" mkdir "%SAVE_DIR%"
  ```

### 3. Argument/Flag Splitting inside Variables
* **The Problem:** Storing multiple flags or parameters as a single variable with spaces can cause them to be evaluated as a single, quoted string rather than distinct arguments.
* **Bad Example:**
  ```batch
  set "SUBFLAGS=--write-subs --write-auto-subs --sub-langs all"
  yt-dlp "%SUBFLAGS%"  :: Passes the whole string as one argument (fails)
  ```
* **Good Example:**
  ```batch
  :: Use conditional execution or pass flags unquoted if safe:
  if "%SUBLANG%"=="all" (
      yt-dlp --write-subs --write-auto-subs --sub-langs all "%URL%"
  )
  ```

### 4. Empty Variable Handling
* **The Problem:** If a variable is empty, comparing it using bare `%VAR%` syntax will cause syntax errors because the parser sees `"" == ""`.
* **Bad Example:**
  ```batch
  if %URL%== (echo Error)
  ```
* **Good Example:**
  ```batch
  if "%URL%"=="" (echo Error)
  ```

### 5. Dependency Verification
* **The Problem:** Running utilities (e.g., `yt-dlp`, `ffmpeg`, `python`) without confirming they are present in the system's `PATH`.
* **Good Example:**
  ```batch
  where yt-dlp >nul 2>&1
  if %errorlevel% neq 0 (
      echo ERROR: yt-dlp is not installed.
      exit /b 1
  )
  ```

---

## 🐧 Linux Shell (`.sh`) Pitfalls & Best Practices

### 1. Unquoted Variables (Word Splitting & Globbing)
* **The Problem:** References like `$VAR` or `$@` without double quotes are subject to word splitting and filename expansion, leading to major bugs and security risks (e.g., path injection).
* **Bad Example:**
  ```bash
  if [ -d $SAVE_DIR ]; then
      rm -rf $SAVE_DIR
  fi
  ```
* **Good Example:**
  ```bash
  if [ -d "$SAVE_DIR" ]; then
      rm -rf "$SAVE_DIR"
  fi
  ```

### 2. Failure Detection (`set -euo pipefail` & Traps)
* **The Problem:** By default, bash scripts continue executing even if a command fails, masking critical errors.
* **Good Example:**
  ```bash
  #!/bin/bash
  set -euo pipefail
  trap 'echo "Error encountered. Exiting..."; exit 1' ERR
  ```

### 3. Check Command/Dependency Existence
* **The Problem:** Using `which` (non-standard across all distributions) or omitting tests entirely.
* **Good Example:**
  ```bash
  if ! command -v yt-dlp >/dev/null 2>&1; then
      echo "ERROR: yt-dlp is not installed." >&2
      exit 1
  fi
  ```

### 4. Race Conditions in Directory Checks
* **The Problem:** Checking directory existence before creation is vulnerable to TOCTOU (Time-of-check to time-of-use) race conditions.
* **Good Example:**
  ```bash
  # Just run mkdir -p and check exit status directly:
  mkdir -p "$SAVE_DIR" || { echo "ERROR: Cannot create directory" >&2; exit 1; }
  ```

### 5. Script Directory Resolution
* **The Problem:** Hardcoding relative paths or running the script from other directories can cause file reference errors.
* **Good Example:**
  ```bash
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  cd "$SCRIPT_DIR" || exit 1
  ```

### 6. Executable Permissions & Execution Method
* **The Problem:** Relying on `./script.sh` requires manual executable bits (`chmod +x`).
* **Good Example:** Recommend or use `bash script.sh` to run, which side-steps permission problems.

---

## 🔍 Code Review & Verification Checklist

- [ ] **Delayed Expansion:** Check if batch scripts modify variables inside loops or conditions and use `!` instead of `%`.
- [ ] **Variable Quoting:** Are all file paths, user inputs, and URLs enclosed in double quotes?
- [ ] **Error Handling:** Does the shell script use `set -euo pipefail` or check the exit codes (`$?` or `||` logic)?
- [ ] **Dependency Check:** Are external binaries (`ffmpeg`, `yt-dlp`, `curl`) verified with `where` / `command -v`?
- [ ] **Stderr Redirection:** Are errors printed to stderr using `>&2`?
- [ ] **Empty String Safety:** Are empty inputs checked safely (`if [ -z "$VAR" ]` or `if "%VAR%"==""`)?
