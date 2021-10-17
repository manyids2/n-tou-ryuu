class App {
  constructor(config) {
    this.config = config;
    this.story = config.story;

    if (window.localStorage.getItem("languages")) {
      this.languages = window.localStorage.getItem("languages").split(",");
    } else {
      window.localStorage.setItem("languages", this.languages.join(","));
    }

    this.n = this.languages.length;
    this.numLines = 0;
    this.spans = {};
    this.content = {};
    this.loading = {};
    this.languages.forEach((language) => {
      this.loading[language] = true;
    });

    // Ref to navbar
    this.title = document.getElementById("story-name");
    this.title.innerText = this.story;

    // Ref to buttons
    this.switchBtn = document.getElementById("switch-button");
    this.switchBtn.addEventListener("click", this._cycleOrder);

    this.addBtn = document.getElementById("add-button");
    this.addBtn.addEventListener("click", this._handleAddRemove);

    this.removeBtn = document.getElementById("remove-button");
    this.removeBtn.addEventListener("click", this._handleAddRemove);

    // Modals
    this.languageDiv = document.getElementById("language-options");
    this.languageBack = document.getElementById("language-back");
    this.languageGo = document.getElementById("language-go");
    this.languageBack.addEventListener("click", this._handleLanguageBack);
    this.languageGo.addEventListener("click", this._handleLanguageGo);

    // Lists
    this.selectedLanguages = {};
    this.availableLanguages = config.availableLanguages;
    this.availableLanguages.forEach((language) => {
      this.selectedLanguages[language] = this.loading[language] ? true : false;
    });
    this.languageList = document.getElementById("language-list");
    this._renderLanguageList();

    this.storyDiv = document.getElementById("story-options");
    this.storyList = document.getElementById("story-list");

    // Get ref to container
    this.contentDiv = document.getElementById("ryuu-content");
    this.contentDiv.addEventListener("content-loaded", () => {
      console.log("this.numLines :>> ", this.numLines);
      this.render();
      this.update();
    });

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

  _handleAddRemoveLanguage = (e) => {
    const language = e.target.dataset.language;
    this.selectedLanguages[language] = !this.selectedLanguages[language];
    this._renderLanguageList();
  };

  _renderLanguageList = () => {
    this.languageList.innerHTML = "";
    this.availableLanguages.forEach((language) => {
      const item = document.createElement("li");
      item.innerText = language;
      item.setAttribute("data-language", language);
      if (this.selectedLanguages[language]) {
        item.classList.add("selected-language");
      }
      item.addEventListener("click", this._handleAddRemoveLanguage);
      this.languageList.appendChild(item);
    });
  };

  _handleLanguageBack = () => {
    this.languageDiv.style.display = "none";
  };

  _handleLanguageGo = () => {
    const languages = [];
    for (const language in this.selectedLanguages) {
      this.selectedLanguages[language] && languages.push(language);
    }
    window.localStorage.setItem("languages", languages);
    location.reload();
  };

  _handleAddRemove = () => {
    console.log("addremove :>> ");
    this.languageDiv.style.display = "flex";
  };

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
          this.spans[index][language].style.width = "calc(85vw - 1rem)";
        } else {
          this.spans[index][language].classList.add("notselected");
          this.spans[index][language].classList.remove("selected");
          this.spans[index][language].innerText = "&nbsp;";
          this.spans[index][language].style.width = `${1 / (this.languages.length - 1)}rem`;
        }
      });
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const config = {
    languages: ["english", "dutch"],
    availableLanguages: ["english", "dutch", "french", "german", "spanish", "hindi", "tamil", "bengali"],
    story: "burial-of-the-minnisink",
  };

  window.app = new App(config);
});
