# Illustration index

Images are discovered from `images/` at build time. Add a file to the relevant folder, then add a record below when it needs a caption, credit, alt-text override, fixed-page assignment, or project association. Images placed in `images/generated/<section>/` are discovered and published using that section's collection; use a path such as `generated/ai/new-study.webp` for optional overrides below. Section pages and content entries rotate through their own associated collection on visits. The homepage's main brain is pinned; its smaller margin drawings may rotate independently. Captions are reader-facing; credits remain in this manifest. Original illustrations are not historical documents or portraits of the people who inspired them.

```toml
[[illustration]]
file = "home/brain-study.webp"
slot = "home-brain"
section = "home"
fixed = true
alt = "Original graphite-style anatomical brain study on transparent paper"
caption = "Brain study"
credit = "Original illustration; inspired by the visual reference, not a reproduction"

[[illustration]]
file = "home/pressed-poppy.webp"
slot = "home-poppy"
section = "home"
alt = "Pressed poppy illustration in pencil and muted burgundy"
caption = "Poppy"
credit = "Original illustration"

[[illustration]]
file = "home/writer-study.webp"
slot = "home-writer"
section = "home"
alt = "Anonymous writer at a desk, an original graphite study"
caption = ""
credit = "Original imagined figure; not a portrait of Sylvia Plath"

[[illustration]]
file = "home/brain-study.png"
exclude = true

[[illustration]]
file = "home/pressed-poppy.png"
exclude = true

[[illustration]]
file = "home/writer-study.png"
exclude = true

[[illustration]]
file = "about/profile.jpg"
slot = "portrait"
section = "about"
fixed = true
alt = "Musi outdoors near a lake"
caption = "Musi"

[[illustration]]
file = "home/neuron-study.svg"
section = "home"
alt = "Diagram of a neuron with dendrites, cell body, and axon"
caption = ""
exclude = true
credit = "Original SVG illustration"

[[illustration]]
file = "home/synapse-study.svg"
section = "home"
alt = "Diagram of neurotransmitter release across a synaptic cleft"
caption = ""
exclude = true
credit = "Original SVG illustration"

[[illustration]]
file = "projects/ai/layered-network.svg"
section = "ai"
exclude = true
credit = "Original technical diagram, retained as a source asset"

[[illustration]]
file = "projects/ai/computational-graph.svg"
section = "ai"
exclude = true
credit = "Original technical diagram, retained as a source asset"

[[illustration]]
file = "projects/neuroscience-psychiatry/neuron-cell.svg"
section = "neuroscience-psychiatry"
exclude = true
credit = "Original technical diagram, retained as a source asset"

[[illustration]]
file = "projects/neuroscience-psychiatry/prediction-loop.svg"
section = "neuroscience-psychiatry"
exclude = true
credit = "Original conceptual diagram, not a validated clinical model"

[[illustration]]
file = "projects/other/data-workflow.svg"
section = "other"
exclude = true
credit = "Original technical diagram, retained as a source asset"

[[illustration]]
file = "projects/other/decision-tree.svg"
section = "other"
exclude = true
credit = "Original technical diagram, retained as a source asset"

[[illustration]]
file = "projects/ai/quiet-nodes.svg"
section = "ai"
alt = ""
credit = "Original abstract SVG study"

[[illustration]]
file = "projects/ai/fading-model.svg"
section = "ai"
alt = ""
credit = "Original abstract SVG study"

[[illustration]]
file = "home/textbook-neuron.webp"
section = "home"
position = "lower-left"
alt = "A hand-drawn biological neuron study in an old textbook style"
caption = ""
width = 667
height = 1000
credit = "Original generated illustration; a decorative biological study, not a teaching figure"

[[illustration]]
file = "generated/home/network-brain-study.webp"
section = "home"
position = "lower-left"
alt = "A soft anatomical brain study fading into delicate network branches"
caption = ""
width = 1050
height = 700
credit = "Original generated illustration; the main homepage brain remains fixed"

[[illustration]]
file = "generated/home/right-margin-neural-fragment.webp"
section = "home"
position = "right-margin"
alt = "A delicate brain and neural branches in a faded graphite study"
caption = ""
width = 1050
height = 700
credit = "Original generated illustration; a small marginal study"

[[illustration]]
file = "research/textbook-neuron.webp"
section = "research"
alt = "A biological neuron drawn as a vintage textbook specimen"
caption = ""
width = 667
height = 1000
credit = "Original generated illustration; a decorative biological study, not a teaching figure"

[[illustration]]
file = "generated/research/loose-curves.webp"
section = "research"
alt = "A loose graphite observation with a faint curved line"
caption = ""
width = 1050
height = 700
credit = "Original generated abstract study"

[[illustration]]
file = "thoughts/poetry-notebook.webp"
section = "thoughts"
alt = "An open notebook with a pressed burgundy poppy"
caption = ""
width = 1000
height = 667
credit = "Original generated symbolic study; not a historical journal page"

[[illustration]]
file = "thoughts/mountain-walk.webp"
section = "thoughts"
alt = "A lone walker on a mountain path beneath a distant bird"
caption = ""
width = 667
height = 1000
credit = "Original generated symbolic study prompted by existential writing; not a portrait"

[[illustration]]
file = "thoughts/dream-couch.webp"
section = "thoughts"
alt = "An empty old couch beneath a loose, dreamlike charcoal shadow"
caption = ""
width = 667
height = 1000
credit = "Original generated symbolic study prompted by psychoanalytic writing; not a portrait"

[[illustration]]
file = "thoughts/lantern-path.webp"
section = "thoughts"
alt = "A solitary figure carrying a lantern across a winter field toward a lit window"
caption = ""
width = 667
height = 1000
credit = "Original generated symbolic study prompted by writing on meaning; not a portrait"

[[illustration]]
file = "projects/ai/sleeping-graph.svg"
section = "ai"
alt = ""
credit = "Original abstract SVG study"

[[illustration]]
file = "projects/neuroscience-psychiatry/faint-cortex.svg"
section = "neuroscience-psychiatry"
alt = ""
page = "med_data"
placement = "right"
credit = "Original abstract anatomical study"

[[illustration]]
file = "projects/neuroscience-psychiatry/sparse-neuron.svg"
section = "neuroscience-psychiatry"
alt = ""
credit = "Original abstract neuron study"

[[illustration]]
file = "projects/neuroscience-psychiatry/memory-trace.svg"
section = "neuroscience-psychiatry"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "projects/other/open-leaves.svg"
section = "other"
alt = ""
credit = "Original botanical study"

[[illustration]]
file = "projects/other/window-study.svg"
section = "other"
alt = ""
credit = "Original abstract window study"

[[illustration]]
file = "projects/other/paper-stack.svg"
section = "other"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "blog/folded-letter.svg"
section = "blog"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "blog/quiet-typewriter.svg"
section = "blog"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "blog/window-reader.svg"
section = "blog"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "blog/profile-study.png"
section = "blog"
alt = ""
width = 640
height = 427
credit = "Original generated figure study; not a historical portrait"

[[illustration]]
file = "scrapper/fleeting-thought.svg"
section = "scrapper"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "scrapper/loose-thread.svg"
section = "scrapper"
alt = ""
credit = "Original abstract study"

[[illustration]]
file = "scrapper/pressed-leaf.svg"
section = "scrapper"
alt = ""
credit = "Original botanical study"

[[illustration]]
file = "thoughts/hollow-profile.svg"
section = "thoughts"
alt = ""
credit = "Original abstract figure study"

[[illustration]]
file = "thoughts/held-hands.svg"
section = "thoughts"
alt = ""
credit = "Original abstract figure study"

[[illustration]]
file = "thoughts/pressed-flower.svg"
section = "thoughts"
alt = ""
credit = "Original botanical study"

[[illustration]]
file = "generated/ai/organic-network-study.webp"
section = "ai"
alt = "A pale, branching abstract network drawn in graphite"
caption = ""
credit = "Original generated abstract artwork"

[[illustration]]
file = "generated/ai/latent-model-study.webp"
section = "ai"
alt = "A faint, smoky graphite study with a curved line across warm paper"
caption = ""
credit = "Original generated abstract artwork"

[[illustration]]
file = "generated/neuroscience-psychiatry/biological-neuron-study.webp"
section = "neuroscience-psychiatry"
alt = "A biological neuron drawn in a faded pencil style"
caption = ""
credit = "Original generated biological study; decorative, not a teaching figure"

[[illustration]]
file = "generated/neuroscience-psychiatry/brain-study.webp"
section = "neuroscience-psychiatry"
alt = "An anatomical brain study rendered in graphite on warm paper"
caption = ""
credit = "Original generated anatomical study; decorative, not a research result"

[[illustration]]
file = "generated/about/open-notebook-flower.webp"
section = "about"
alt = "An open notebook with a pressed flower study"
caption = ""
credit = "Original generated notebook study"

[[illustration]]
file = "generated/about/pressed-poppy-notebook.webp"
section = "about"
alt = "A pressed poppy resting on an open notebook"
caption = ""
credit = "Original generated notebook study"

[[illustration]]
file = "generated/blog/exec-1d3982ef-8a7c-4314-bb6a-560358d71123.png"
section = "blog"
alt = "A quiet, softly drawn profile study fading into the paper"
caption = ""
width = 1774
height = 887
credit = "Original illustration"

[[illustration]]
file = "generated/blog/exec-9f7e701a-fd82-438a-8e3b-9738b361f2f4.png"
section = "blog"
alt = "A writing desk and open notebook beside a rain-streaked window"
caption = ""
width = 1024
height = 1536
credit = "Original illustration"

[[illustration]]
file = "generated/research/notebook-study-014.png"
section = "research"
alt = "A small solitary figure among loose, fading graphite forms"
caption = ""
width = 1374
height = 1145
credit = "Original symbolic illustration"

[[illustration]]
file = "generated/research/notebook-study-018.png"
section = "research"
alt = "A faint portrait study with delicate pencil marks"
caption = ""
width = 1024
height = 1536
credit = "Original symbolic illustration"

[[illustration]]
file = "generated/scrapper/notebook-fragment.png"
section = "scrapper"
alt = "An open notebook with a pressed flower"
caption = ""
width = 1536
height = 1024
credit = "Reused original illustration from the existing image collection"

# To pin an asset to one entry, add page = "my-note" (filename stem). For a
# project-specific collection, use projects = ["fortran-neural-network-library"]
# on each associated illustration. Project frontmatter can also list
# "illustrations": ["projects/ai/layered-network.svg"]. Without these overrides,
# project pages draw only from their matching subsection folder.
# Set exclude = true to keep an image discoverable but out of rotation.
```
