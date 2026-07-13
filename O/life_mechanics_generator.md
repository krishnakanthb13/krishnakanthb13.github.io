---
name: life_mechanics_generator
description: Automatically generates interactive simulators and updates pages/documentation for new Life Mechanics tools inside the O/ directory when provided a folder name containing an info.txt file.
---

# Life Mechanics Generator

Use this skill when the user provides a folder name inside the `O/` directory (e.g., `3N`, `3S`, `3L`, `3P`) that contains an `info.txt` file and requests you to build/add it to the website.

## Workflow Steps

### 1. Read the Source Text
*   Read `O/[folder_name]/info.txt`.
*   Identify the core concept (the "Trilemma" or "Impossible Triad").
*   Identify the three or `N` number of main parameters/states (e.g., Time/Money/Health, Restoration/Autonomy/Obligations).
*   Identify the detailed essay sections and any tables.

### 2. Generate `index.md`
*   Create `O/[folder_name]/index.md`.
*   Format the first key quote in a blockquote block.
*   Format the essay with clean Markdown headers (`#`, `##`, `###`), list items, bold terms, and Markdown tables.

### 3. Generate Interactive `index.html`
*   Create `O/[folder_name]/index.html` similar to `O/3L` and `O/3N`. Use them as reference if required. At the same time get creative with your ways too.
*   **Design Aesthetics**:
    *   Use premium dark mode styling (`#030712` background, smooth gradients, glassmorphic panels).
    *   Use `Outfit` font for headings/UI and `Lora` font for text content.
*   **Interactive Components**:
    *   **Sliders**: Three range sliders corresponding to the trilemma states. Limit total capacity to 200% with auto-balancing logic in JavaScript.
    *   **SVG Triangle Visualizer**: Render a SVG triangle with a dynamic center polygon representing the allocated states.
    *   **Presets / Scenario Buttons**: At least three presets mapping common combinations (e.g., +State1 +State2 -State3).
    *   **Action Plan Output**: Generate a contextual advice paragraph based on which slider is currently dominant.
    *   **Three-Way Toggle Widget**: A dedicated checkbox switch widget where checking a third option automatically toggles off one of the other two, demonstrating the impossible triad.
*   **Content Sections**:
    *   Embed the main quote in a `.quote-block`.
    *   Wrap each deep dive section of the essay in `<details>` and `<summary>` accordion tabs.
    *   Use `.comparison-table` styling for any comparative lists.

### 4. Update the Portal Page (`O/index.html`)
*   Read `O/index.html`.
*   Add a new CSS class `.card-[folder_name]` under the `/* Card Specifics */` section defining a unique `--hover-color` and animation delay.
*   Add a new grid card `<a>` link pointing to the new tool, featuring an appropriate emoji, title, description, and link.

### 5. Update Folder README (`O/README.md`)
*   Read `O/README.md`.
*   Add a bullet point under the `🧭 Life Mechanics Hub` section linking to the new folder, formatted like the other tools.

### 6. Update Root README (`README.md`)
*   Read the root `README.md`.
*   Add the new tool under both:
    1.  The folder structure list for `- **O**: Other Random Things`.
    2.  The file details list under `- **Life Mechanics**: ...`.
