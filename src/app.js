class App {
  constructor(config) {
    this.config = config;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new App({
    apiUrl: "http://10.0.0.5:7851",
  });
});
