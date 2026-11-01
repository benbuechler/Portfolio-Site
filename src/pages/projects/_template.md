---
# COPY THIS FILE to a new .md file in this folder to add a project.
# Example: audio-amplifier.md becomes /projects/audio-amplifier and appears
# automatically as a card on /projects. A leading underscore hides a draft.
layout: ../../layouts/ProjectLayout.astro
# Title and summary are required. Keep the summary to one or two sentences.
title: "Your project title"
summary: "A brief introduction to what you built and why."
# Optional cover: used on the hub card and first in the project's photo gallery.
# Uncomment both fields below when you have a picture.
# Put it in public/images/projects/ and use its public URL here.
# Example: public/images/projects/amplifier.jpg -> /images/projects/amplifier.jpg
# A non-empty image requires imageAlt to describe it.
# Omit/comment out image, leave image: blank, or use image: "" for no cover.
# image: /images/projects/amplifier.jpg
# imageAlt: "An assembled audio amplifier and its circuit board."
# Optional extra gallery photos, appended after the cover. Uncomment and replace
# these paths with your photos. Each needs src and alt; caption is optional.
# gallery:
#   - src: /images/projects/amplifier-board.jpg
#     alt: "A close-up of the amplifier's assembled circuit board."
#     caption: "The assembled circuit board."
#   - src: /images/projects/amplifier-testing.jpg
#     alt: "The amplifier connected to test equipment on a workbench."
# The gallery sits beside the write-up on desktop and stacks on mobile.
# Click a photo to expand it. With neither image nor gallery, the page is text-only;
# gallery without image adds detail-page photos while leaving the hub card text-only.
# Optional: one quoted date appears as written on the card and project page.
# You can also use a range or "Ongoing". Remove date to hide it; it does not sort projects.
date: "October 2026"
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

<!-- Use gallery above for expandable photos. For a photo within the write-up,
     use ![A useful description](/images/projects/filename.jpg). -->

## Results and lessons

Share what worked, what you tested, and what you learned along the way.

## What’s next

Describe any improvements or questions you want to explore next.
