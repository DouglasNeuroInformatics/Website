---
title: 'Brain-Behaviour Analysis Pipeline: End-to-End, DICOM to Stats'
description: A walkthrough of an MRI-to-statistics pipeline, from BIDS conversion through deformation-based morphometry to multivariate PLSC analysis on HPC.
authors:
  - cian-monnin
type: article
---

## Intro

A research group had T1-weighted MRI scans (a mix of DICOM and
NIfTI files) paired with a spreadsheet of behavioural, cognitive,
and demographic measures. The question: does brain structure
relate to behaviour?

## Step 1: From Scans to Structure

First everything was brought into a single BIDS dataset. Raw
DICOMs were converted with **dcm2bids** ([repo](https://github.com/UNFmontreal/Dcm2Bids)); the existing NIfTI files were renamed and
slotted into the same BIDS layout. This gave a consistent structure
for the downstream tools regardless of source format.

Preprocessing was handled by **Synthstrip_N3** ([repo](https://github.com/CoBrALab/synthstrip_N3)), which performs skull-stripping and N3
bias field correction. It is maintained by CoBrALab.

From BIDSified T1s, **deformation-based morphometry (DBM)** was computed
via `optimized_antsMultivariateTemplateConstruction` ([repo](https://github.com/CoBrALab/optimized_antsMultivariateTemplateConstruction)),
which builds an unbiased average template. The resulting deformation
fields are turned into Jacobian determinant maps for statistical
analysis.

## Step 2: Univariate Models - The Standard Approach

Voxel-wise linear models were run for each behavioural measure:

```
jacobian ~ group + sex + age + behavioural_score
```

Models were submitted via SLURM on Digital Research Alliance of
Canada's [Trillium cluster](https://docs.alliancecan.ca/wiki/Trillium).
FDR correction was applied across all voxels.

A characteristic failure mode of univariate methods with
distributed signals: each voxel tested individually produces a
multiple comparison burden that buries weak but distributed effects.

## Step 3: Multivariate Pivot - PLSC

Partial Least Squares Correlation (PLSC) avoids the multiple
comparison problem by modelling brain and behaviour jointly:

- **X matrix:** subjects × voxels (log Jacobians)
- **Y matrix:** subjects × behavioural measures

PLSC finds latent variable (LV) pairs. These are weighted brain
patterns and weighted behaviour patterns that are maximally
correlated.

**Post-hoc validation:** LV scores were regressed against age and
sex to rule out confounding.

## Step 4: Delivered Outputs

- **Behavioural loading plots** - Bar charts with 95% bootstrap CIs
  per measure. Measures whose CI does not cross zero are reliable
  contributors to the latent behavioural pattern.
- **Brain maps** - Bootstrap ratio volumes (effectively z-scores for
  voxel weights) written to MINC and overlaid on the template.
  Coronal, sagittal, and axial slices. Thresholded (|BSR| > 1.95)
  and unthresholded versions.
- **Variance table** - All LVs with singular values, percent
  variance, and permutation p-values.
- **Post-hoc tables** - OLS results for age and sex against LV
  scores.

## Infrastructure Details

**Pipeline design:** A single `ANALYSIS_NAME` parameter drives the
entire workflow. Every script reads paths and parameters from
environment variables. Output directories are auto-named from config
(`plsc_outputs_boot1000_perm5000_YYYYMMDD_HHmm`). This allows
re-plotting old runs without re-running models.

**Checkpointing:** The PLSC analysis (~5 hrs) saves raw results to a
pickle after completion. Re-running post-processing skips the
expensive jacobian loading and PLS computation.

**Dependency management (HPC):** Getting `pypyls` to install on the
cluster took some fiddling. It needed pinned older versions of
`setuptools` and `numpy` plus a no-build-isolation install from
git, and the right modules loaded first. Once the version
constraints were nailed down, the environment was reproducible.

## Summary

- dcm2bids/BIDS -> Synthstrip_N3 -> DBM -> log Jacobian maps
- Univariate voxel-wise models per behavioural measure (FDR-corrected)
- PLSC for joint brain-behaviour modelling, avoiding the multiple
  comparison burden
- Post-hoc LV regression against age and sex to check confounding
- Full outputs: brain maps, loading plots, summary tables, raw
  results

---

_Tools: [dcm2bids](https://github.com/UNFmontreal/Dcm2Bids), [Synthstrip_N3](https://github.com/CoBrALab/synthstrip_N3), [optimized_antsMultivariateTemplateConstruction](https://github.com/CoBrALab/optimized_antsMultivariateTemplateConstruction), [pypyls](https://github.com/netneurolab/pypyls)_
