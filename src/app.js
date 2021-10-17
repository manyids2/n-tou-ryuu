const fable = {
  english: [
    "A king, worried that his three sons are without the wisdom to live in a world of wile and guile, asks a learned",
    "man called Vishnu Sharman to teach them the ways of the world.",
    "Since his wards are dimwits, Vishnu Sharman decides to pass on wisdom to them in the form of stories. In",
    "these stories, he makes animals speak like human beings. Panchatantra is a collection of attractively told",
    "stories about the five ways that help the human being succeed in life. Pancha means five and tantra means",
    "ways or strategies or principles. Addressed to the king's children, the stories are primarily about statecraft and",
    "are popular throughout the world. The five strategies are:",
    "1. Discord among friends",
    "2. Gaining friends",
    "3. Of crows and owls",
    "4. Loss of gains",
    "5. Imprudence",
    "The stories have been translated into nearly every language in the world that has a script. The story form",
    "appeals to children while the wisdom in them attracts adults. The Panchatantra collection represents the",
    "earliest folk tale form in the world of literature. There are several versions of Panchatantra tales in circulation",
    "in the world but the one that is popular in India is the Sanskrit original of Vishnu Sharman.",
  ],
  dutch: [
    "Een koning, bezorgd dat zijn drie zonen niet de wijsheid hebben om in een wereld van list en bedrog te leven, vraagt ​​een geleerde",
    "man genaamd Vishnu Sharman om hen de wegen van de wereld te leren.",
    "Omdat zijn pupillen dommeriken zijn, besluit Vishnu Sharman om wijsheid aan hen door te geven in de vorm van verhalen. In",
    "deze verhalen laat hij dieren spreken als mensen. Panchatantra is een verzameling aantrekkelijk verteld",
    "verhalen over de vijf manieren die de mens helpen slagen in het leven. Pancha betekent vijf en tantra betekent",
    "manieren of strategieën of principes. De verhalen, gericht aan de kinderen van de koning, gaan voornamelijk over staatsmanschap en",
    "zijn populair over de hele wereld. De vijf strategieën zijn:",
    "1. Onenigheid onder vrienden",
    "2. Vrienden krijgen",
    "3. Van kraaien en uilen",
    "4. Verlies van winst",
    "5. Onvoorzichtigheid",
    "De verhalen zijn vertaald in bijna elke taal ter wereld die een schrift heeft. De verhaalvorm",
    "spreekt kinderen aan, terwijl de wijsheid in hen volwassenen aantrekt. De Panchatantra-collectie vertegenwoordigt de",
    "vroegste volksverhaalvorm in de wereld van de literatuur. Er zijn verschillende versies van Panchatantra-verhalen in omloop",
    "in de wereld, maar degene die populair is in India is het Sanskriet-origineel van Vishnu Sharman.",
  ],
};

class App {
  constructor(config) {
    this.config = config;
    this.languages = ["english", "dutch"];
    this.fable = fable;
    this.numLines = this.diagnoseFable(fable);
    this.align = {
      english: "left",
      dutch: "left",
    };
    this.order = ["english", "dutch"];
    this.n = 2;
    this.spans = {};

    // Get ref to container
    this.contentDiv = document.getElementById("ryuu-content");
    this.switchBtn = document.getElementById("switch-button");
    this.switchBtn.addEventListener("click", this._cycleOrder);

    this.render();
    this.update();
  }

  _cycleOrder = () => {
    this.order = [...this.order.slice(1), this.order[0]];
    this.update();
  };

  _createLine(line, props) {
    const span = document.createElement("span");
    span.className = `ryuu-line ${props.language} ${props.align}`;
    span.innerText = line;
    return span;
  }

  diagnoseFable(fable) {
    let numLines = [];
    for (const language in fable) {
      numLines.push(fable[language].length);
    }
    return numLines.length > 0 ? numLines[0] : 0;
  }

  render() {
    this.contentDiv.innerHTML = "";
    this.spans = {};
    const numLines = this.diagnoseFable(this.fable);
    for (let index = 0; index < numLines; index++) {
      this.spans[index] = {};
      for (const language in this.fable) {
        const line = this.fable[language][index];
        const props = { language, align: this.align[language] };
        const span = this._createLine(line, props);
        this.contentDiv.appendChild(span);
        this.spans[index][language] = span;
      }
    }
  }

  update() {
    for (let index = 0; index < this.numLines; index++) {
      const showIdx = index % this.n;
      this.order.map((language) => {
        this.spans[index][language].style.display =
          this.order[showIdx] === language ? "block" : "none";
      });
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // window.app = new App({
  //   apiUrl: "http://10.0.0.5:7851",
  // });
});
