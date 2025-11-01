{
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.code === "Comma") {
      e.preventDefault();
      window.open("https://vscode.dev/github" + window.location.pathname, "_blank");
    }
    // if (e.shiftKey && e.code === "Period") {
    //   e.preventDefault();
    //   window.open("https://github.dev" + window.location.pathname, "_blank");
    // }
  });
}
