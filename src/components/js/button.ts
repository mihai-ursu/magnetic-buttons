import { gsap } from "gsap";
import { lerp, getMousePos, distance } from "../helpers/helpers";

interface ButtonElements {
  button: HTMLElement;
  text?: HTMLElement;
  textinner?: HTMLElement;
  filler?: HTMLElement;
}

// Track the mouse position
let mousepos: { x: number; y: number } = { x: 0, y: 0 };
window.addEventListener(
  "mousemove",
  (ev: MouseEvent) => (mousepos = getMousePos(ev)),
);

// amounts the button will translate
let renderedStyles: {
  [key: string]: { previous: number; current: number; amt: number };
} = {
  tx: { previous: 0, current: 0, amt: 0.1 },
  ty: { previous: 0, current: 0, amt: 0.1 },
};

let animationFrameId: number | null = null;

// button state (hover)
let state: { hover: boolean } = {
  hover: false,
};

function calculateSizePosition(buttonElements: {
  button: HTMLElement;
}): number {
  // size/position
  let rect: DOMRect = buttonElements.button.getBoundingClientRect();
  // the movement will take place when the distance from the mouse to the center of the button is lower than this value
  return rect.width * 0.7;
}

function getButtonCenter(button: HTMLElement) {
  const rect = button.getBoundingClientRect();
  const horizontalCenter = rect.left + rect.width / 2;
  const verticalCenter = rect.top + rect.height / 2;
  return { horizontalCenter, verticalCenter };
}

function calculateDistanceToMouse(buttonCenter: {
  horizontalCenter: number;
  verticalCenter: number;
}) {
  return distance(
    mousepos.x + window.scrollX,
    mousepos.y + window.scrollY,
    buttonCenter.horizontalCenter,
    buttonCenter.verticalCenter,
  );
}

function updateRenderedStyles(x: number, y: number) {
  renderedStyles["tx"].current = x;
  renderedStyles["ty"].current = y;

  for (const key in renderedStyles) {
    renderedStyles[key].previous = lerp(
      renderedStyles[key].previous,
      renderedStyles[key].current,
      renderedStyles[key].amt,
    );
  }
}

function render(buttonElements: ButtonElements, distanceToTrigger: number) {
  const buttonCenter = getButtonCenter(buttonElements.button);
  const distanceMouseButton = calculateDistanceToMouse(buttonCenter);

  let x = 0,
    y = 0;

  if (distanceMouseButton < distanceToTrigger) {
    if (!state.hover) {
      enter(buttonElements);
    }
    x = (mousepos.x + window.scrollX - buttonCenter.horizontalCenter) * 0.3;
    y = (mousepos.y + window.scrollY - buttonCenter.verticalCenter) * 0.3;
  } else if (state.hover) {
    leave(buttonElements);
  }

  updateRenderedStyles(x, y);

  buttonElements.button.style.transform = `translate3d(${renderedStyles["tx"].previous}px, ${renderedStyles["ty"].previous}px, 0)`;

  if (!buttonElements.text) return;

  buttonElements.text.style.transform = `translate3d(${-renderedStyles["tx"].previous * 0.6}px, ${-renderedStyles["ty"].previous * 0.6}px, 0)`;

  animationFrameId = requestAnimationFrame(() =>
    render(buttonElements, distanceToTrigger),
  );
}

function enter(buttonElements: ButtonElements): void {
  state.hover = true;
  buttonElements.button.classList.add("button--hover");
  document.body.classList.add("active");

  if (
    !buttonElements.text ||
    !buttonElements.textinner ||
    !buttonElements.filler
  )
    return;

  gsap.killTweensOf(buttonElements.filler);
  gsap.killTweensOf(buttonElements.textinner);

  gsap
    .timeline()
    .to(buttonElements.filler, {
      duration: 0.5,
      ease: "Power3.easeOut",
      startAt: { y: "75%" },
      y: "0%",
    })
    .to(
      buttonElements.textinner,
      { duration: 0.1, ease: "Power3.easeOut", opacity: 0, y: "-10%" },
      0,
    )
    .to(
      buttonElements.textinner,
      {
        duration: 0.25,
        ease: "Power3.easeOut",
        opacity: 1,
        startAt: { y: "30%", opacity: 1 },
        y: "0%",
      },
      0.1,
    );
}
function leave(buttonElements: ButtonElements): void {
  state.hover = false;
  buttonElements.button.classList.remove("button--hover");
  document.body.classList.remove("active");

  if (
    !buttonElements.text ||
    !buttonElements.textinner ||
    !buttonElements.filler
  )
    return;

  gsap.killTweensOf(buttonElements.filler);
  gsap.killTweensOf(buttonElements.textinner);

  gsap
    .timeline()
    .to(buttonElements.filler, {
      duration: 0.5,
      ease: "Power3.easeOut",
      startAt: { y: "0%" },
      y: "85%",
    })
    .to(
      buttonElements.textinner,
      {
        duration: 0.25,
        ease: "Power3.easeOut",
        opacity: 1,
        startAt: { y: "100%", opacity: 1 },
        y: "0%",
      },
      0.1,
    );

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

export default function buttonCtrl(button: HTMLElement | null): void {
  if (!button) return;

  let buttonElements: ButtonElements = { button: button };
  buttonElements.text = buttonElements.button.querySelector(
    ".button__text",
  ) as HTMLElement;
  buttonElements.textinner = buttonElements.button.querySelector(
    ".button__text-inner",
  ) as HTMLElement;
  buttonElements.filler = buttonElements.button.querySelector(
    ".button__filler",
  ) as HTMLElement;

  // calculate size/position
  let distanceToTrigger: number = calculateSizePosition(buttonElements);

  // loop fn
  requestAnimationFrame(() => render(buttonElements, distanceToTrigger));
}
