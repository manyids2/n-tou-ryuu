class App {
  constructor(config) {
    this.config = config;
    this.story = config.story;
    this.languages = config.languages;
    this.n = this.languages.length;
    this.numLines = 0;
    this.spans = {};
    this.content = {};
    this.loading = {};
    this.languages.forEach((language) => {
      this.loading[language] = true;
    });

    // Get ref to container
    this.contentDiv = document.getElementById("ryuu-content");
    this.contentDiv.addEventListener("content-loaded", () => {
      console.log("this.numLines :>> ", this.numLines);
      this.render();
      this.update();
    });

    // Ref to buttons
    this.switchBtn = document.getElementById("switch-button");
    this.switchBtn.addEventListener("click", this._cycleOrder);

    // Ref to navbar
    this.title = document.getElementById("story-name");
    this.title.innerText = this.story;

    this._initContent();
  }

  _initContent() {
    this.languages.forEach((language) => {
      fetch(`_data/${this.story}_${language}.txt`)
        .then((data) => data.text())
        .then((text) => {
          const lines = text.split("\n\n");
          this.content[language] = lines;
          this.loading[language] = false;
          const allLoaded = Object.entries(this.loading).reduce((prev, curr) => {
            return prev && !curr[1];
          }, true);
          if (allLoaded) {
            this.numLines = this.content[this.languages[0]].length;
            this.contentDiv.dispatchEvent(new Event("content-loaded"));
          }
        });
    });
  }

  _cycleOrder = () => {
    this.languages = [...this.languages.slice(1), this.languages[0]];
    this.update();
  };

  _createSpan(index, language) {
    const span = document.createElement("span");
    span.id = `ryuu-line-${index}`;
    span.className = `ryuu-line ${language} notselected`;
    span.innerText = "loading...";
    span.setAttribute("data-language", language);
    return span;
  }

  render() {
    this.contentDiv.innerHTML = "";
    this.spans = {};

    for (let index = 0; index < this.numLines; index++) {
      const tab = document.createElement("div");
      tab.className = `ryuu-tab`;
      tab.setAttribute("data-index", index);

      this.spans[index] = {};
      this.languages.forEach((language) => {
        const span = this._createSpan(index, language);
        this.spans[index][language] = span;
        tab.appendChild(this.spans[index][language]);
      });
      this.contentDiv.appendChild(tab);
    }
  }

  update() {
    for (let index = 0; index < this.numLines; index++) {
      const showIdx = index % this.n;
      this.languages.map((language) => {
        if (this.languages[showIdx] === language) {
          this.spans[index][language].classList.add("selected");
          this.spans[index][language].classList.remove("notselected");
          this.spans[index][language].innerText = this.content[language][index];
        } else {
          this.spans[index][language].classList.add("notselected");
          this.spans[index][language].classList.remove("selected");
          this.spans[index][language].innerText = "&nbsp;";
        }
      });
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new App({
    apiUrl: "http://10.0.0.5:7851",
    languages: ["english", "french"],
    story: "bakers-dozen-saki",
  });
});
