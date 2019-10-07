class ManagedAudio {
  baseAudio: HTMLAudioElement;
  loaded = false;
  constructor(path, preload = true) {
    this.baseAudio = new Audio();
    if (preload) {
      this.baseAudio.setAttribute("preload", "auto");
      this.baseAudio.addEventListener("canplaythrough", () => {
        this.loaded = true;
        AudioControl.loadedCount++;
        if (AudioControl.loadedCount >= AudioControl.amountToLoad) {
          AudioControl._onLoad();
        }
      });
      AudioControl.amountToLoad++;
    }
    this.baseAudio.src = path;
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
  static golems = [
    new ManagedAudio("./assets/audio/golem1.mp3"),
    new ManagedAudio("./assets/audio/golem2.mp3"),
    new ManagedAudio("./assets/audio/golem3.mp3"),
    new ManagedAudio("./assets/audio/golem4.mp3"),
    new ManagedAudio("./assets/audio/golem5.mp3"),
    new ManagedAudio("./assets/audio/golem6.mp3"),
    new ManagedAudio("./assets/audio/golem7.mp3"),
    new ManagedAudio("./assets/audio/golem8.mp3"),
    new ManagedAudio("./assets/audio/golem9.mp3"),
    new ManagedAudio("./assets/audio/golem10.mp3"),
    new ManagedAudio("./assets/audio/golem11.mp3"),
    new ManagedAudio("./assets/audio/golem12.mp3"),
    new ManagedAudio("./assets/audio/golem13.mp3"),
    new ManagedAudio("./assets/audio/golem14.mp3"),
    new ManagedAudio("./assets/audio/golem15.mp3"),
  ];
  static draw = new ManagedAudio("./assets/audio/card_draw2_use.mp3");
  static hit_table = new ManagedAudio("./assets/audio/card_hit_table_2_use.mp3");
  static shuffle = new ManagedAudio("./assets/audio/suffle_use.mp3");

  static craft_fail = new ManagedAudio("./assets/audio/craft_fizzle.wav");
  static craft = new ManagedAudio("./assets/audio/crafting.mp3");

  static wood = new ManagedAudio("./assets/audio/ResWood.mp3");
  static rock = new ManagedAudio("./assets/audio/ResRock.mp3");

  static cave = new ManagedAudio("./assets/audio/DiscCave.mp3");
  static mine = new ManagedAudio("./assets/audio/DiscMine.mp3");

  static quest_complete = new ManagedAudio("./assets/audio/QuestComplete.mp3");

  static grove_guardian = new ManagedAudio("./assets/audio/BATULATHIL_GROVE_GUARDIAN.mp3", false);

  static _onLoad: () => void;
  static loadedAudio = new Promise((resolve) => {
    AudioControl._onLoad = resolve;
  });

  static hoverIndex = 0;
  static golemIndex = 0;

  static get hover() {
    this.hoverIndex++;
    if (this.hoverIndex >= this.hovers.length) {
      this.hoverIndex = 0;
    }
    return this.hovers[this.hoverIndex];
  }
  static get golem() {
    this.golemIndex++;
    if (this.golemIndex >= this.golems.length) {
      this.golemIndex = 0;
    }
    return this.golems[this.golemIndex];
  }
}
AudioControl.wood.baseAudio.volume = 0.3;
AudioControl.rock.baseAudio.volume = 0.3;
AudioControl.quest_complete.baseAudio.volume = 0.6;
AudioControl.golems.forEach((golemAudio) => (golemAudio.baseAudio.volume = 0.2));
