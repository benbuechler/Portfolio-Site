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
# Compact media sits beside the story on desktop and stacks above it on mobile.
# Click a photo to expand it. With neither image nor gallery, the page is text-only;
# gallery without image adds detail-page photos while leaving the hub card text-only.
# Optional interactive 3D model, shown above the photos once its file exists.
# Put a .glb (recommended) or .gltf file in public/models/ and use its public URL.
# model:
#   src: /models/my-project/model.glb
#   alt: "A description of the model visitors can rotate and zoom."
# Optional: one quoted date appears as written on the card and project page.
# You can also use a range or "Ongoing". Remove date to hide it; it does not sort projects.
date: "October 2026"
# Optional: remove tools if you do not need technology labels.
tools:
  - Your tools
# Optional: smaller numbers appear first on the hub; the default is 0.
sortOrder: 0
# Optional: comments are enabled once Giscus is configured. Use false to disable.
# comments: false
# Optional stable thread ID; set before changing the article's filename/URL.
# To preserve an existing thread, use its old term, e.g. "projects/my-project".
# commentId: "projects/my-project"
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

<!-- Optional: keep ongoing notes on this project page. Add the newest update
     first, using a dated ### heading. Remove this section if you do not need it. -->

## Progress updates

### Month Day, Year — Update title

Describe what changed, what you tried, and what you learned. Add photos or code
where they help explain the work.
