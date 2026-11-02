---
# COPY THIS FILE to a new .md file in this folder to add a project.
# Example: audio-amplifier.md becomes /projects/audio-amplifier and appears
# automatically as a card on /projects. A leading underscore hides a draft.
layout: ../../layouts/ProjectLayout.astro
# These four fields are required. Keep the summary to one or two sentences.
title: "Voron 2.4 3D Printer"
summary: "Building a Voron 2.4 CoreXY 3D printer from individually sourced parts, with mechanical assembly, wiring, firmware setup, and ongoing improvements."
# Put your photo in public/images/projects/ and use its public URL here.
# Example: public/images/projects/amplifier.jpg -> /images/projects/amplifier.jpg
# This existing illustration lets a copied template work until you add a photo.
image: '/images/projects/voron/printer.jpeg'
imageAlt: "My assembled Voron 2.4 3D printer with an illuminated enclosure, visible printhead, and front control screen."
# Add extra photos after the main image by uncommenting this list as files are added.
gallery:
  - src: "/images/projects/voron/printer2.jpeg"
    alt: "A closer look at the printer assembly."
    # caption: "A detail from the build."
# Optional: one quoted date appears as written on the card and project page.
# You can also use a range or "Ongoing". Remove date to hide it; it does not sort projects.
date: "June 2023"
# Optional: remove tools if you do not need technology labels.
tools:
  - Soldering Iron
  - Ender 3
  - Hacksaw
# Optional: smaller numbers appear first on the hub; the default is 0.
sortOrder: 0
---

<!-- Write your project here in Markdown. ## adds a section heading; the
     layout already uses the title above as the main h1. -->

## The idea

I've always enjoyed taking on projects that push me outside my comfort zone, and building a Voron 2.4 was the perfect opportunity to challenge myself. Rather than purchasing a preassembled 3D printer or a complete kit, I wanted to build something entirely from scratch, sourcing every component myself.

My goal wasn't simply to have a capable 3D printer. I wanted to understand how every part of the machine worked, from its mechanical design and electronics to the firmware that brings everything together. I saw it as an opportunity to develop my skills while building a machine that I could continuously modify and improve.

## The build

I chose the Voron 2.4 for its CoreXY motion system, rigid frame, and open-source design. Its emphasis on performance, customization, and community-driven development made it an ideal platform for experimentation.

I sourced the components individually, researching and selecting everything from the aluminum extrusions and linear rails to the stepper motors, electronics, and hardware. Building the printer from the ground up gave me a much deeper understanding of its design and the relationship between its mechanical, electrical, and software systems.

The process involved assembling the frame, wiring the electronics, configuring the firmware, and troubleshooting the inevitable challenges that come with a project of this complexity.

One of my favourite aspects of the build is that it has never really been finished. Since getting the printer running, I've continued to make modifications, experiment with different configurations, and look for opportunities to improve its performance and reliability.

## Results and lessons

The biggest accomplishment wasn't just getting the printer to produce its first successful print. It was knowing that I had built the entire machine myself and understood how the different systems worked together.

Throughout the project, I've gained valuable hands-on experience with mechanical assembly, electrical wiring, motion control, firmware configuration, and troubleshooting.

I've also learned that building something is only the beginning. Fine-tuning a machine, identifying its weaknesses, and implementing improvements can be just as rewarding as the initial assembly.

The Voron has become more than just a tool for producing 3D prints. It's an ongoing engineering project and a platform for learning, experimentation, and problem-solving.

## What's next

I'm currently exploring one of the more ambitious upgrades for the printer: adding multi-material capabilities through a filament-changing or tool-changing system.

A filament changer would allow the printer to automatically switch between different materials or colours, while a tool changer could open the door to entirely new possibilities with multiple independent printheads.

I'm particularly interested in the mechanical, electrical, and software challenges involved in making these systems work reliably.

Like the original build, I don't expect this upgrade to be simple, but that's exactly what makes it exciting. I plan to continue experimenting, refining the machine, and seeing just how far I can push it.

**For me, the Voron 2.4 isn't a finished product. It's a project that continues to evolve alongside my skills and interests.**
