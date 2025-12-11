function createSnowflake() {
  const snowflake = document.createElement("span");
  snowflake.textContent = "❄";
  snowflake.style.position = "fixed";
  snowflake.style.top = "-2vh";
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.fontSize = Math.random() * 12 + 12 + "px";
  snowflake.style.opacity = Math.random() * 0.5 + 0.5;
  snowflake.style.pointerEvents = "none";
  snowflake.style.zIndex = 9999;
  document.body.appendChild(snowflake);

  const duration = Math.random() * 5 + 10; // 10-15s
  const endLeft = Math.random() * 100 + "vw";
  snowflake.animate(
    [
      { transform: `translateY(0)`, left: snowflake.style.left },
      { transform: `translateY(100vh)`, left: endLeft },
    ],
    {
      duration: duration * 1000,
      easing: "linear",
    }
  );

  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}

setInterval(createSnowflake, 500);
