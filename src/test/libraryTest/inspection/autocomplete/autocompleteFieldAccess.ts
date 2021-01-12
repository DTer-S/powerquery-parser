// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from "chai";
import "mocha";
import { Assert, DefaultSettings, Inspection, Language, LexSettings, Parser, ParseSettings } from "../../../..";
import { TestAssertUtils } from "../../../testUtils";

interface AbridgedAutocomplete {
    readonly fieldAccessKeys: ReadonlyArray<string>;
    readonly others: ReadonlyArray<string>;
}

function assertExpected(expected: AbridgedAutocomplete, actual: AbridgedAutocomplete): void {
    expect(actual.fieldAccessKeys).to.have.members(expected.fieldAccessKeys);
    expect(actual.others).to.have.members(expected.others);
}

function assertGetAbridgedAutocomplete(autocomplete: Inspection.Autocomplete): AbridgedAutocomplete {
    Assert.isOk(autocomplete.triedFieldAccess);
    Assert.isOk(autocomplete.triedKeyword);
    Assert.isOk(autocomplete.triedLanguageConstant);
    Assert.isOk(autocomplete.triedPrimitiveType);

    const others: string[] = [];

    others.push(...autocomplete.triedKeyword.value);

    if (autocomplete.triedLanguageConstant.value) {
        others.push(autocomplete.triedLanguageConstant.value);
    }

    others.push(...autocomplete.triedPrimitiveType.value);

    let fieldAccessKeys: ReadonlyArray<string> = [];
    if (autocomplete.triedFieldAccess.value) {
        fieldAccessKeys = autocomplete.triedFieldAccess.value.autocompleteItems.map(
            (autocompleteItem: Inspection.AutocompleteItem) => autocompleteItem.key,
        );
    }

    return {
        fieldAccessKeys,
        others,
    };
}

function assertGetParseOkAutocompleteOkFieldAccess<S extends Parser.IParseState = Parser.IParseState>(
    settings: LexSettings & ParseSettings<S>,
    text: string,
    position: Inspection.Position,
): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseOkAutocompleteOk(settings, text, position);
    return assertGetAbridgedAutocomplete(actual);
}

function assertGetParseErrAutocompleteOkFieldAccess<S extends Parser.IParseState = Parser.IParseState>(
    settings: LexSettings & ParseSettings<S>,
    text: string,
    position: Inspection.Position,
): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseErrAutocompleteOk(settings, text, position);
    return assertGetAbridgedAutocomplete(actual);
}

function getEmptyAbridgedAutocomplete(): AbridgedAutocomplete {
    return {
        fieldAccessKeys: [],
        others: [],
    };
}

describe(`Inspection - Autocomplete - FieldSelection`, () => {
    describe(`Selection`, () => {
        describe(`ParseOk`, () => {
            it(`[cat = 1, car = 2][x|]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][x|]`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][c|]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][c|]`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][| c]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][| c]`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][c |]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][c |]`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`section x; value = [foo = 1, bar = 2, foobar = 3]; valueAccess = value[f|];`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `section x; value = [foo = 1, bar = 2, foobar = 3]; valueAccess = value[f|];`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["foo", "foobar"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });
        });

        describe(`ParseErr`, () => {
            it(`[cat = 1, car = 2][|]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][|]`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2]|[`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2]|[`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][|`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][x|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][x|`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][c|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][c|`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][c |`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][c |`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`section x; value = [foo = 1, bar = 2, foobar = 3]; valueAccess = value[|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `section x; value = [foo = 1, bar = 2, foobar = 3]; valueAccess = value[|`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["foo", "bar", "foobar"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });
        });
    });

    describe("Projection", () => {
        describe("ParseOk", () => {
            it(`[cat = 1, car = 2][ [x|] ]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [x|] ]`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [c|] ]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [c|] ]`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [c |] ]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [c |] ]`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [x], [c|] ]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [x], [c|] ]`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [cat], [c|] ]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [cat], [c|] ]`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [cat], [car], [c|] ]`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [cat], [car], [c|] ]`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });
        });

        describe(`ParseErr`, () => {
            it(`[cat = 1, car = 2][ [|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [|`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ |`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ |`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ c|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ c|`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["cat", "car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat|`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat |`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat |`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ]|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ]|`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ] |`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ] |`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ]|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ]|`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ]|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ]|`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ], |`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ], |`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ], [|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ], [|`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ], [|<>`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ], [|<>`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ], [| <>`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ], [| <>`,
                );
                const expected: AbridgedAutocomplete = {
                    fieldAccessKeys: ["car"],
                    others: [],
                };
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });

            it(`[cat = 1, car = 2][ [ cat ], [<>|`, () => {
                const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                    `[cat = 1, car = 2][ [ cat ], [<>|`,
                );
                const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
                const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                    DefaultSettings,
                    text,
                    position,
                );
                assertExpected(expected, actual);
            });
        });
    });

    describe(`Indirection`, () => {
        it(`let fn = () => [cat = 1, car = 2] in fn()[|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let fn = () => [cat = 1, car = 2] in fn()[|`,
            );
            const expected: AbridgedAutocomplete = {
                fieldAccessKeys: ["cat", "car"],
                others: Language.Keyword.ExpressionKeywordKinds,
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                DefaultSettings,
                text,
                position,
            );
            assertExpected(expected, actual);
        });

        it(`let foo = () => [cat = 1, car = 2], bar = foo in bar()[|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let foo = () => [cat = 1, car = 2], bar = foo in bar()[|`,
            );
            const expected: AbridgedAutocomplete = {
                fieldAccessKeys: ["cat", "car"],
                others: Language.Keyword.ExpressionKeywordKinds,
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                DefaultSettings,
                text,
                position,
            );
            assertExpected(expected, actual);
        });

        it(`let foo = () => [cat = 1, car = 2], bar = () => foo in bar()()[|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let foo = () => [cat = 1, car = 2], bar = () => foo in bar()()[|`,
            );
            const expected: AbridgedAutocomplete = {
                fieldAccessKeys: ["cat", "car"],
                others: Language.Keyword.ExpressionKeywordKinds,
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                DefaultSettings,
                text,
                position,
            );
            assertExpected(expected, actual);
        });

        it(`let foo = () => if true then [cat = 1] else [car = 2] in foo()[|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `let foo = () => if true then [cat = 1] else [car = 2] in foo()[|`,
            );
            const expected: AbridgedAutocomplete = {
                fieldAccessKeys: ["cat", "car"],
                others: Language.Keyword.ExpressionKeywordKinds,
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                DefaultSettings,
                text,
                position,
            );
            assertExpected(expected, actual);
        });
    });

    describe(`GeneralizedIdentifier`, () => {
        it(`[#"foo" = 1][|`, () => {
            const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
                `[#"foo" = 1][|`,
            );
            const expected: AbridgedAutocomplete = {
                fieldAccessKeys: [`#"foo"`],
                others: [],
            };
            const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkFieldAccess(
                DefaultSettings,
                text,
                position,
            );
            assertExpected(expected, actual);
        });
    });
});
