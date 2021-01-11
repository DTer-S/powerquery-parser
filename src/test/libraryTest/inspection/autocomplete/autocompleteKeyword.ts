// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from "chai";
import "mocha";
import { Assert, DefaultSettings, Inspection, Language } from "../../../..";
import { TestAssertUtils } from "../../../testUtils";

interface AbridgedAutocomplete {
    readonly keywords: Inspection.AutocompleteKeyword;
    readonly others: ReadonlyArray<string>;
}

function assertGetAbridgedAutocomplete(autocomplete: Inspection.Autocomplete): AbridgedAutocomplete {
    Assert.isOk(autocomplete.triedFieldAccess);
    Assert.isOk(autocomplete.triedKeyword);
    Assert.isOk(autocomplete.triedLanguageConstant);
    Assert.isOk(autocomplete.triedPrimitiveType);

    const others: string[] = [];
    if (autocomplete.triedFieldAccess.value) {
        others.push(
            ...autocomplete.triedFieldAccess.value.autocompleteItems.map(
                (autocompleteItem: Inspection.AutocompleteItem) => autocompleteItem.key,
            ),
        );
    }

    if (autocomplete.triedLanguageConstant.value) {
        others.push(autocomplete.triedLanguageConstant.value);
    }

    others.push(...autocomplete.triedPrimitiveType.value);

    return {
        keywords: autocomplete.triedKeyword.value,
        others,
    };
}

function assertGetParseOkAutocompleteOkKeyword(text: string, position: Inspection.Position): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseOkAutocompleteOk(
        DefaultSettings,
        text,
        position,
    );
    return assertGetAbridgedAutocomplete(actual);
}

function assertGetParseErrAutocompleteOkKeyword(text: string, position: Inspection.Position): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseErrAutocompleteOk(
        DefaultSettings,
        text,
        position,
    );
    return assertGetAbridgedAutocomplete(actual);
}

function assertExpected(expected: AbridgedAutocomplete, actual: AbridgedAutocomplete): void {
    expect(actual.keywords).to.have.members(expected.keywords);
    expect(actual.others).to.have.members(expected.others);
}

function getEmptyAbridgedAutocomplete(): AbridgedAutocomplete {
    return {
        keywords: [],
        others: [],
    };
}

describe(`WIP Inspection - Autocomplete - Keyword`, () => {
    it("|", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`|`);
        const expected: AbridgedAutocomplete = {
            keywords: [...Language.Keyword.ExpressionKeywordKinds, Language.Keyword.KeywordKind.Section],
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
        assertExpected(expected, actual);
    });

    describe("partial keyword", () => {
        it("a|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`a|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("x a|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`x a|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.And, Language.Keyword.KeywordKind.As],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("e|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`e|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Each, Language.Keyword.KeywordKind.Error],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("if x then x e|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if x then x e|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Else],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("i|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`i|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.If],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("l|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`l|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Let],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("m|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`m|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("x m|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`x m|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Meta],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("n|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`n|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Not],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("true o|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `true o|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Or],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("try true o|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true o|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Or, Language.Keyword.KeywordKind.Otherwise],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("try true o |", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true o |`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("try true ot|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true ot|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Otherwise],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("try true oth|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true oth|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Otherwise],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("s|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`s|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Section],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("[] |", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`[] |`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Section],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("[] |s", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`[] |s`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("[] s|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`[] s|`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Section],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("[] s |", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`[] s |`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("section; s|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; s|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Shared],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("section; shared x|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; shared x|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("section; [] s|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; [] s|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Shared],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("if true t|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if true t|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Then],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it("t|", () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`t|`);
            const expected: AbridgedAutocomplete = {
                keywords: [
                    Language.Keyword.KeywordKind.True,
                    Language.Keyword.KeywordKind.Try,
                    Language.Keyword.KeywordKind.Type,
                ],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.ErrorHandlingExpression}`, () => {
        it(`try |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`try |`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`try true|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.True],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`try true |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [
                    Language.Keyword.KeywordKind.And,
                    Language.Keyword.KeywordKind.As,
                    Language.Keyword.KeywordKind.Is,
                    Language.Keyword.KeywordKind.Meta,
                    Language.Keyword.KeywordKind.Or,
                    Language.Keyword.KeywordKind.Otherwise,
                ],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.ErrorRaisingExpression}`, () => {
        it(`if |error`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if |error`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if error|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if error|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`error |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `error |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.FunctionExpression}`, () => {
        it(`let x = (_ |) => a in x`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let x = (_ |) => a in x`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.As],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let x = (_ a|) => a in`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let x = (_ a|) => a in`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.As],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.IfExpression}`, () => {
        it(`if|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(` if |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if |`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if 1|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if |if`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if |if`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if i|f`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if i|f`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.If],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if if | `, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if if |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if 1 |`);
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Then],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 t|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 t|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Then],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 then |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 then |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 then 1|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 then 1|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 then 1 e|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 then 1 e|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Else],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 then 1 else|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 then 1 else|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 th|en 1 else`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 th|en 1 else`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Then],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if 1 then 1 else |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if 1 then 1 else |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.InvokeExpression}`, () => {
        it(`foo(|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`foo(|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`foo(a|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`foo(a|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`foo(a|,`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `foo(a|,`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`foo(a,|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `foo(a,|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.ListExpression}`, () => {
        it(`{|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`{1|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{1|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`{1|,`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{1|,`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`{1,|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{1,|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`{1,|2`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{1,|2`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`{1,|2,`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{1,|2,`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`{1..|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`{1..|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.OtherwiseExpression}`, () => {
        it(`try true otherwise| false`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true otherwise| false`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`try true otherwise |false`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true otherwise |false`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`try true oth|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true oth|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Otherwise],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`try true otherwise |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true otherwise |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.ParenthesizedExpression}`, () => {
        it(`+(|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+(|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.RecordExpression}`, () => {
        it(`+[|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+[|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+[a=|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+[a=1|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a|=1`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+[a|=1`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1|]`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=1|]`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=|1]`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=| 1]`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1|,`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+[a=1|`);
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1,|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=1,|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1|,b`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=1|,b`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1|,b=`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=1|,b=`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=|1,b=`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=|1,b=`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1,b=2|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=1,b=2|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+[a=1,b=2 |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `+[a=1,b=2 |`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`AutocompleteExpression`, () => {
        it(`error |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `error |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let x = |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let x = |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`() => |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `() => |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`if |`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if true then |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if true then |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`if true then true else |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `if true then true else |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`foo(|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`foo(|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let x = 1 in |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let x = 1 in |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+{|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+{|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`try true otherwise |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `try true otherwise |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`+(|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`+(|`);
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.SectionMember}`, () => {
        it(`section; [] |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; [] |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Shared],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`section; [] x |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; [] x |`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`section; x = |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; x = |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`section; x = 1 |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; x = 1 |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [
                    Language.Keyword.KeywordKind.And,
                    Language.Keyword.KeywordKind.As,
                    Language.Keyword.KeywordKind.Is,
                    Language.Keyword.KeywordKind.Meta,
                    Language.Keyword.KeywordKind.Or,
                ],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`section; x = 1 i|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section; x = 1 i|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Is],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`section foo; a = () => true; b = "string"; c = 1; d = |;`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `section foo; a = () => true; b = "string"; c = 1; d = |;`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });

    describe(`${Language.Ast.NodeKind.LetExpression}`, () => {
        it(`let a = |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1|`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1 |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1 |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [
                    Language.Keyword.KeywordKind.And,
                    Language.Keyword.KeywordKind.As,
                    Language.Keyword.KeywordKind.In,
                    Language.Keyword.KeywordKind.Is,
                    Language.Keyword.KeywordKind.Meta,
                    Language.Keyword.KeywordKind.Or,
                ],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1 | foobar`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1 | foobar`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [
                    Language.Keyword.KeywordKind.And,
                    Language.Keyword.KeywordKind.As,
                    Language.Keyword.KeywordKind.In,
                    Language.Keyword.KeywordKind.Is,
                    Language.Keyword.KeywordKind.Meta,
                    Language.Keyword.KeywordKind.Or,
                ],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1 i|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1 i|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.In, Language.Keyword.KeywordKind.Is],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1 o|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1 o|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Or],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1 m|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1 m|`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [Language.Keyword.KeywordKind.Meta],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = 1, |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = 1, |`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = let b = |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = let b = |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: Language.Keyword.ExpressionKeywordKinds,
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = let b = 1 |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = let b = 1 |`,
            );
            const expected: AbridgedAutocomplete = {
                keywords: [
                    Language.Keyword.KeywordKind.And,
                    Language.Keyword.KeywordKind.As,
                    Language.Keyword.KeywordKind.In,
                    Language.Keyword.KeywordKind.Is,
                    Language.Keyword.KeywordKind.Meta,
                    Language.Keyword.KeywordKind.Or,
                ],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });

        it(`let a = let b = 1, |`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let a = let b = 1, |`,
            );
            const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkKeyword(text, position);
            assertExpected(expected, actual);
        });
    });
});
