(() => {
  // src/app.js
  var App = class {
    constructor(config) {
      this.config = config;
      this.story = config.story;
      if (window.localStorage.getItem("languages")) {
        this.languages = window.localStorage.getItem("languages").split(",");
      } else {
        window.localStorage.setItem("languages", this.languages.join(","));
      }
      if (window.localStorage.getItem("story")) {
        this.story = window.localStorage.getItem("story");
      } else {
        window.localStorage.setItem("story", this.story);
      }
      this.n = this.languages.length;
      this.numLines = 0;
      this.spans = {};
      this.content = {};
      this.loading = {};
      this.languages.forEach((language) => {
        this.loading[language] = true;
      });
      this.title = document.getElementById("story-name");
      this.title.innerText = this.story;
      this.title.addEventListener("click", this._handleAddRemoveStoryDiv);
      this.storyBack = document.getElementById("story-back");
      this.storyGo = document.getElementById("story-go");
      this.storyBack.addEventListener("click", this._handleStoryBack);
      this.storyGo.addEventListener("click", this._handleStoryGo);
      this.availableStories = config.availableStories;
      this.storyList = document.getElementById("story-list");
      this._renderStoryList();
      this.switchBtn = document.getElementById("switch-button");
      this.switchBtn.addEventListener("click", this._cycleOrder);
      this.addBtn = document.getElementById("add-button");
      this.addBtn.addEventListener("click", this._handleAddRemoveLanguageDiv);
      this.removeBtn = document.getElementById("remove-button");
      this.removeBtn.addEventListener("click", this._handleAddRemoveLanguageDiv);
      this.languageDiv = document.getElementById("language-options");
      this.languageBack = document.getElementById("language-back");
      this.languageGo = document.getElementById("language-go");
      this.languageBack.addEventListener("click", this._handleLanguageBack);
      this.languageGo.addEventListener("click", this._handleLanguageGo);
      this.selectedLanguages = {};
      this.availableLanguages = config.availableLanguages;
      this.availableLanguages.forEach((language) => {
        this.selectedLanguages[language] = this.loading[language] ? true : false;
      });
      this.languageList = document.getElementById("language-list");
      this._renderLanguageList();
      this.storyDiv = document.getElementById("story-options");
      this.storyList = document.getElementById("story-list");
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
        fetch(`_data/${this.story}_${language}.txt`).then((data) => data.text()).then((text) => {
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
    _handleAddRemoveLanguageDiv = () => {
      this.languageDiv.style.display = "flex";
    };
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
    _handleAddRemoveStoryDiv = () => {
      this.storyDiv.style.display = "flex";
    };
    _handleStoryBack = () => {
      this.storyDiv.style.display = "none";
    };
    _handleStoryGo = () => {
      window.localStorage.setItem("story", this.story);
      location.reload();
    };
    _handleSetStory = (e) => {
      const story = e.target.dataset.story;
      this.story = story;
      this._renderStoryList();
    };
    _renderStoryList = () => {
      this.storyList.innerHTML = "";
      this.availableStories.forEach((story) => {
        const item = document.createElement("li");
        item.innerText = story;
        item.setAttribute("data-story", story);
        this.storyList.appendChild(item);
        if (this.story === story) {
          item.classList.add("selected-story");
        }
        item.addEventListener("click", this._handleSetStory);
      });
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
            this.spans[index][language].innerText = " ";
            this.spans[index][language].style.width = `${1 / (this.languages.length - 1)}rem`;
          }
        });
      }
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    const config = {
      languages: ["english", "dutch"],
      availableLanguages: ["english", "dutch", "french", "german", "spanish", "hindi", "tamil", "bengali"],
      availableStories: ["burial-of-the-minnisink", "bakers-dozen-saki"],
      story: "burial-of-the-minnisink"
    };
    window.app = new App(config);
  });
})();
