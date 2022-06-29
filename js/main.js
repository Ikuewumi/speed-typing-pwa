"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Game_timeT;
class Game {
    constructor(object) {
        _Game_timeT.set(this, 0);
        this.wrapper = object.wrapper;
        this.formEl = object.formEl;
        this.openBtn = object.openBtn;
        this.blitzmode = false;
        this.formEls = {
            type: this.formEl.type,
            mode: this.formEl.mode,
            time: this.formEl.time
        };
        Object.values(this.formEls).forEach((val) => {
            if (!val)
                throw new DOMException('something went wrong');
            val.disabled = true;
        });
        this.timeEl = object.timeEl;
        this.wordEl = object.wordEl;
        this.inputEl = object.inputEl;
        this.words = [...object.words];
        if (this.words.length <= 0)
            throw new DOMException('something went wrong');
        this.scoreObject = object.scoreObject;
        this.timerId = null;
        this.time = 0;
        this.score = 0;
        this.running = false;
        this.index = 0;
        Object.defineProperties(this, {
            words: {
                enumerable: false,
                configurable: false,
                writable: false
            },
            timerId: {
                enumerable: false
            },
            time: {
                enumerable: false
            },
            score: {
                enumerable: false
            }
        });
    }
    static getTime(string) {
        let time;
        switch (string) {
            case 'one':
                time = 60 * 1;
                break;
            case 'two':
                time = 60 * 2;
                break;
            case 'five':
                time = 60 * 5;
                break;
            default:
                time = 0;
                break;
        }
        return time;
    }
    static getModeTime(string) {
        let time;
        switch (string) {
            case 'easy':
                time = 5;
                break;
            case 'medium':
                time = 3;
                break;
            case 'hard':
                time = 2;
                break;
            default:
                time = 0;
                break;
        }
        return time;
    }
    getModes() {
        var _a;
        this.formEls.type.disabled = false;
        if (((_a = this.formEls) === null || _a === void 0 ? void 0 : _a.type.value) === 'blitz') {
            this.blitzmode = true;
            __classPrivateFieldSet(this, _Game_timeT, Game.getTime(this.formEls.time.value), "f");
            this.formEls.time.disabled = false;
            this.formEls.mode.disabled = true;
        }
        else {
            this.blitzmode = false;
            __classPrivateFieldSet(this, _Game_timeT, Game.getModeTime(this.formEls.mode.value), "f");
            this.formEls.time.disabled = true;
            this.formEls.mode.disabled = false;
        }
    }
    static getInstance(object) {
        if (!Game.instance) {
            Game.instance = new Game(object);
        }
        return Game.instance;
    }
    startClock() {
        if (!this.running) {
            return;
        }
        this.time = __classPrivateFieldGet(this, _Game_timeT, "f");
        this.timeEl.textContent = `${this.time}`;
        return this;
    }
    runClock() {
        this.timerId = setInterval(() => {
            if (this.time <= 0 || !this.running) {
                this.stopClock().stopGame();
            }
            else {
                this.time -= 1;
            }
            this.timeEl.textContent = `${this.time}`;
        }, 1000);
    }
    stopClock() {
        clearInterval(this.timerId);
        this.setStorage();
        return this;
    }
    stopGame() {
        this.running = false;
    }
    setStorage() {
        this.highScore = Game.getHighScore();
        if (!this.blitzmode) {
            if (this.highScore[this.formEls.mode.value] < this.score) {
                this.highScore[this.formEls.mode.value] = this.score;
            }
        }
        else {
            if (this.highScore[this.formEls.time.value] < this.score) {
                this.highScore[this.formEls.time.value] = this.score;
            }
        }
        localStorage.setItem('speedtyping', JSON.stringify(this.highScore));
    }
    play(index) {
        if (!this.running) {
            return;
        }
        this.scoreObject.score.textContent = `${this.score}`;
        this.index = index;
        this.inputEl.value = '';
        this.inputEl.focus();
        this.wordEl.textContent = this.words[this.index];
        this.inputEl.addEventListener('keyup', (e) => {
            if (e.key === " ") {
                this.stopClock();
                this.stopGame();
                this.init();
                return;
            }
            if (!this.running) {
                return;
            }
            const correct = this.inputEl.value.trim().toLowerCase() === this.words[this.index];
            if (correct) {
                this.score += 1;
                if (!this.blitzmode) {
                    this.time = __classPrivateFieldGet(this, _Game_timeT, "f");
                    this.timeEl.textContent = `${this.time}`;
                }
                else {
                }
                this.play(this.randomize());
                return;
            }
        });
    }
    static getHighScore() {
        const highScore = {
            easy: 0,
            medium: 0,
            hard: 0,
            one: 0,
            two: 0,
            five: 0
        };
        if (typeof JSON.parse(localStorage.getItem('speedtyping')) === 'object') {
            const object = JSON.parse(localStorage.getItem('speedtyping'));
            highScore.easy = +(object === null || object === void 0 ? void 0 : object.easy) || 0;
            highScore.medium = +(object === null || object === void 0 ? void 0 : object.medium) || 0;
            highScore.hard = +(object === null || object === void 0 ? void 0 : object.hard) || 0;
            highScore.one = +(object === null || object === void 0 ? void 0 : object.one) || 0;
            highScore.two = +(object === null || object === void 0 ? void 0 : object.two) || 0;
            highScore.five = +(object === null || object === void 0 ? void 0 : object.five) || 0;
        }
        return highScore;
    }
    displayHighScore() {
        if (this.blitzmode) {
            this.scoreObject.highScore.textContent = `${this.highScore[this.formEls.time.value]}`;
        }
        else {
            this.scoreObject.highScore.textContent = `${this.highScore[this.formEls.mode.value]}`;
        }
    }
    randomize() {
        return Math.floor(Math.random() * this.words.length);
    }
    init() {
        var _a;
        this.getModes();
        this.highScore = Game.getHighScore();
        this.displayHighScore();
        this.score = 0;
        this.running = true;
        (_a = this.startClock()) === null || _a === void 0 ? void 0 : _a.runClock();
        this.play(this.randomize());
        return this;
    }
    startGame() {
        this.init().listen();
    }
    listen() {
        this.openBtn.addEventListener('click', () => this.toggleTab());
        this.wrapper.addEventListener('click', (e) => {
            if (e.target !== this.wrapper)
                return;
            this.toggleTab();
        });
        this.formEl.addEventListener('change', (e) => {
            this.getModes();
        });
        return this;
    }
    toggleTab() {
        this.stopClock().stopGame();
        this.wrapper.classList.toggle('active');
        if (this.wrapper.classList.contains('active')) {
            this.getModes();
        }
        else {
            this.init();
            Object.values(this.formEls).forEach((val) => val.disabled = true);
        }
        return this;
    }
}
_Game_timeT = new WeakMap();
console.log("Working in TypeScript + VSCode + Vite");
const board = document.querySelector('main');
const timeEl = board.querySelector('time');
const wordEl = board.querySelector('#output__word');
const inputEl = board.querySelector('#input__word');
const scoreEl = board.querySelector('#score strong');
const highScoreEl = board.querySelector('#highscore strong');
const settingsBtn = board.querySelector('#settings');
const tab = document.querySelector('article#extras');
const form = tab.querySelector('form');
const words = [
    "doctor",
    "psalmist",
    "cytoplasm",
    "reward",
    "yesterday",
    "timing",
    "operation",
    "surgeon",
    "arsenal",
    "weapons",
    "environment",
    "condensation",
    "genius",
    "hummingbird",
    "university",
    "excruciating",
    "development",
    "eisenmenger",
    "hypercholesterolemia",
    "peace",
    "warpath",
    "rhomboid",
    "truncate",
    "override",
    "schism",
    "lucky",
    "marriage",
    "celebration",
    "fundamental",
    "citizenship",
    "revenue",
    "summary",
    "economy",
    "challenge",
    "conflict",
    "extremist",
    "malignancy",
    "coordination",
    "cognitive",
    "peroxisome",
    "periscope",
    "nosemask",
    "kilmanjaro",
    "football",
    "hemoglobin",
    "psychology",
    "entrepreneurship",
    "friend",
    "planetarium", "journalism", "amalgamation", "chylomicron", "genus",
    "armaggedon", "recreation", "lincoln", "youth", "flower", "interdenominational", "trapezium",
    "mapleleaf", "pisiform", "panther", "widow", "aristotle", "testosterone",
    "marigold", "carina", "trachea", "iatrogenic", "anasthesia", "fibrinogen",
    "aeration", "amazing", "humanoid", "osteology", "schistosomiasis", "plateau",
    "interactionalism", "newtonian", "hernia", "saccharin", "hydroxyquinone", "idiopathic",
    "blastocyst", "fantastic", "arachnid", "neanderthals", "riverine", "vitiligo",
    "complaint", "relinquish", "forgo", "forsake",
    "fluster", "disconcert", "discomfort", "discompose",
    "renounce", "abandon",
    "spur", "incite",
    "curtail", "diminish", "retrench",
    "protract", "elongate", "amplify",
    "annul", "nullify", "rescind", "void",
    "temperate",
    "scholastic",
    "demur",
    "concord", "concurrence",
    "caustic", "acerb", "pungent", "tart", "mordant", "acrid",
    "perspicacity", "discernment", "perception",
    "chide", "caution", "reprimand", "reprehend", "reproach",
    "cohort", "confederate", "ally", "accomplice",
    "affliction", "mischance", "reverses",
    "functionalism", "auscultation", "pheromones", "penicillin",
    "glycerine", "ephemeral", "hemoptysis", "infection",
    "sunderland", "parturition", "conclusion", "differential",
    "signature", "inguinal", "murderer", "guidelines",
    "smoking", "orchid", "meconium", "restrictive",
    "cancer", "complications", "aspirin", "acetaminophen",
    "biological", "chemical", "cardiovascular", "palpation",
    "polycythemia", "somatopleuric", "humanity", "predisposed",
    "terminal", "caliphate", "hyperlipidemia", "hematuria",
    "painful", "infective", "arthropods", "oncogenetics",
    "socrates", "tropical", "sphygmomanometer", "tenderness",
    "obstetrics", "hemochromatosis", "centrifuge", "resonance",
    "zenith", "urethra", "aristocrat", "republican",
    "penicillamine", "character", "obstructive", "prophylactic",
    "puzzle", "sociology", "lumefatrine", "examination",
    "oedema", "fistula", "splanchnopleuric", "pulmonary",
    "histology", "enterocyte", "hemangiopericytoma", "investigate",
    "hyperbilirubinemia", "jaundice", "urinalysis", "hispanic",
    "mycology", "musculature", "culture", "thoracocentesis",
    "morphology", "ruby", "neurology", "keratinized", "blood",
    "striped", "capacity", "carbonated", "psoas", "enema", "quantum",
    "inflation", "hamilton", "lensing", "ultrasonography",
    "amputation", "kymograph", "tomography", "matriculation",
    "rhesus", "colonoscopy", "amyloidosis", "reticulocyte",
    "homeostasis", "hemostasis",
    "civil", "complaisant", "benign", "gracious", "genial", "urbane", "cordial",
    "curt", "brusque", "rude", "boorish", "surly",
    "opulent", "profuse", "destitute", "impecunious",
    "bumptious", "officious", "obtrusive",
    "meek", "humble", "retiring", "diffident",
    "celerity", "briskness", "energy", "animation",
    "apathy", "nonchalance", "sluggishness", "lethargy", "phlegmatism", "paradigm",
    "appease", "alleviate", "pacify", "assuage", "abate", "mitigate", "propitiate", "mollify", "placate",
    "intensify", "aggravate",
    "insinuate", "intimate", "imply", "refer", "cite",
    "allure", "lure", "decoy", "inveigle", "entice", "seduce", "wheedle", "beguile", "cajole",
    "hazy", "obscure", "equivocal", "dubious", "nebulous",
    "explicit", "unquestionable", "amenable", "ambiguous",
    "amenable", "tractable", "docile", "responsive",
    "intractable", "refractory", "recalcitrant",
    "complaisant", "amiable", "anachronism"
];
const game = Game.getInstance({
    timeEl,
    wordEl,
    inputEl,
    words,
    scoreObject: {
        score: scoreEl,
        highScore: highScoreEl
    },
    wrapper: tab,
    formEl: form,
    openBtn: settingsBtn
});
game === null || game === void 0 ? void 0 : game.startGame();
