---
title: 'From Forgotten Scans to a Finished Neuroimaging Report'
description: >-
  How the Douglas Neuroinformatics Platform turns disorganised,
  stale MRI data into a complete, reproducible brain-behaviour
  analysis.
authors:
  - cian-monnin
type: article
---

Research groups collect MRI scans. The scans end up on a hard
drive, sometimes for years. File formats are mixed, naming
conventions have drifted, the person who ran the scanner has
graduated, and the behavioural spreadsheet has been through
enough hands that nobody is confident about what was cleaned.

This is a common situation we see at the Douglas
Neuroinformatics Platform. A group has data that could answer
a real question, but the gap between what they have and an
actual analysis feels too wide. There's no
pipeline, no standardised layout, and the team's strength is
the science, not the data engineering.

## The bottleneck isn't the statistics

The statistical methods for relating brain structure to
behaviour are well known. The hard part is everything that comes
before: getting mixed file formats into a common standard,
checking quality on every scan, preprocessing consistently, and
putting together a workflow that someone could re-run next year
and get the same result.

Groups routinely underestimate this. It's not a weekend job.
It's months of troubleshooting, often on unfamiliar compute
infrastructure, and a misstep early on can quietly affect every
result downstream. When the work falls to a trainee learning as
they go, reproducibility tends to suffer.

## What we actually deliver

We take a group from disorganised data to a finished,
reproducible analysis:

**A clean, standards-compliant dataset.** Whatever came in
DICOMs from the scanner, hand-renamed NIfTIs, a mix of both,
goes out as a single structured dataset that any tool in the
field can work with.

**End-to-end preprocessing.** Skull stripping, bias correction,
template construction, morphometric mapping, all handled with
established tools, properly configured for the data. The group
doesn't need to know which software versions clash or which
parameters matter for their acquisition.

**Statistics that fit the question.** Voxel-wise models are a
reasonable start, but they're not always enough. When it makes
sense, we use multivariate methods that model brain and
behaviour together, picking up distributed patterns that
standard approaches bury under multiple-comparison corrections.

**Figures and tables for the paper.** Brain maps on the group's
own template. Bar charts with confidence intervals. Summary
tables with variance and significance. Finished outputs for a
manuscript.

**A reproducible record.** Every step is scripted. The whole
analysis reruns from raw data with one config change. When a
reviewer asks "what if you control for X," the answer is a
rerun, not a rebuild.

## Why come to us

A group that tries to do all of this independently will spend
months on work outside their expertise. We've done it
before, we maintain the infrastructure, and we build every
pipeline to be reproducible from day one.

The practical upshot: a dataset collecting dust becomes a
completed analysis. Stale data becomes a paper. And the group
spends its time on the science instead of fighting the tooling.
