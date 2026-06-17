---
title: 'Serving Local LLMs for Clinical and Research Use at the Douglas'
extendedTitle: 'Bringing Self-Hosted Large Language Models to the Douglas Mental Health University Institute'
description: The Douglas Neuroinformatics Platform is deploying open-weight models — Gemma 4, MedGemma 3, MedGemma 4, and Qwen 3.6 — served locally with vLLM, keeping sensitive patient and research data inside the institute.
authors:
  - gabriel-devenyi
type: article
---

Large language models have quickly become part of everyday clinical and research work, from drafting documentation to summarizing literature and exploring data. But the most capable commercial models are hosted by third parties, and using them means sending your text — including, potentially, sensitive patient information — to servers outside your institution's control. For a mental health hospital, that is a problem worth solving rather than accepting.

The Douglas Neuroinformatics Platform is addressing it directly: we are deploying open-weight large language models on our own hardware, served locally to clinicians and researchers at the Douglas Mental Health University Institute. Nothing leaves the building.

## The models

We selected a set of complementary open-weight models to cover the range of clinical and research needs:

- **Gemma 4** — Google's general-purpose open model, used as a capable all-rounder for drafting, summarization, coding assistance, and general question answering.
- **MedGemma 3** and **MedGemma 4** — medically-tuned variants designed for clinical text and biomedical reasoning. Running both generations lets us compare quality and behaviour while giving users a model trained specifically on medical content.
- **Qwen 3.6** — a strong multilingual model, valuable in a bilingual French/English setting and competitive on reasoning and coding tasks.

Offering several models matters. No single model is best at everything, and being able to route a clinical summarization task to MedGemma while sending a multilingual or coding task to Qwen or Gemma gives users the right tool without compromise.

## Serving with vLLM

All of these models are served through [vLLM](https://github.com/vllm-project/vllm), an inference engine built for high-throughput, low-latency serving. vLLM's continuous batching and paged attention let a single GPU server handle many concurrent users efficiently, and its OpenAI-compatible API means existing tools and scripts work against our local endpoint with minimal changes — point them at our internal URL instead of a vendor's.

That compatibility is a deliberate choice. Researchers can keep using the libraries and editor integrations they already know, and clinicians get familiar chat interfaces, while every request is quietly handled inside the institute.

## Why local matters: patient data safety

The central reason for this work is data safety. Mental health records are among the most sensitive data a hospital holds, and they carry both legal protection and a strong ethical obligation. Sending that data to an external API creates real risks:

- **Loss of control.** Once text leaves the network, you cannot guarantee where it is stored, how long it is retained, or who can access it. Provider terms change, and "we don't train on your data" is a promise, not a technical guarantee.
- **Regulatory exposure.** Quebec's health privacy law and broader Canadian privacy frameworks place strict limits on disclosing personal health information. Routing it through a third-party LLM can constitute a disclosure the institution is not authorized to make.
- **Re-identification.** Clinical free text is notoriously hard to de-identify reliably. Even text that looks anonymized can leak identifying detail, so "just remove the names" is not a safe mitigation.

Self-hosting removes these risks at the source. When the model runs on hardware the platform administers, on the institute's own network:

- **Data never leaves.** Prompts and responses stay on local infrastructure. There is no external transmission to audit, secure, or trust.
- **We control retention.** Logs, caches, and history are governed by our own policies, not a vendor's defaults.
- **Access is auditable.** Authentication and usage run through systems the institute already operates, so access can be governed and reviewed like any other internal clinical system.
- **No training leakage.** Open-weight models served locally do not feed user input back into anyone's training pipeline.

The result is that a clinician can use an LLM to help draft a note or summarize a chart, and a researcher can analyze sensitive study data with model assistance, without either of them having to weigh productivity against the risk of exposing patient information. The safe option becomes the default option.

## Helping groups remove PII from their data

Local serving solves the transmission problem, but many research and clinical groups also need to clean identifying information out of their own datasets before they share, analyze, or archive them. This is hard to do well by hand, and "just delete the names" misses dates, addresses, record numbers, and the many other ways a person can be identified in free text. The platform helps groups with this directly.

We support PII removal using two open token-classification models built for the task:

- **[openai/privacy-filter](https://huggingface.co/openai/privacy-filter)** — a ~1.4B-parameter model that tags personally identifiable information (names, dates, addresses, identifiers, and similar spans) in text. It is fast and Apache-2.0 licensed.
- **[OpenMed/privacy-filter-multilingual](https://huggingface.co/OpenMed/privacy-filter-multilingual)** — a fine-tune of the same architecture that extends PII detection across 16 languages, including both French and English, trained on the ai4privacy PII-masking datasets. In a bilingual institute, this matters: a redactor that only understands English would silently miss identifiers in French clinical text.

These models do token classification rather than generation, so they pinpoint *where* the sensitive spans are without rewriting the surrounding content. That lets a group apply the policy it needs — redact, pseudonymize, or flag — and review the results before anything is published or moved. The bilingual model handles our French/English mix; the base model gives a well-tested option for English-heavy datasets.

Like the language models, these run locally, so the data being cleaned never leaves the institute during the process. The platform works with each group to fit the tools to their data and workflow, turning de-identification from a manual chore into a supported, repeatable step.

## What's next

This deployment is the foundation for a broader set of tools — retrieval over internal documents, structured extraction from clinical text, and research-focused assistants — all built on infrastructure that keeps data where it belongs. As open-weight models continue to improve, a locally-served stack lets the Douglas adopt new capabilities on its own terms, without renegotiating data safety every time.

Local LLMs are not a compromise on capability. They are how a mental health institute gets the benefits of modern AI while keeping its first obligation — protecting the people in its care — intact.

## Why a team like the DNP is essential

None of this happens by default. Selecting models, standing up GPU servers, configuring vLLM, securing the endpoints, integrating authentication, supporting bilingual PII removal, and keeping it all running is specialized work that sits well outside the training of clinicians and researchers — and outside what most of them have the time or mandate to take on. Left to individuals, the practical choice collapses to two bad options: paste sensitive data into whatever commercial tool is easiest, or go without modern AI entirely.

A dedicated neuroinformatics team removes that dilemma. The Douglas Neuroinformatics Platform exists precisely to carry this technical and operational burden on behalf of the institute:

- **Infrastructure.** Procuring and running the GPU hardware, inference engine, and serving stack so a model is just an endpoint a user can call.
- **Security and governance.** Handling authentication, access control, logging policy, and the privacy engineering that keeps deployments compliant with health-data obligations.
- **Expertise and curation.** Tracking the fast-moving open-weight landscape, evaluating which models are worth deploying, and retiring them as better ones arrive — so users get current capability without having to follow the field themselves.
- **Support.** Working directly with clinical and research groups to fit these tools to real workflows, from de-identification to model-assisted analysis.

This is the core argument for embedding a platform like the DNP inside a research hospital. The capabilities described here — capable local models, served safely, with privacy support for the people who use them — are not realistically available to a clinician or researcher acting alone. They become available when an institution invests in a team whose job is to build, secure, and sustain them. That team is what turns "modern AI, but only if you accept the privacy risk" into "modern AI, on infrastructure you can trust."
