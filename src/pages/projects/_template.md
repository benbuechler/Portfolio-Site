---
# COPY THIS FILE to a new .md file in this folder to add a project.
# Example: audio-amplifier.md becomes /projects/audio-amplifier and appears
# automatically as a card on /projects. A leading underscore hides a draft.
layout: ../../layouts/ProjectLayout.astro
# These four fields are required. Keep the summary to one or two sentences.
title: "Your project title"
summary: "A brief introduction to what you built and why."
# Put your photo in public/images/projects/ and use its public URL here.
# Example: public/images/projects/amplifier.jpg -> /images/projects/amplifier.jpg
# This existing illustration lets a copied template work until you add a photo.
image: /images/projects/portfolio.svg
imageAlt: "An illustration of the portfolio's connected page network."
# Optional: remove tools if you do not need technology labels.
tools:
  - Your tools
# Optional: smaller numbers appear first on the hub; the default is 0.
sortOrder: 0
---

<!-- Write your project here in Markdown. ## adds a section heading; the
     layout already uses the title above as the main h1. -->

## The idea

Describe the problem, your goal, and why you chose this project.

## The build

Explain your contribution, the tools you used, and the decisions that shaped the result.

<!-- Add more photos with ![A useful description](/images/projects/filename.jpg). -->

## Results and lessons

Share what worked, what you tested, and what you learned along the way.

## What’s next

Describe any improvements or questions you want to explore next.
