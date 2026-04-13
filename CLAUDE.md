# JLPTExplorer — CLAUDE.md

## Language

All code, comments, variable names, commit messages, and file names must be written in **English**. Conversations with Claude may be in French.

## Project overview

JLPTExplorer is a Japanese grammar learning app similar to Bunpro, but focused on contextual examples from video games and anime. Each grammar point (JLPT N5–N1) is illustrated by YouTube video clips extracted from games or anime, showing the grammar in real use.

## Tech stack

### Frontend (`/www-jlptexplorer`)

- **Framework:** Next.js 16 (App Router) + React 19
- **UI:** Mantine 8 + Tabler Icons
- **i18n:** next-intl (messages in `src/messages/en.json` and `fr.json`, routes under `app/[lang]/`)
- **Language:** TypeScript 5.9
- **Package manager:** yarn 4
- **Testing:** Jest + Testing Library
- **Storybook:** for component development
- **Linting:** ESLint + Stylelint + Prettier

### Backend (`/rest-jlptexplorer`)

- **Framework:** NestJS 11 (Express platform)
- **ORM:** Prisma 7 (same multi-file schema, `@prisma/adapter-pg`)
- **Validation:** class-validator + class-transformer (ValidationPipe)
- **API docs:** Swagger UI (`@nestjs/swagger`, available at `/docs`)
- **Auth:** ApiKeyGuard (`x-api-key` header, `timingSafeEqual`)
- **Database:** PostgreSQL
- **Language:** TypeScript (`module: nodenext`, CommonJS output)
- **Package manager:** npm
- **Testing:** Jest (unit tests with mocked dependencies)

## Project structure

```
jlptexplorer-fullstack/
├── www-jlptexplorer/
│   └── src/
│       ├── app/[lang]/                  ← Next.js App Router (i18n routes)
│       │   ├── page.tsx                 ← Home page
│       │   ├── layout.tsx               ← i18n + Mantine + SettingsProvider
│       │   ├── grammar-points/
│       │   │   ├── page.tsx             ← Grammar points list
│       │   │   └── [slug]/page.tsx      ← Grammar point detail
│       │   ├── sources/
│       │   │   ├── page.tsx             ← Sources list
│       │   │   └── [slug]/page.tsx      ← Source detail
│       │   └── scenes/page.tsx          ← Scenes with filters
│       ├── components/
│       │   ├── ui/                      ← Presentational: ColorSchemeToggle, SettingsDrawer
│       │   ├── layout/                  ← Structural: Header, Footer, Navbar, Layout
│       │   └── features/                ← Feature components grouped by domain
│       │       ├── grammar/             ← AnnotatedText, GrammarPointHeader, GrammarPointsList, GrammarPointsMultiSelect
│       │       ├── scenes/              ← SceneCard, ScenesGrid, YoutubePlayer
│       │       └── sources/             ← SourceHeader, SourcesList, SourcesMultiSelect
│       │           └── ComponentName/
│       │               ├── ComponentName.tsx
│       │               ├── ComponentName.test.tsx
│       │               ├── ComponentName.story.tsx
│       │               └── ComponentName.module.css
│       ├── contexts/
│       │   └── SettingsContext.tsx      ← User preferences (localStorage)
│       ├── hooks/
│       │   ├── useApiData.ts            ← Generic API data fetching hook
│       │   └── useQueryParam.ts         ← Query parameter management
│       ├── lib/
│       │   └── api/                     ← Domain-split API modules
│       │       ├── client.ts            ← Base apiFetch wrapper
│       │       ├── types.ts             ← All TypeScript API types
│       │       ├── grammar-points.ts
│       │       ├── scenes.ts
│       │       ├── sources.ts
│       │       └── speakers.ts
│       ├── messages/
│       │   ├── en.json                  ← UI strings (English)
│       │   └── fr.json                  ← UI strings (French)
│       ├── constants/
│       │   └── jlpt.ts                  ← JLPT level color mapping
│       └── theme.ts                     ← Mantine theme config
└── rest-jlptexplorer/                   ← backend
    ├── src/
    │   ├── main.ts                      ← NestJS entry (port 8080)
    │   ├── app.module.ts                ← Root module (imports all domain modules)
    │   ├── prisma/                      ← PrismaService (@Global module)
    │   ├── common/
    │   │   ├── guards/api-key.guard.ts  ← x-api-key header guard
    │   │   └── filters/prisma-exception.filter.ts
    │   ├── sources/                     ← controller / service / repository / dto
    │   ├── scenes/
    │   ├── grammar-points/
    │   ├── speakers/
    │   ├── transcript-lines/
    │   ├── transcript-line-grammar-points/
    │   └── utils/                       ← parse-time, flatten
    ├── prisma/
    └── prisma.config.ts
```

## Backend API structure

```
/api/v1/
├── /{locale}/               ← Public locale-scoped routes (read-only)
│   ├── /sources             GET (filterable by type, grammar_points, grammar_match)
│   ├── /sources/{slug}      GET
│   ├── /scenes              GET (filterable by source, grammar, jlpt_level, grammar_match; paginated)
│   ├── /grammar-points      GET (filterable by jlpt_level)
│   ├── /speakers            GET
│   └── /transcript-lines    GET (filterable by scene_id, speaker_slug, grammar_points; enriched with source, speaker, grammar points)
├── /scenes                  POST, PUT, PATCH, DELETE (admin)
├── /sources                 POST, PUT, PATCH, DELETE (admin)
├── /speakers                POST, PUT, PATCH, DELETE (admin)
├── /transcript-lines        POST, PUT, PATCH, DELETE (admin)
└── /transcript-line-grammar-points  POST, PATCH, DELETE (admin)
```

## Key architectural decisions

- **Prisma v7** requires `@prisma/adapter-pg` for direct PostgreSQL connections — no `url` in schema files, configured via `prisma.config.ts`
- **Multi-file Prisma schema** in `prisma/schema/` (one file per domain, 11 files total including translations)
- **Generated client** goes to `node_modules/@prisma/client` (default output — not a custom path); rebuild with `npm run db:generate`
- Always use `npm run db:*` scripts instead of `npx prisma` directly (ensures local Prisma version is used)
- **NestJS layered architecture**: controller → service → repository (one file per layer per resource); `@Global() PrismaModule` makes PrismaService available everywhere
- **NestJS cross-module deps**: repositories are exported from their module and imported by modules that need them (e.g. `ScenesModule` imports `SourcesModule`, `GrammarPointsModule`, `SpeakersModule`)
- **NestJS enum validation**: use Prisma enums (`jlpt_level`, `source_type`) directly in DTOs with `@IsIn(Object.values(enum))` — avoids duplicate type definitions and keeps service/DTO types aligned
- **Path alias `@/`** available in both `www-jlptexplorer` (`src/`) and `rest-jlptexplorer` (`src/`)
- **i18n** via next-intl: all www-jlptexplorer routes under `app/[lang]/`, messages in `src/messages/`
- **SettingsContext** manages 5 user preferences in localStorage: speaker name language, source title language, dialogue translations visibility, grammar point script (romaji/kana), grammar match mode (`scene` | `transcript_line`)
- **`grammar_match`** query param on `/scenes` and `/sources`: `scene` returns scenes that have at least one grammar match anywhere in their transcript lines; `transcript_line` filters by individual line
- `transcript_lines.japanese_text` — field was renamed from `text` to `japanese_text`

## Dev commands

### Backend (`/rest-jlptexplorer`)

```bash
npm run start:dev    # start with hot reload (nest start --watch)
npm run build        # compile TypeScript (nest build)
npm run test         # run unit tests (jest)
npm run lint         # eslint with auto-fix
npm run db:generate  # regenerate Prisma client after schema changes
npm run db:migrate   # create and apply a migration
npm run db:studio    # open Prisma Studio
```

### Frontend (`/www-jlptexplorer`)

```bash
yarn dev             # start Next.js dev server
yarn build           # production build
yarn test            # lint + typecheck + jest
yarn jest            # run tests only
yarn storybook       # component dev
```

## Git conventions

### Commit format

```
type(scope): description
```

- Lowercase, no period at end
- **Types:** `feat`, `fix`, `refactor`, `chore`, `docs`
- **Scopes:** `www-jlptexplorer`, `rest-jlptexplorer` (omit for root-only changes)
- **One commit per scope** — never mix www-jlptexplorer, rest-jlptexplorer, and root changes in a single commit. If a task touches multiple scopes, create one commit per scope.

### Branches

Never commit directly to `main`. Always work on a separate branch — if currently on `main`, create and switch to a new branch before making any code changes. Branch format:

```
type-NNNNN/branch-description
```

Example: `feat-00003/setup-prisma-models`

Before creating a new branch, always run `git branch` to find the latest branch index and increment it by one.

Use git switch and never git checkout. `git switch -C` allows you to create a branch and switch to it while `git switch` switches to a branch.

## Scene payload grammar point resolution

When given a scene payload in **simplified input format**, convert it to **full format** by identifying grammar points in each Japanese transcript line, resolving them to their `matched_form`, and automatically adding translations.

### Input vs output format

**Input** (what the user provides — no `grammar_points` field, no `translations` field):

```json
{
  "source_slug": "dragon-ball-z",
  "episode_number": 129,
  "youtube_video_id": "LzHaHLdpOVI",
  "start_time": "1:57",
  "end_time": "2:28",
  "transcript_lines": [
    {
      "start_time": "2:02",
      "speaker_slug": "krillin",
      "text": "超サイヤ人は穏やかな心を持っていないとなれなかったんじゃないのか？"
    }
  ]
}
```

**Output** (what must be produced — `grammar_points` becomes an array of `{ slug, start_index, end_index, matched_form }` objects):

```json
{
  "source_slug": "dragon-ball-z",
  "episode_number": 129,
  "youtube_video_id": "LzHaHLdpOVI",
  "start_time": "1:57",
  "end_time": "2:28",
  "transcript_lines": [
    {
      "start_time": "2:02",
      "speaker_slug": "krillin",
      "text": "超サイヤ人は穏やかな心を持っていないとなれなかったんじゃないのか？",
      "translations": {
        "en": "Wasn't it said that you can't become a Super Saiyan without having a calm heart?",
        "fr": "N'était-il pas dit que tu ne peux pas devenir un Super Saiyan sans avoir un coeur calme ?"
      },
      "grammar_points": [
        {
          "slug": "wa-topic",
          "start_index": 5,
          "end_index": 6,
          "matched_form": "は"
        },
        {
          "slug": "wo-object",
          "start_index": 11,
          "end_index": 12,
          "matched_form": "を"
        },
        {
          "slug": "te-iru",
          "start_index": 12,
          "end_index": 18,
          "matched_form": "持っていない"
        },
        {
          "slug": "nai-negative",
          "start_index": 12,
          "end_index": 18,
          "matched_form": "持っていない"
        },
        {
          "slug": "to-conditional",
          "start_index": 18,
          "end_index": 19,
          "matched_form": "と"
        },
        {
          "slug": "naru",
          "start_index": 19,
          "end_index": 25,
          "matched_form": "なれなかった"
        },
        {
          "slug": "rareru-potential",
          "start_index": 19,
          "end_index": 25,
          "matched_form": "なれなかった"
        },
        {
          "slug": "nai-negative",
          "start_index": 19,
          "end_index": 25,
          "matched_form": "なれなかった"
        },
        {
          "slug": "ta-past",
          "start_index": 19,
          "end_index": 25,
          "matched_form": "なれなかった"
        }
      ]
    }
  ]
}
```

### Index format

- Indices are **0-based**, **end_index is exclusive**: `text.slice(start_index, end_index) === matched_form`
- Count every character (hiragana, katakana, kanji, punctuation, fullwidth chars) as **1 index unit**
- Always verify by manually counting characters before outputting
- **Never use a naïve indexOf** — use grammatical context to find the correct occurrence. Example: `da-desu` in `父はただ笑うだけだ。` → the copula だ is at index 8 (sentence-final), NOT index 3 (inside ただ) or index 6 (inside だけ)

### Translations

**Always auto-generate translations** for every transcript line. Add a `translations` field with `en` and `fr` keys. The user will never provide this field in the input — always add it yourself based on the Japanese text and context (source title, episode, speaker).

### Multiple occurrences rule

List each slug **once** in the input. If the grammar point appears multiple times in the text (e.g., two verbs in past tense), output **one entry per occurrence** with its own start_index/end_index/matched_form. Example: `"ta-past"` in `俺はただひたすら強くなることを願った｡そしてすさまじい特訓を繰り返したさ｡` → two entries: one for `願った` (start 15, end 18) and one for `繰り返した` (start 30, end 35).

### Matched form conventions

| Grammar type                 | matched_form                                                    |
| ---------------------------- | --------------------------------------------------------------- |
| Standalone particle          | Just the particle character(s): が、は、を、に、で、と、さ etc. |
| Copula                       | Full copula form: だ、だった、です、でした                      |
| Verb conjugation             | Full inflected verb from stem start through all suffixes        |
| Nominalizer / sentence-final | The specific form: こと、んだ、のだ etc.                        |

**Shared span**: when multiple grammar points cover the same morphological unit (e.g. `なれなかった` covers `naru` + `rareru-potential` + `nai-negative` + `ta-past`), they all share the **same start_index, end_index, and matched_form**.

### Grammar point slug → matching rules

#### が — two distinct uses

**`ga-subject-marker`** (matched_form = `が`): が that follows a **noun, pronoun, or nominalized clause** to mark it as the grammatical subject of the predicate. Example: 時間がない → が after 時間 (noun) is subject marker.

**`ga-conjunction`** (matched_form = `が`): が that follows a **predicate** (verb, adjective, or copula) at the end of a clause, connecting two contrasting clauses with a "but/however" meaning. Example: 行きたいが、忙しい → が follows the predicate 行きたい.

**Disambiguation rule**: the key distinction is what precedes が:

- が after a **noun/pronoun** → `ga-subject-marker`
- が after a **predicate** (verb/adj/copula ending) → `ga-conjunction`

If both slugs are listed and the sentence contains two が (one of each type), assign each slug to the correct occurrence.

#### は — topic marker only

**`wa-topic`** (matched_form = `は`): standalone topic/contrast は directly after a noun or pronoun.

**Do NOT tag は that appears inside**:

- ではない / じゃない (part of negative copula → use `de-wa-nai`)
- には (directional/locative compound → use `ni-wa` if that slug is listed)
- ては / ては (conditional compound → use `te-wa` if listed)
- ままでは, までは, からは etc. (compound postpositions)

#### を — object marker

**`wo-object`** (matched_form = `を`): virtually no false positives. を is almost exclusively the object marker in modern Japanese. Tag every を.

#### も — also/even

**`mo-also`** (matched_form = `も`): standalone も replacing が/は/を. **Do NOT tag も inside ても** (use `temo` slug instead) or in compounds like どこも、何も when those form a different construction.

#### と — four distinct uses (matched_form always `と`)

The user specifies the correct slug. Find the と matching that grammatical role:

- `to-listing`: と connecting two nouns (AとB = "A and B")
- `to-together-with`: と meaning "together with" a person/entity (matched_form = `と` only — do NOT include the preceding noun). Example: フリーザとの戦い → matched_form = `と`
- `to-conditional`: と before a verb expressing inevitable/habitual condition ("when/if X, then Y" — non-volitional result)
- `to-quotation`: と after quoted speech or thought, before 言う、思う、聞こえる etc.

If two と appear in one line with different slugs listed (e.g. `to-listing` and `to-conditional`), assign each to the correct occurrence.

#### に — location/direction/time/agent

matched_form = `に`. The user specifies the semantic slug:

- `ni-direction`: に after movement verb target (東京に行く)
- `ni-location`: に with existence verbs (机の上にある)
- `ni-time`: に after time expression (三時に)
- `ni-agent`: に marking passive agent (〜に〜られる)
- `ni-purpose`: に before しに行く / しに来る (purpose of movement)

Do NOT tag に inside: になる (if `naru` is the listed slug, the に is included in the matched_form of になる); には (if `ni-wa` slug is listed).

#### で — location/means/cause (vs copula て-form)

**Critical**: で has two completely different origins:

- **Particle で** (matched_form = `で`): marks location of action, means/instrument, cause, scope
  - Slugs: `de-location`, `de-means`, `de-cause`
- **Copula て-form で**: the て-form of だ used to connect clauses (穏やかで = "calm and..."). This is NOT a particle.
  - Slug: `de-te-form` (matched_form = `で` at end of na-adjective/noun)

Always distinguish based on what precedes で: if it follows a na-adjective or noun as a clause connector, it is the copula て-form. If it follows a noun marking location/means/duration, it is the particle.

**Copula て-form で (clause connector after na-adj/noun) has no slug — always ignore it** (e.g. 穏やかで、静かで). Only applies to this specific case. The particle で (means, location, duration) uses `de-means-of`, `de-location` etc. and must NOT be ignored. Likewise, で inside ても、ている、てから etc. is part of those grammar points and is not affected by this rule.

#### の — possessive vs nominalizer vs subject marker vs のこと

- `no-possessive` (matched_form = `の`): の between two nouns (or adverbial modifier + noun) marking possession or attribution. Example: それほどの有名人 → `no-possessive`
- `no-nominalizer` (matched_form = `の`): の nominalizing a verb clause (〜のが、〜のを、〜のは)
- `no-subject` (matched_form = `の`): の replacing が as subject marker inside a relative/subordinate clause. Key test: can you replace の with が and preserve the meaning? Example: 悔いの無いように = 悔いが無いように → `no-subject`. Distinct from `ga-subject-marker` (which uses matched_form = `が`).
- `no-koto-as-for` (matched_form = `のこと`): noun + のこと meaning "about/regarding [noun]". Example: あの男のことは = "about that man". Span covers の + こと. **Do NOT tag as `no-possessive`** — のこと is a fixed expression, not a simple possessive modifier.

**Disambiguation `no-possessive` vs `no-subject`**: if の connects two nouns as attribute/possession → `no-possessive`. If の is inside a relative clause and can be swapped for が → `no-subject`.

**Do NOT tag の inside**: のに (use `noni-although`), ので (use `node-because`), のだ/んだ (use `no-da-explanatory`), ものの、ものだ etc.

#### か — question particle

**`ka-question`** (matched_form = `か`): sentence-final か or embedded question か (〜かどうか、〜か知らない).

**Do NOT tag か inside**: だから (conjunction), どこか (indefinite pronoun), なぜか, etc.

#### や — listing

**`ya-listing`** (matched_form = `や`): や between nouns in an inexhaustive list.

**Do NOT tag や inside**: やはり / やっぱり (adverb), phrases where や is part of a word.

#### Sentence-final particles (almost no false positives)

- `ne-ne` → ね (matched_form = `ね`): always sentence-final
- `yo-yo` → よ (matched_form = `よ`): always sentence-final
- `sa-sa` → さ (matched_form = `さ`): sentence-final さ. **Do NOT tag さ inside content words** like 大きさ (→ use `sa-nominalization` slug for that)

#### Copula — `da-desu`

Each occurrence gets its own entry. matched_form = the exact form found:

| Form            | matched_form                    | Slugs (same span)                      |
| --------------- | ------------------------------- | -------------------------------------- |
| Plain non-past  | `だ`                            | `da-desu`                              |
| Polite non-past | `です`                          | `da-desu`                              |
| Plain past      | `だった`                        | `da-desu` + `ta-past`                  |
| Polite past     | `でした`                        | `da-desu` + `ta-past`                  |
| Formal          | `である`                        | `da-desu`                              |
| Negative        | `ではない` / `じゃない`         | `da-desu` + `nai-negative`             |
| Negative past   | `ではなかった` / `じゃなかった` | `da-desu` + `nai-negative` + `ta-past` |

**じゃ as contracted では**: じゃ is the colloquial contraction of では **only when immediately followed by a negative** (ない, なかった, ありません, etc.). Example: じゃない = ではない → `de-wa-nai`. Do NOT treat じゃ as a copula contraction inside unrelated words (じゃま, etc.).

**Do NOT tag だ inside**: んだ (→ `no-da-explanatory`), だから, だって, だけ, ただ, まだ, etc.

#### `ta-past` — plain past tense

matched_form = **full conjugated verb** from stem start. Scan backwards from the た/だ ending:

| Verb type               | Past ending    | matched_form example                                                                                                                                              |
| ----------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Group 1, る/つ/う stems | った           | 願った、買った                                                                                                                                                    |
| Group 1, ぬ/む/ぶ stems | んだ           | 読んだ、飲んだ                                                                                                                                                    |
| Group 1, く stems       | いた           | 書いた (exception: 行く → 行った)                                                                                                                                 |
| Group 1, ぐ stems       | いだ           | 泳いだ                                                                                                                                                            |
| Group 1, す stems       | した           | 話した、繰り返した                                                                                                                                                |
| Group 2 (ru-verb)       | た             | 食べた、見た                                                                                                                                                      |
| する irregular          | した           | matched_form = `した` only — for compound verbs like 推測する、説明する etc., use matched_form = `した`, NOT the full compound (推測した → matched_form = `した`) |
| くる irregular          | きた           |                                                                                                                                                                   |
| Copula past             | だった         | tag as both `da-desu` and `ta-past`, same span                                                                                                                    |
| Negative past           | (stem)なかった | tag as both `nai-negative` and `ta-past`, same span                                                                                                               |

#### `nai-negative` — negative form

matched_form = **full negative form** from stem start:

| Pattern                | matched_form example                            |
| ---------------------- | ----------------------------------------------- |
| Plain negative         | 食べない、書かない、しない                      |
| Negative past          | 食べなかった、書かなかった                      |
| ていない (te-iru neg.) | 持っていない — span includes verb + て + いない |
| Potential negative     | なれない、食べられない                          |
| Potential neg. past    | なれなかった                                    |

When `te-iru` and `nai-negative` both apply to the same form (e.g. 持っていない), they share the same span.

#### `te-iru` — ongoing / resultant state

matched_form = full span from verb stem through いる/いた/いない/いなかった (and contracted forms):

| Form          | matched_form example       |
| ------------- | -------------------------- |
| Affirmative   | 持っている、食べている     |
| Contracted    | 持ってる、食べてる         |
| Negative      | 持っていない、食べていない |
| Past          | 持っていた                 |
| Negative past | 持っていなかった           |

Span starts at the verb beginning (the 持 in 持っていない), not at the て.

#### `te-form` — て connective (not te-iru)

Use only when て connects clauses without being followed by いる/ある/etc. matched_form = verb + て/で:

- 食べて → `食べて`
- 読んで → `読んで` (voiced て-form for Group 1 む/ぬ/ぶ stems)

**When the te-form feeds into a `te-kuru` or `te-iku` construction**: the te-form verb's grammar point (e.g. `naru`, `suru`, etc.) and any conjugation on the kuru/iku part (e.g. `e-ro-imperative`) all share the **same full span** as `te-kuru`/`te-iku`. The te-form is inseparable from the construction — you cannot substitute the continuative (-i) form. Example: `なって来い` → `naru` + `te-kuru` + `e-ro-imperative` all share matched_form = `なって来い`.

**For compound する verbs in te-kuru/te-iku**: the span starts at し (the する part), NOT at the preceding noun. Example: 宣戦布告して来た → matched_form = `して来た` (NOT `宣戦布告して来た`). Consistent with the `suru` rule ("matched_form starts at the する part").

#### `rareru-potential` — potential form

matched_form = full potential form from verb stem:

| Verb type           | Pattern                        | matched_form example     |
| ------------------- | ------------------------------ | ------------------------ |
| Group 2             | stem + られる                  | 食べられる、食べられない |
| Group 1             | e-row + る                     | 書ける、飲める、なれる   |
| する                | できる                         | できる、できない、できた |
| Potential negative  | stem + られない / e-row + ない | 食べられない、書けない   |
| Potential neg. past |                                | なれなかった             |

For なれなかった (potential-neg-past of なる): same span tagged as `naru` + `rareru-potential` + `nai-negative` + `ta-past`.

#### `rareru-passive` — passive form

matched_form = full passive form. Context distinguishes passive from potential for Group 2 verbs:

- Group 1: stem + れる/れた (読まれる、書かれた)
- Group 2: stem + られる/られた (食べられる when it means "being eaten")

#### `saseru-causative` — causative form

matched_form = full causative form:

- Group 1: stem + せる (書かせる)
- Group 2: stem + させる (食べさせる)

#### `naru` — to become (any conjugated form)

matched_form = full inflected form from the start of the relevant unit:

matched_form = **just the conjugated なる form** — do NOT include preceding particles (に) or adjectives (〜く):

| Form                | matched_form                                                |
| ------------------- | ----------------------------------------------------------- |
| Plain               | `なる`                                                      |
| Past                | `なった`                                                    |
| Negative            | `ならない`                                                  |
| Potential           | `なれる`                                                    |
| Potential neg. past | `なれなかった`                                              |
| With に (になる)    | `なる` / `なった` — span starts at な, NOT at に            |
| With く (i-adj)     | `なる` / `なった` — span starts at な, NOT at the adjective |

#### `tara-conditional` — たら conditional

matched_form = full verb in たら form from stem start: 食べたら、書いたら、だったら.

#### `ba-conditional` — ば conditional

matched_form = full ば form: 食べれば、書けば、よければ、なければ.

#### Discontinuous constructions (さえ〜ば、ば〜ほど、ほど〜ない、あまり〜ない etc.)

When a grammar point spans two non-adjacent parts of a sentence, create **two entries with the same slug** — one per part. Each entry covers only its own span. The learner hovering over either part sees the same slug, communicating that the two parts belong together.

Example for `sae-ba` (さえ〜ば):

```json
{ "slug": "sae-ba", "start_index": 7, "end_index": 9, "matched_form": "さえ" },
{ "slug": "sae-ba", "start_index": 9, "end_index": 14, "matched_form": "いなければ" }
```

Apply the same pattern to `ba-hodo`, `hodo-nai`, `amari-nai`, etc.

Do NOT add a separate `ba` entry — the ば is already covered by the second `sae-ba` entry.

**General rule for compound/discontinuous constructions**: do NOT also tag the individual component slugs separately. The compound slug replaces them entirely:

- `hodo-nai` → do NOT also add `hodo-extent` or `nai-negative`
- `sae-ba` → do NOT also add `sae` or `ba`
- `amari-nai` → do NOT also add `amari-so-much` or `nai-negative`
- etc.

Adding the individual slugs on top would mislead the learner into thinking it is a simpler construction.

**Standalone さえ in an incomplete/cut-off sentence** (e.g. お前さえ…) → ignore, do not tag.

#### `nara-conditional` — なら conditional

matched_form = `なら` (particle-like, just the なら).

#### `temo` — even if / even though (verb only)

matched_form = verb te-form + も: 食べても、行っても、なくても.

**Do NOT use `temo` for でも after a noun** — use `demo-or-something` instead (see below).

**When the verb in `temo` is itself in potential form**, also add `rareru-potential` on the same span. Example: 壊せても (壊す → 壊せる potential → 壊せて te-form → 壊せても) → two entries sharing the same span and matched_form:

```json
{ "slug": "rareru-potential", "start_index": X, "end_index": Y, "matched_form": "壊せても" },
{ "slug": "te-mo", "start_index": X, "end_index": Y, "matched_form": "壊せても" }
```

#### `demo-or-something` — でも after a noun

matched_form = `でも`. Use when でも follows a **noun or pronoun** meaning "even [noun]". Example: 人造人間でも → matched_form = `でも` (copula て-form + も, not a verbal て-form).

Do NOT confuse with `te-mo` (verb) or `mo-also` (standalone も replacing が/は/を).

#### `nagara` — while doing

matched_form = verb masu-stem + ながら: 歩きながら、食べながら.

#### `tari-tari` — listing actions

Each たり/だり occurrence is a **separate entry**. matched_form = full verb in たり form from stem start: 食べたり、飲んだり.

#### `no-da-explanatory` — explanatory んだ/のだ

matched_form = the full んだ/のだ form and variants: んだ、のだ、んです、のです、んだった、んじゃない、なのだ、なのか、んだろう. Span covers ん/の + だ/です (and preceding な for なのだ/なのか forms).

#### `no-koto-nominalizer` — nominalizer の or こと

Covers both の and こと when they nominalize a verb clause:

- matched_form = `の` when の nominalizes a verb followed by **は、が、を、or も** (i.e., the の acts as a noun). Example: 注意するのは → matched_form = `の`
- matched_form = `こと` when こと nominalizes a verb followed by **は、が、を、or も**. Example: 泳ぐことが好き → matched_form = `こと`

**Disambiguation from lookalikes**:

- `のに` (verb + のに): if のに means "even though" or "in order to" → use `no-ni-although` or `no-ni-in-order-to`, NOT `no-koto-nominalizer`. Key test: is のに followed by a predicate expressing contrast or purpose? If yes → dedicated slug (勉強するのに時間がかかる → のに = "in order to")
- `ことがある` → use `koto-ga-aru-sometimes`
- `ことができる` → use `koto-ga-dekiru`
- `ことにする`, `ことになる`, `ことだ`, `koto-must` etc. → use their dedicated slugs

#### `koto-ga-dekiru` — can do

matched_form = ことができる (or ことができた、ことができない etc.). Full span from こと.

#### `sou-da-appearance` / `sou-ni-sou-na` — looks like / seems

matched_form = **just the そうだ/そうな/そう/そうに suffix** — do NOT include the preceding adjective or noun.

- 意外そうな → matched_form = `そうな` (NOT 意外そうな)
- おいしそうだ → matched_form = `そうだ` (NOT おいしそうだ)

**When combined with negative copula (じゃなさそう / ではなさそう)**: add `da-desu` + `nai-negative` on the **full span** of the whole form (same matched_form). Example: じゃなさそうだ → three entries sharing different spans:

- `da-desu`: full span, matched_form = `じゃなさそうだ`
- `nai-negative`: full span, matched_form = `じゃなさそうだ`
- `sou-da-appearance`: span of そうだ only, matched_form = `そうだ`

#### `mono-da` — NEVER tag

**Always ignore `mono-da`** — produces only false positives in real dialogue (ものだ appears constantly as ものだ "it is a thing that" without being the grammar point). Skip it entirely.

**Exception: still tag `da-desu` within `ものだ`** — skipping `mono-da` means not tagging the _compound pattern_, but the standalone copula `だ` inside `ものだ` must still be tagged as `da-desu` (same span as the だ only). Example: いい時代になったものだな → tag `da-desu` at the だ position.

#### `dake-de` — only by / just with

When だけ is immediately followed by で, tag as **`dake-de`** (a single grammar point), NOT as separate `dake` + `de-means-of`. matched_form = `だけで`. Example: 計算だけで → matched_form = `だけで`.

#### `sa-nominalization` — い-adjective → noun with さ

matched_form = adjective stem + さ: 大きさ、強さ、美しさ. Do NOT confuse with sentence-final さ particle.

#### `sugiru` — too much / excessively

matched_form = **full form including the stem**: adjective stem or verb masu-stem + すぎる. Do NOT tag すぎる alone.

| Type         | Pattern                 | matched_form example   |
| ------------ | ----------------------- | ---------------------- |
| い-adjective | stem (drop い) + すぎる | 良すぎる、高すぎる     |
| な-adjective | stem + すぎる           | 静かすぎる             |
| Verb         | masu-stem + すぎる      | 食べすぎる、飲みすぎる |

Including the stem is intentional — it makes the conjugation pattern (い-adj loses い, verb uses masu-stem) visible to the learner.

#### `te-shimau` — acabar de / lamentablemente

matched_form = **full form from verb stem** through しまう/しまった and contracted variants (ちゃう/ちゃった、じゃう/じゃった).

| Form              | matched_form example         |
| ----------------- | ---------------------------- |
| Plain             | 食べてしまう                 |
| Past              | 食べてしまった               |
| Contracted plain  | 食べちゃう                   |
| Contracted past   | 食べちゃった、終わっちゃった |
| Voiced contracted | 飲んじゃった                 |

When in past form, also tag `ta-past` on the **same span and matched_form**. Example: 終わっちゃった → two entries: `te-shimau` + `ta-past`, both matched_form = `終わっちゃった`.

#### `te-tamaranai` — unbearably / can't help but

matched_form = **full form from adjective/verb stem** through たまらない. The て is part of the fixed construction and inseparable from たまらない.

| Type         | matched_form example                         |
| ------------ | -------------------------------------------- |
| い-adjective | adj stem + くてたまらない → 憎くてたまらない |
| Verb         | verb te-form + たまらない → 見てたまらない   |

Do NOT add a separate `nai-negative` or `i-adjective-te-form` entry — compound construction rule applies.

#### `suru` — compound する verb

matched_form = `する` only — do NOT include the preceding noun/kanji. The noun is the lexical part; する is the grammar point. Example: 続行する → matched_form = `する`. Consistent with the `ta-past` rule for する compounds (推測した → matched_form = `した`).

When the compound verb is conjugated (te-iru, ta-past, nai-negative, etc.), always tag **both** `suru` and the conjugation slug on the **same span and matched_form**. Example: 博している → two entries sharing span/matched_form `している`: `suru` + `te-iru`. Example: 続行した → `suru` + `ta-past`, both matched_form = `した`. The matched_form starts at the する part (し/し/し…), never at the preceding noun.

#### `i-adjective` conjugations

- `i-adjective-past`: matched_form = adj + かった (高かった、よかった)
- `i-adjective-negative`: matched_form = adj stem + くない (高くない、よくない)
- `i-adjective-te-form`: matched_form = adj stem + くて (高くて — connects clauses)

#### `hodo-extent` — to the extent of / so much that

matched_form = `ほど` only — do NOT include preceding demonstratives (それ、これ、あれ) or adverbs. Example: それほどの有名人 → matched_form = `ほど` (span covers ほど only, NOT それほど).

#### `hotondo-nai` — hardly any / almost none

matched_form = `ほとんど` for the first part + verb/adjective negative for the second part (discontinuous, two entries same slug). Example: ほとんどいない → two entries: `ほとんど` (start to start+4) and `いない` (negative verb span). Parallels `amari-nai`, `mattaku-nai`, `zenzen-nai`.

Do NOT add a separate `nai-negative` entry — the compound slug replaces it entirely.

#### `ga-ii` — it is good / you should

matched_form = `がいい`. Use when verb plain form + が + いい expresses a recommendation or command. Example: 腕を振るうがいい → matched_form = `がいい`, span covers が + いい only (NOT the preceding verb). Distinct from `ba-ii` (ばいい) and `hou-ga-ii` (〜方がいい).

### Workflow for conversion

1. For each transcript line:
   a. Auto-generate `translations.en` and `translations.fr` based on the Japanese text and context
   b. Analyze the Japanese `text` and identify all grammar constructions present, matching them against the slug list at `~/Desktop/slug-list.txt`. Be conservative — only tag constructions you are grammatically confident about.
   c. For each identified grammar point, use grammatical context to locate the correct occurrence(s) in `text`, compute start_index/end_index, and produce one `{ slug, start_index, end_index, matched_form }` object per occurrence
   d. Verify: `text.slice(start_index, end_index) === matched_form` for every entry
2. Output `grammar_points` entries sorted by start_index; entries sharing the same span are grouped consecutively
