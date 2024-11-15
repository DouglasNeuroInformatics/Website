---
title: 'Reproducible Cleaning and Transformation of a Historical Research-Clinical Dataset'
extendedTitle: 'Reproducible Cleaning and Transformation of a Historical Research-Clinical Dataset: Methods Developed, and Lessons Learned by the Douglas Neuroinformatics Team'
description: 'We developed a methodology for converting and cleaning a historical dataset of 88 SPSS files into a semi-long dataframe with time-based longitudinal representation.'
authors:
  - weijie-tan
  - ryan-haniff
  - vanessa-valiquette
  - gabriel-devenyi
type: article
source:
  href: 'https://mjm.mcgill.ca/article/view/1140/880'
  label: Healthy Brains Healthy Lives 2024 Symposium
---

Measurement-Based Care generates data to improve treatment outcomes and facilitate research. However, manual data entry into proprietary software like SPSS poses accessibility challenges for collaborating researchers lacking licenses and introduces errors and inconsistencies due to weak data models. Manually extracting data for sub-cohort studies introduces further potential for inaccuracies, including inadvertent data inclusion or exclusion. Finally, related studies implemented over many years under such conditions can result in study design drift, requiring post-hoc harmonization. Here we present the results, and lessons learned from the cleaning and integration of a retrospective 15-year research-clinical dataset for public databanking. We developed a methodology for converting and cleaning a historical dataset of 88 SPSS files into an semi-long dataframe with time-based longitudinal representation. The resulting data table features clear variable names along with a metadata dictionary containing variable types, descriptions, value labels, and expressions for calculated variables. The development process addressed challenges due to inconsistent variable naming, insufficient dataset documentation, missing data, and data conflicts. From this experience, we present several valuable lessons: the importance of imposing data structure from the start, producing meticulous documentation, preserving digital copies of paper tests, implementing effective onboarding processes for new team members managing data collection, and comprehensive date logging for all events. These insights inform future development, enhancing efficiency, transparency, and resilience in managing datasets. Our streamlined method supports research analysis through automated script execution, overcoming software licensing restrictions and seamlessly integrating into ongoing data collection efforts to enhance data integrity and facilitate longitudinal research endeavors. 