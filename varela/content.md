# Varela

> **BETA — EARLY AND INCOMPLETE**
>
> This is an exploratory sketch of Varela (v4), not a finished language. Syntax, semantics, the host, and these notes are provisional. Expect gaps, inventions, and breaking changes. Do not treat this as a stable specification or production API.


## Introduction

Varela is a modelled language: data, behaviour, metadata, errors, and reflection share one typed substrate. In the language, homoiconicity is more expansive than LISP-like 'code is data'. It means a unified symbolic model substrate represents data, code, metadata, reflection, configuration, errors, deployments, dependencies, evaluables, and models themselves. The 'code is data' idea is included, but the broader principle is that everything is a model. And models modify models.

Accordingly, all language aspects are defined by models not by grammars. Varela offers the models and their data as core substrate but it also defines itself with that substrate to stay highly reflected and normalised on its language level (no xml, json, yaml, properties, ini, make, etc.).

There are two grammars to express the models and their data generically:

- Varela Exchange for data
- Model Grammar to describe any model including the meta-model — the natural representation of the model grammar.

And there are two reflection worlds:

- Endo-homoiconicity and reflection: internal, informal and functional
- Exo-homoiconicity and reflection: generic models that can leave the process space in various forms mapped by domain agnostic algorithms (e.g. serialise, marshall).

Modelling the language means that information about the language aspects can be transported as normal exo-data (eg. with Varela Exchange, but also JSON, YAML). We can use the transfer of model data to reflect about the system.

As the language is defined by the model and not the grammar, you can always parse the old grammar to the new model. As other grammars — such as the language native grammar — are built on grammar definitions that bind to the actual language models, the grammar / model relationship is a first class principle.

### Media types

- `.vla` → application/vla: the full **V**are**la** programming language

- `.mvla` → application/mvla: the declarative **m**odel definitions

- `.xvla` → application/xvla: the behaviour-free data e**x**change

The formats are strictly nested: XVLA ⊂ MVLA ⊂ VLA

## Foundations

### Why these shapes

Ordinary software scatters meaning across code, configs, schemas, and wire formats that cannot inspect each other. Varela collapses that into one reflective model so a system can reason about itself and exchange that reasoning intact — homoiconicity as a strict structural isomorphism across the full representational substrate, not merely 'code is data'.

**Models define the language. Grammars project it.** Syntax is a disposable surface. The model remains the shared, inspectable contract tools and LLMs can read. It's *not* 'models own meaning': meaning still depends on who interprets the model in their contexts (see below). Models carry the distinctions.

```vla
# Alias/Positional are model data — the CLI parser learns the command line from them
@Alias {name: 'add'}
entity AddTask { priority: Priority }
```

**Denote values before running them.** An invocation is an entity you can store, validate, or ship; an expert supplies behaviour later. The host need not understand the domain.

```vla
entity FizzBuzz: Result { inputs: list<integer> }
# `fizz-buzz --inputs 1 2` builds this value; evaluation is optional and separate
```

**Failures are values.** No exceptions: `Reason` / `Failure` travel like any other entity, so many independent errors can surface together and stay located.

```vla
expert function wordle(evaluable: Wordle): Maybe<Board> {
  return InvalidValue { text: "Too many guesses" }  # → Maybe.empty
}
```

**Two reflections, one loop.** Modelled reflection (`EntityType`, …) is exchangeable data; behavioural reflection is the host’s `create` / `get` / `set`. Declarations become data, then deploy into behaviour — so types can also be built from data alone.

```vla
Reflection.deploy(Model { name: 'fixture:ghost', types: set<Type> [ghost] })
```

**Steps instead of lambdas.** Composition (`Apply`, `Bind`, `Map`) is itself model data, so pipelines stay serialisable and type-checkable.

```vla
return Map(outcome: Check(value: evaluable), next: ClassifyInputs {})
```

**Keep domains thin.** Parsing, views, and validation live in separate models so a domain declares *what* without owning the CLI or presentation.

```xvla
< RunCommandLine { domains: ['example:wordle'], view: TextView {} }
```

### Models carry the world

The distinctions a domain needs — types, metadata, evaluables, reasons, views — live in Varela models, so they can be reflected, exchanged, and checked without asking the runtime. The host supplies only the *machine edge*: bytes, clocks, argv, process exit. It must not encode domain vocabulary; if the host knew what a `Priority` or a `Board` was, swapping hosts or tooling would fork the world model.

Consequences: CLI shape comes from `@Alias` / `@Positional`, not from host switches; decode and locate errors in Varela; presentation is a `View` step, not `println` in the bootstrap. The host’s job is to bind externals, deploy reflection, evaluate whatever the document emits, and print the lines a view returns.

```vla
# The model carries what "add high" denotes
@Alias {name: 'add'}
entity AddTask { priority: Priority = Priority.medium }

# Edge: the host only injects argv and writes the view's strings
# < RunCommandLine { args: $args, domains: ['example:tasks'] }
```

### Information is not meaning


[Shannon’s model](https://en.wikipedia.org/wiki/A_Mathematical_Theory_of_Communication) accounts for the transmission of information: a signal selected from a set of possible signals, sent through a channel, recovered at a receiver. It is silent on meaning. A bit string can arrive intact and still mean nothing — or mean different things — depending on who receives it and in what shared world they stand.

[Donald MacKay](https://en.wikipedia.org/wiki/Donald_MacCrimmon_MacKay) supplied the missing half: while Shannon measured the work a signal does in selecting one message from a set of possibilities, MacKay defined meaning as the work a signal does on the receiver’s *conditional readiness* to think, update its understanding, and act. Meaning is inherently relational, not a property carried inside the message. In natural systems, from cellular signalling to nervous systems, a cue only acquires significance through the receiving organism’s internal state and history of structural coupling; shared meaning emerges only when sender and receiver inhabit a sufficiently aligned context. In the same way, tokens like `high` or `Board { won: true }` depend on the receiver’s models — prior types, vocabulary, purposes, and the distinctions they know how to draw.

Varela does not encode a universal semantics. It facilitates interpretation: a shared, reflective substrate so that senders and receivers can align (or deliberately diverge) their models — `%model`, typed values, metadata, reasons — and make that relational alignment itself inspectable. Exo-intelligence needs channels and legible context; Varela is the latter.

```xvla
%model example:tasks#[0.1,0.2)
# Channel delivers text; meaning starts when the receiver's model binds it
< AddTask { priority: high }
```

## Concepts

### Host

The **host** is the runtime process that loads Varela and performs what models cannot: read files and argv, deploy behavioural reflection (`create`, `get`/`set`, `parse`), bind `$name` externals, evaluate experts, and write stdout/stderr. Models carry the world; the host owns the machine edge. In v4 that host is the Rust bootstrap (`./varela`). It stays domain-blind — a command is just an emitted evaluable plus a view.

```xvla
%xvla 0.1
%model hackathon:cli-run#[0.1,0.2)

# $args is supplied by the host; everything else is Varela
< RunCommandLine { args: $args, domains: ['example:tasks'] }
```

### Models

A named package of types. `%model` pulls a dependency; `id` is how domains are addressed.

```vla
%model hackathon:cli-metadata#[0.1,0.2)

model Tasks @xvla {
  id: 'example:tasks',
  stability: 'evolving'
} {
  enum Priority { low, medium, high }
  entity AddTask {
    priority: Priority = Priority.medium
  }
}
```

### Entities & enums

Entities are identity-bearing records. Enums are model-defined scalars. Inheritance uses `extends`.

```vla
abstract entity Condition extends Step: boolean {
  input: integer
}

entity DivisibleBy extends Condition: boolean {
  divisor: integer
}
```

### Evaluables & experts

`entity Name: T` means the entity *evaluates to* `T`. An `expert function` binds behaviour to that type. Evaluation is data-first: build the value, then run it.

```vla
entity ScoreGuess: ScoredGuess {
  secret: string
  guess: string
}

expert function scoreGuess(evaluable: ScoreGuess): ScoredGuess {
  return ScoredGuess { guess: evaluable.guess, tiles: list<Tile> [] }
}
```

Call as `ScoreGuess(secret: s, guess: g)` or `step()`.

### XVLA documents

Preamble declares version and models. Bindings pool values; `< value` emits. `$name` is a host binding.

```xvla
%xvla 0.1
%model hackathon:cli-run#[0.1,0.2)

< RunCommandLine {
  args: $args,
  domains: ['example:wordle'],
  view: TextView {}
}
```

### Type system

Scalars (`boolean`, `string`, `integer`, …), collections (`list<T>`, `set<T>`, `map<K,V>`), `typeref<T>`, and unions. Model generics stay reduced to those four forms.

```vla
type Option = Some | None
type Result = Some | Failure

entity FizzBuzz: Result {
  inputs: list<integer>
  rules: list<Rule> = list<Rule> [
    Rule { label: 'Fizz', when: DivisibleBy { divisor: 3 } }
  ]
}
```

### Metadata

`@Type { … }` before a declaration is a `MetaData` entity. Cascading resolution picks what applies (element → property type → supertypes), filtered by selectors.

```vla
@Positional {properties: [~AddTask.priority]}
@Alias {name: 'add'}
entity AddTask {
  @Alias {name: 'prio'}
  priority: Priority = Priority.medium
}
```

### ~ refs

`~Type.property` is a **load-time** reference into the modelled meta-model. Where the expected type is `Property` (as in `Positional.properties`), it resolves to that `Property` entity. Elsewhere it yields a *locus* (a typed location). A wrong name fails the load — metadata cannot silently point at nothing.

```vla
# Resolves to the Property instance for AddTask.priority
@Positional {properties: [~AddTask.priority]}

entity DivisibleBy extends Condition: boolean {
  @Minimum {value: 1}   # metadata on the property; ~ not needed here
  divisor: integer
}
```

Contrast: `$args` is a host binding at run time; `?FileResource` is behavioural reflection. Only `~` is checked against declarations before any argv is read.


### Reflection (the strange loop)

| Side | What | Reach |
|------|------|-------|
| Modelled | `EntityType`, `Property`, `Model` as data | `Models.find`, `.manifest()` |
| Behavioural | Host deploy: `create`, `get`/`set`, `parse` | `Reflection`, `?Name` |

Declaration → modelled instance → deploy → behavioural type. Types can be built from data alone.

```vla
let ghost = EntityType { typeSignature: 'Ghost' }
ghost.properties.add(Property {
  name: 'label', type: text.manifest(), declaringType: ghost
})
Reflection.deploy(Model { name: 'fixture:ghost', types: set<Type> [ghost] })
```

### Outcomes

No exceptions. `Option` is presence; `Result`/`Maybe` is success-or-reasons. Returning a `Reason` from a `Maybe`-typed expert is failure.

```vla
expert function wordle(evaluable: Wordle): Maybe<Board> {
  if (evaluable.guesses.size > 5) {
    return InvalidValue { text: "Too many guesses" }
  }
  return Board { rows: rows, won: won }
}
```

```vla
match parsed {
  Failure as failed { /* use failed.reasons */ }
  Some as ok { /* use ok.value */ }
}
```

### Steps & chaining

`Step` is a partial evaluable (input filled later). `Apply` / `Bind` / `Map` compose without lambdas.

```vla
expert function fizzBuzz(evaluable: FizzBuzz): Result {
  return Map(outcome: Check(value: evaluable), next: ClassifyInputs {})
}

expert function divisibleBy(evaluable: DivisibleBy): boolean {
  return evaluable.input % evaluable.divisor == 0
}
# Apply(step: rule.when, input: number) fills Condition.input, then evaluates
```

### CLI as model

Argv denotes entities. Metadata (`Positional`, `Alias`) shapes the command line; the host only binds `$args` and prints the view.

```text
./varela tasks add high
# → AddTask { priority: Priority.high }
```

```vla
entity RunCommandLine: CommandResult {
  args: list<string>
  domains: list<string>
  evaluator: CliEvaluator
  view: Step
}
```

### Control flow (sketch)

`let`, `if`, `for`/`while`, `match`, property mutation, string interpolation. Checked at load where possible (expert signatures, `match` exhaustiveness, `~` refs).

```vla
for guess in evaluable.guesses {
  let scored = ScoreGuess(secret: secret, guess: guess)
  rows.add(scored)
}
return "${row.guess} ${marks}"
```

## Zen of Varela

- Embrace the strange loop
- Beautiful is better than clever — when the model can say it.
- Models define the language; grammars only wear it.
- Information arrives; meaning is interpreted.
- Denote first. Evaluate when you must.
- Failure is a value. Silence is not an error report.
- Reflection is ordinary.
- Explicit models beat implicit convention — except when the model *is* the convention.
- There should be one obvious place for a distinction — in a model others can read.
