class ManagedAudio {
  baseAudio: HTMLAudioElement;
  loaded = false;
  constructor(path) {
    this.baseAudio = new Audio();
    this.baseAudio.setAttribute("preload", "auto");
    this.baseAudio.addEventListener("canplaythrough", () => {
      this.loaded = true;
      AudioControl.loadedCount++;
      if (AudioControl.loadedCount >= AudioControl.amountToLoad) {
        AudioControl._onLoad();
      }
    });
    this.baseAudio.src = path;
    AudioControl.amountToLoad++;
    console.log(AudioControl.amountToLoad);
  }
  play() {
    return this.baseAudio.play();
  }
}
export class AudioControl {
  static amountToLoad = 0;
  static loadedCount = 0;

  static discover_forest = new ManagedAudio("./assets/audio/DiscForest.mp3");
  static hovers = [
    new ManagedAudio("./assets/audio/card_hover_use.mp3"),
    new ManagedAudio("./assets/audio/card_hover2_use.mp3"),
    new ManagedAudio("./assets/audio/card_hover3_use.mp3"),
  ];
  static draw = new ManagedAudio("./assets/audio/card_draw2_use.mp3");
  static hit_table = new ManagedAudio("./assets/audio/card_hit_table_2_use.mp3");
  static shuffle = new ManagedAudio("./assets/audio/suffle_use.mp3");

  static _onLoad: () => void;
  static loadedAudio = new Promise((resolve) => {
    AudioControl._onLoad = resolve;
  });

  static hoverIndex = 0;

  static get hover() {
    this.hoverIndex++;
    if (this.hoverIndex >= this.hovers.length) {
      this.hoverIndex = 0;
    }
    return this.hovers[this.hoverIndex];
  }
}
