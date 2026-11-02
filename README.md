# 🧠 NovaAI — Cross-Platform AI Workspace & Inference Analytics

> A high-performance React Native mobile application for prompt engineering, token usage analysis, multi-model cost evaluation (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro), and simulated AI inference.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Jest](https://img.shields.io/badge/Tests-8%20Passing-10B981?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📱 Project Overview

**NovaAI** provides developers, researchers, and product teams with a mobile-first interface for designing structured AI prompts, estimating real-time token footprints, and comparing API inference costs across leading foundation model providers without needing proprietary API keys.

---

## ✨ Key Features

1. **Heuristic Token Counter & Cost Matrix:**
   - Blended character-word heuristic for instant token counting.
   - Live pricing calculation across OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, and Google Gemini 1.5 Pro.
2. **Prompt Template Engineering Engine:**
   - Templating syntax `{{variableName}}` with regex-based interpolation and variable validation.
   - Built-in templates for Code Reviews, B2B Cold Outreach, System Architecture RFCs, and SQL Optimizers.
3. **Session & Message Lifecycle Management:**
   - Message state tracking (`sent`, `streaming`, `completed`, `error`) and token accounting.
4. **Sleek Cyber Dark Design System:**
   - Built from custom design tokens with dark space slate backgrounds, violet accents, and emerald indicators.
5. **Automated Testing Suite:**
   - Unit tests covering token estimation, template variable interpolation, and multi-model cost calculations.

---

## 🏗️ Folder Structure

```text
NovaAI/
├── __tests__/                  # Automated Jest test suites
│   ├── aiEngine.test.ts        # Token calculations & cost models
│   └── mocks/                  # Native mocks for headless CI
├── src/
│   ├── components/             # Reusable UI cards & summaries
│   │   ├── PromptTemplateCard.tsx
│   │   ├── TokenUsageAnalyticsCard.tsx
│   │   └── index.ts
│   ├── data/                   # Prompt templates & model pricing data
│   │   └── mockData.ts
│   ├── theme/                  # Design tokens (colors, typography, shadows)
│   │   └── index.ts
│   ├── types/                  # Strict TypeScript interfaces
│   │   └── index.ts
│   └── utils/                  # Domain business logic & token math
│       ├── aiEngine.ts
│       └── index.ts
├── App.tsx                     # Main showcase screen
├── package.json
└── tsconfig.json
```

---

## 🧪 Running Tests & Typecheck

```bash
# Run unit tests with Jest
npm test

# Run TypeScript strict type verification
npx tsc --noEmit
```

---

## 📄 License
This project is licensed under the MIT License.
