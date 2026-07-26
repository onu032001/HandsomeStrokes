class HandsomeStrokes_ListTools {
    constructor() {}
    append(...lists) {
        const result = [];
        for (const list of lists) {
            for (const item of list) {
                result.push(item);
            }
        }
        return result;
    }
    columns(list) {
        const totalColumns = Math.max(...list.map(function (item) { return item.length; }));
        const result = Array.from({ length: totalColumns }, function () { return []; });
        for (const columnIndex in list) {
            const column = list[columnIndex];
            for (const itemIndex in column) {
                const item = column[itemIndex];
                result[itemIndex][columnIndex] = item;
            }
        }
        return result;
    }
    numbers(start, end) {
        const result = [];
        for (let index = start; index <= end; index++) {
            result.push(index);
        }
        return result;
    }
    areItemsSame(list1, list2) {
        if (list1.length === list2.length) {
            let result = true;
            for (let index = 0; index < list1.length; index++) {
                result = result && (list1[index] === list2[index]);
            }
            return result;
        }
        return false;
    }
}
const hs_listTools = new HandsomeStrokes_ListTools();

class HandsomeStrokes_TextManipulator {
    constructor() {
        this.syllableMapper = {
            consonant: ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]
                .map(function(value) {
                    return [[value], value];
                }),
            vowel: hs_listTools.append(
                ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ"]
                    .map(function(value) {
                        return [[value], value];
                    }),
                [["ㅏ", "ㅘ"], ["ㅐ", "ㅙ"], ["ㅣ", "ㅚ"]]
                    .map(function(value) {
                        return [["ㅗ", value[0]], value[1]];
                    }),
                [[["ㅛ"], "ㅛ"], [["ㅜ"], "ㅜ"]],
                [["ㅓ", "ㅝ"], ["ㅔ", "ㅞ"], ["ㅣ", "ㅟ"]]
                    .map(function(value) {
                        return [["ㅜ", value[0]], value[1]];
                    }),
                [[["ㅠ"], "ㅠ"], [["ㅡ"], "ㅡ"], [["ㅡ", "ㅣ"], "ㅢ"], [["ㅣ"], "ㅣ"]]
            ),
            final: hs_listTools.append(
                [
                    [[], ""], [["ㄱ"], "ㄱ"], [["ㄲ"], "ㄲ"], [["ㄱ", "ㅅ"], "ㄳ"],
                    [["ㄴ"], "ㄴ"], [["ㄴ", "ㅈ"], "ㄵ"], [["ㄴ", "ㅎ"], "ㄶ"], [["ㄷ"], "ㄷ"],
                    [["ㄹ"], "ㄹ"]
                ],
                hs_listTools.columns([
                    ["ㄱ", "ㅁ", "ㅂ", "ㅅ", "ㅌ", "ㅍ", "ㅎ"],
                    hs_listTools.numbers(12602, 12608)
                ]).map(function(value) { return [["ㄹ", value[0]], String.fromCodePoint(value[1])]; }),
                [[["ㅁ"], "ㅁ"], [["ㅂ"], "ㅂ"], [["ㅂ", "ㅅ"], "ㅄ"]],
                ["ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"].map(function(value) { return [[value], value]; })
            ),
            split(text) {
                const result = [];
                for (const char of text.split("")) {
                    let unicode = char.codePointAt(0);
                    if (44032 <= unicode && unicode <= 55203) {
                        unicode = unicode - 44032;
                        result.push(this.consonant[Math.floor(unicode / (21 * 28))][0]);
                        result.push(this.vowel[Math.floor(unicode / 28) % 21][0]);
                        result.push(this.final[unicode % 28][0]);
                    } else {
                        result.push([char]);
                    }
                }
                return result.flat();
            },
            get letters() {
                return {
                    consonant: this.consonant,
                    vowel: this.vowel,
                    final: this.final
                };
            }
        };
    }
    splitText(text) {
        return this.syllableMapper.split(text);
    }
    combineText(list) {
        const thisObject = this;
        const mapper = this.syllableMapper;
        const letters = mapper.letters;
        let index = 0;
        const letterChecker = function(letterList, char) {
            return letterList.find(function (value) {
                return hs_listTools.areItemsSame(value[0], !(char instanceof Array) ? [char] : char);
            });
        };
        const typeCheck = function(type, char) {
            return letterChecker(letters[type], char) !== undefined;
        }
        const char = function() { return list[index]; };
        const nextChar = function() { return list[index + 1]; };
        let result = "";
        while (index < list.length) {
            let calledChar = char().codePointAt(0);
            let letterCheck = 12593 <= calledChar && calledChar <= 12643;
            if (letterCheck) {
                if (typeCheck("consonant", char()) && !(typeCheck("vowel", nextChar()))) {
                    result += char();
                } else if (typeCheck("vowel", char())) {
                    result += char();
                } else {
                    calledChar = char();
                    const consonant = letters.consonant.findIndex(function(value) { return value[1] === calledChar; });
                    index++;
                    let vowel = [];
                    let letterCheck = false;
                    while (!(letterCheck || index >= list.length)) {
                        vowel.push(char());
                        index++;
                        letterCheck = !typeCheck("vowel", char());
                    }
                    if (letterChecker(letters.vowel, vowel) === undefined) {
                        vowel.pop();
                        index--;
                    }
                    vowel = letterChecker(letters.vowel, vowel)[1];
                    vowel = letters.vowel.findIndex(function(value) { return value[1] === vowel; });
                    if (char()) {
                        calledChar = char().codePointAt(0);
                        letterCheck = 12593 <= calledChar && calledChar <= 12643;
                    } else {
                        letterCheck = false;
                    }
                    if (!letterCheck) {
                        result += String.fromCodePoint(44032 + consonant * 21 * 28 + vowel * 28);
                        index--;
                        if (index >= list.length) {
                            return result;
                        }
                    } else {
                        let final = [];
                        letterCheck = false;
                        while (!letterCheck && index < list.length) {
                            final.push(char());
                            index++;
                            letterCheck = !typeCheck("final", char());
                        }
                        if (typeCheck("vowel", char()) || letterChecker(letters.final, final) === undefined) {
                            final.pop();
                            index -= 2;
                        }
                        final = letterChecker(letters.final, final)[1];
                        final = letters.final.findIndex(function(value) { return value[1] === final; });
                        result += String.fromCodePoint(44032 + consonant * 21 * 28 + vowel * 28 + final);
                        if (!char()) {
                            return result;
                        }
                        calledChar = char().codePointAt(0);
                        letterCheck = 12593 <= calledChar && calledChar <= 12643;
                        if (!letterCheck) {
                            index--;
                        }
                    }
                }
                index++;
            } else {
                result += char();
                index++;
            }
        }
        return result;
    }
}
const hs_textManipulator = new HandsomeStrokes_TextManipulator();

class HandsomeStrokes {
    constructor() {
        const thisObject = this;
        this.content = "";
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.language = "ko";
        this.startTime = Date.now();
        this.focused = false;
        this.handlers = [];
        this.blinkHandlers = [];
        let originalContent, originalDisplayText;
        this.updateInterval = window.setInterval(function() {
            if (originalContent !== thisObject.content) {
                originalContent = thisObject.content;
                thisObject.handlers.forEach(function (handler) {
                    handler(thisObject.content);
                });
            }
        }, 0);
        this.blinkInterval = window.setInterval(function() {
            if (originalDisplayText !== thisObject.displayText) {
                originalDisplayText = thisObject.displayText;
                thisObject.blinkHandlers.forEach(function (handler) {
                    handler(thisObject.displayText);
                });
            }
        }, 0);
        document.addEventListener('keydown', function(event) {
            thisObject.manipulate(event);
        });
    }
    addBlinkHandler(handler) {
        this.blinkHandlers.push(handler);
    }
    addUpdateHandler(handler) {
        this.handlers.push(handler);
    }
    focus() {
        this.focused = true;
    }
    blur() {
        this.focused = false;
    }
    get keyMappings() {
        return Object.fromEntries(
            hs_listTools.columns([
                "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM".split("").map(function(value) { return value.toLowerCase() === value ? 'f' + value : 't' + value; }),
                "ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅁㄴㅇㄹㅎㅗㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡㅃㅉㄸㄲㅆㅛㅕㅑㅒㅖㅁㄴㅇㄹㅎㅗㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡ".split("")
            ])
        );
    }
    get displayText() {
        const selectionStart = Math.min(this.selectionStart, this.selectionEnd);
        const selectionEnd = Math.max(this.selectionStart, this.selectionEnd);
        return this.content.slice(0, selectionStart)
            + (selectionStart !== selectionEnd ? '⏐[' + this.content.slice(selectionStart, selectionEnd) + ']⏐' : this.cursor ? '⏐' : ' ')
            + this.content.slice(selectionEnd, this.content.length);
    }
    get cursor() {
        return (Date.now() - this.startTime) % 1000 < 500;
    }
    manipulate(event) {
        if (this.focused) {
            if (event.key.toLowerCase() === 'backspace') {
                event.preventDefault();
                this.handleBackspace();
            } else if (event.key.toLowerCase() === 'arrowleft' || event.key.toLowerCase() === 'arrowright') {
                event.preventDefault();
                if (event.shiftKey) {
                    this.handleShiftArrow(event.key);
                } else {
                    this.handleArrow(event.key);
                }
            } else if (event.key.toLowerCase() === 'alt') {
                event.preventDefault();
                this.handleAlt();
            } else if (event.key.toLowerCase() === 'space' || event.key.length === 1) {
                event.preventDefault();
                this.handleKey(event.key, event.shiftKey);
            }
        }
    }
    handleBackspace() {
        const originalContent = this.content;
        const selectionStart = Math.min(this.selectionStart, this.selectionEnd);
        const selectionEnd = Math.max(this.selectionStart, this.selectionEnd);
        const changedContent = selectionStart === selectionEnd
            ? originalContent.slice(0, selectionStart - 1) + originalContent.slice(selectionEnd, originalContent.length)
            : originalContent.slice(0, selectionStart) + originalContent.slice(selectionEnd, originalContent.length);
        if (selectionStart === selectionEnd) {
            this.content = changedContent;
            this.selectionStart = selectionStart - 1;
            this.selectionEnd = selectionEnd - 1;
        } else {
            this.content = changedContent;
            this.selectionStart = selectionStart;
            this.selectionEnd = selectionEnd;
        }
        this.handleCursorErrors(event);
    }
    handleShiftArrow(key) {
        const num = key.toLowerCase().endsWith('left') ? -1 : key.toLowerCase().endsWith('right') ? 1 : 0;
        const selectionEnd = this.selectionEnd;
        this.selectionEnd = selectionEnd + num;
        this.handleCursorErrors(event);
    }
    handleArrow(key) {
        const num = key.toLowerCase().endsWith('left') ? -1 : key.toLowerCase().endsWith('right') ? 1 : 0;
        const selectionStart = Math.min(this.selectionStart, this.selectionEnd);
        const selectionEnd = Math.max(this.selectionStart, this.selectionEnd);
        if (selectionStart === selectionEnd) {
            this.selectionStart = selectionStart + num;
            this.selectionEnd = selectionEnd + num;
        } else {
            if (num === -1) {
                this.selectionStart = selectionStart;
                this.selectionEnd = selectionStart;
            } else if (num === 1) {
                this.selectionStart = selectionEnd;
                this.selectionEnd = selectionEnd;
            }
        }
        this.handleCursorErrors(event);
    }
    handleAlt(key) {
        const language = this.language;
        this.language = language === "ko" ? "en" : "ko";
        this.handleCursorErrors(event);
    }
    handleKey(key, isShiftKey) {
        const originalContent = this.content;
        const selectionStart = Math.min(this.selectionStart, this.selectionEnd);
        const selectionEnd = Math.max(this.selectionStart, this.selectionEnd);
        key = this.language === "ko"
            && hs_listTools.numbers(97, 122)
            .map(function (value) { return String.fromCodePoint(value); })
            .includes(key.toLowerCase())
            ? ((isShiftKey ? "t" : "f") + key) : key;
        key = this.language === "ko"
            ? (this.keyMappings[key] ? this.keyMappings[key] : key)
            : key;
        let changedContent;
        if (selectionStart === selectionEnd) {
            let substr = originalContent.slice(0, selectionStart);
            if (this.language === "ko") {
                const letter = substr[substr.length - 1] || "";
                substr = substr.length < 1 ? "" : substr.slice(0, substr.length - 1);
                changedContent = substr + hs_textManipulator.combineText(
                    hs_listTools.append(hs_textManipulator.splitText(letter), [key])
                ) + originalContent.slice(selectionEnd, originalContent.length);
            } else {
                changedContent = substr + key
                    + originalContent.slice(selectionEnd, originalContent.length);
            }
        } else {
            changedContent = originalContent.slice(0, selectionStart) + key
                + originalContent.slice(selectionEnd, originalContent.length);
        }
        this.content = changedContent;
        this.selectionStart = selectionEnd + changedContent.length - originalContent.length;
        this.selectionEnd = selectionEnd + changedContent.length - originalContent.length;
        this.handleCursorErrors(event);
    }
    handleCursorErrors() {
        const selectionStart = this.selectionStart;
        const selectionEnd = this.selectionEnd;
        this.selectionStart = Math.min(Math.max(selectionStart, 0), this.content.length);
        this.selectionEnd = Math.min(Math.max(selectionEnd, 0), this.content.length);
    }
}