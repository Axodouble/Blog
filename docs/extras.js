// If it is December or January, add falling snowflakes to the page
const now = new Date();
if (now.getMonth() === 11 || now.getMonth() === 0) {
  setInterval(() => spawnEffect("❄", "topdown"), 500);
  setInterval(() => spawnEffect("🎅", "topdown"), 10000);
}

// If it is Halloween (October 31), add floating pumpkins to the page
if (now.getMonth() === 9 && now.getDate() === 31) {
  setInterval(() => spawnEffect("🎃", "bottomup"), 5000);
}

// If it is Valentine's Day (February 14), add floating hearts to the page
if (now.getMonth() === 1 && now.getDate() === 14) {
  setInterval(() => spawnEffect("❤️", "bottomup"), 500);
}

// If it is my birthday (October 5)
if (now.getMonth() === 9 && now.getDate() === 5) {
  setInterval(() => spawnEffect("🎉", "topdown"), 1500);
  setInterval(() => spawnEffect("🎂", "topdown"), 3000);
  setInterval(() => spawnEffect("🥳", "topdown"), 1500);
  setInterval(() => spawnEffect("happy birthday axodouble", "topdown"), 5000);
}

// If it is my love's birthday (June 16)
if (now.getMonth() === 5 && now.getDate() === 16) {
  setInterval(() => spawnEffect("💖", "bottomup"), 1500);
  setInterval(() => spawnEffect("🌹", "bottomup"), 3000);
  setInterval(() => spawnEffect("💕", "bottomup"), 3000);
  setInterval(() => spawnEffect("😍", "bottomup"), 5000);
}

/**
 *
 * @param {string} effectChar The character to use for the effect
 * @param {"topdown" | "bottomup"} pattern
 */
function spawnEffect(effectChar, pattern) {
  const effect = document.createElement("span");
  effect.textContent = effectChar;
  effect.style.position = "fixed";
  effect.style.textAlign = "center";
  effect.style.display = "flex";
  effect.style.alignItems = "center";
  effect.style.justifyContent = "center";
  effect.style.left = Math.random() * 100 + "vw";
  effect.style.fontSize = Math.random() * 12 + 12 + "px";
  effect.style.opacity = Math.random() * 0.5 + 0.5;
  effect.style.pointerEvents = "none";
  effect.style.zIndex = 9999;
  document.body.appendChild(effect);

  const duration = Math.random() * 5 + 10; // 10-15s
  const endLeft = Math.random() * 100 + "vw";

  if (pattern === "topdown") {
    effect.style.top = "-2vh";

    effect.animate(
      [
        { transform: `translateY(0)`, left: effect.style.left },
        { transform: `translateY(100vh)`, left: endLeft },
      ],
      {
        duration: duration * 1000,
        easing: "linear",
      }
    );
  } else if (pattern === "bottomup") {
    effect.style.bottom = "-2vh";

    effect.animate(
      [
        { transform: `translateY(0)`, left: effect.style.left },
        { transform: `translateY(-100vh)`, left: endLeft },
      ],
      {
        duration: duration * 1000,
        easing: "linear",
      }
    );
  }

  if (effectChar === "🎅") {
    effect.style.pointerEvents = "auto";
    effect.style.cursor = "pointer";

    effect.addEventListener("click", () => {
      effect.textContent = "💥";
      effect.animate([{ opacity: "100%" }, { opacity: "0%" }], {
        duration: 500,
        easing: "linear",
      });
      setTimeout(() => {
        effect.style.opacity = "0%";
        effect.remove();
      }, 500);
    });
  }

  setTimeout(() => {
    effect.remove();
  }, duration * 1000);
}
