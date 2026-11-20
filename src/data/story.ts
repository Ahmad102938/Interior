/**
 * Hero storyline — "From Blueprint to Building".
 * One building transforms in front of the visitor: drawing → digital model →
 * construction site → fitted-out interior (the camera steps inside) →
 * the finished building at dusk. Copy is kept short enough to
 * read in the time each stage is on screen.
 */
export const storyIntro = {
  eyebrow: "Architecture · Interiors · Construction",
  title: "From Blueprint",
  accent: "to Building.",
  copy: "We design buildings and the spaces inside them — then construct them, end to end. Scroll to watch one take shape.",
  primary: { label: "Start your project", href: "/request-a-quote" },
  secondary: { label: "Our services", href: "/services" },
};

export type StoryChapter = {
  key: "design" | "plan" | "build" | "handover" | "interior";
  number: string;
  label: string;
  heading: string;
  copy: string;
  tags: string[];
};

export const storyChapters: StoryChapter[] = [
  {
    key: "design",
    number: "01",
    label: "Design",
    heading: "It starts on the drawing board.",
    copy: "Every building begins as a plan — massed, zoned and modelled before anything is ordered.",
    tags: ["Space planning", "Design coordination", "2D drawings", "3D visualisation"],
  },
  {
    key: "plan",
    number: "02",
    label: "Plan",
    heading: "Engineered before we break ground.",
    copy: "Services, quantities and schedules are coordinated in the model, so the site has no surprises.",
    tags: ["Working drawings", "BOQ & costing", "MEP coordination", "Procurement"],
  },
  {
    key: "build",
    number: "03",
    label: "Build",
    heading: "Then it becomes real.",
    copy: "Our site teams turn the drawings into concrete and steel — floor by floor, supervised and quality-checked at every stage.",
    tags: ["Civil & structure", "MEP installation", "Site supervision", "Quality checks"],
  },
  {
    key: "interior",
    number: "04",
    label: "Interior",
    heading: "Step inside.",
    copy: "Workplaces designed and fitted out end to end — light, joinery, planting and services, delivered as one.",
    tags: ["Interior design", "Joinery & fit-out", "Lighting & MEP", "Turnkey delivery"],
  },
  {
    key: "handover",
    number: "05",
    label: "Handover",
    heading: "Delivered. Ready for business.",
    copy: "Façade, interiors, landscape and final snags closed — handed over complete, documented and ready to use.",
    tags: ["Façade & glazing", "Landscape", "Snag closure", "Handover"],
  },
];

export const storyOutro = {
  primary: { label: "View projects", href: "/projects" },
  secondary: { label: "Request a quote", href: "/request-a-quote" },
  alsoLine: "Also delivering Telecom & Solar infrastructure",
  alsoHref: "#verticals",
};
