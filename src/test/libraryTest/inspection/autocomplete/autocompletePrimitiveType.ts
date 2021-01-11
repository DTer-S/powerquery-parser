// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from "chai";
import "mocha";
import { Assert, DefaultSettings, Inspection, Language, LexSettings, Parser, ParseSettings } from "../../../..";
import { TestAssertUtils } from "../../../testUtils";

interface AbridgedAutocomplete {
    readonly primitiveTypes: Inspection.AutocompletePrimitiveType;
    readonly others: ReadonlyArray<string>;
}

function assertExpected(expected: AbridgedAutocomplete, actual: AbridgedAutocomplete): void {
    expect(actual.primitiveTypes).to.have.members(expected.primitiveTypes);
    expect(actual.others).to.have.members(expected.others);
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

    others.push(...autocomplete.triedKeyword.value);

    if (autocomplete.triedLanguageConstant.value) {
        others.push(autocomplete.triedLanguageConstant.value);
    }

    return {
        primitiveTypes: autocomplete.triedPrimitiveType.value,
        others,
    };
}

function assertGetParseOkAutocompleteOkPrimitiveType<S extends Parser.IParseState = Parser.IParseState>(
    settings: LexSettings & ParseSettings<S>,
    text: string,
    position: Inspection.Position,
): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseOkAutocompleteOk(settings, text, position);
    return assertGetAbridgedAutocomplete(actual);
}

function assertGetParseErrAutocompleteOkPrimitiveType<S extends Parser.IParseState = Parser.IParseState>(
    settings: LexSettings & ParseSettings<S>,
    text: string,
    position: Inspection.Position,
): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseErrAutocompleteOk(settings, text, position);
    return assertGetAbridgedAutocomplete(actual);
}

function getEmptyAbridgedAutocomplete(): AbridgedAutocomplete {
    return {
        primitiveTypes: [],
        others: [],
    };
}

describe(`Inspection - Autocomplete - PrimitiveType`, () => {
    it("type|", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`type|`);
        const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("type |", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`type |`);
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("let x = type|", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `let x = type|`,
        );
        const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("let x = type |", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `let x = type |`,
        );
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("type | number", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `type | number`,
        );
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("type n|", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`type n|`);
        const expected: AbridgedAutocomplete = {
            primitiveTypes: [
                Language.Constant.PrimitiveTypeConstantKind.None,
                Language.Constant.PrimitiveTypeConstantKind.Null,
                Language.Constant.PrimitiveTypeConstantKind.Number,
            ],
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x|) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`(x|) => 1`);
        const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x as| number) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `(x as| number) => 1`,
        );
        const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x as | number) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `(x as | number) => 1`,
        );
        // const expectedPrimitiveType: Inspection.AutocompletePrimitiveType =
        //     Language.Constant.PrimitiveTypeConstantKinds;
        // const expectedOther: ReadonlyArray<string> = [];
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x as| nullable number) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `(x as| nullable number) => 1`,
        );
        // const expectedPrimitiveType: Inspection.AutocompletePrimitiveType = [];
        // const expectedOther: ReadonlyArray<string> = [];
        const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x as | nullable number) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `(x as | nullable number) => 1`,
        );
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x as nullable| number) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `(x as nullable| number) => 1`,
        );
        const expected: AbridgedAutocomplete = getEmptyAbridgedAutocomplete();
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("(x as nullable num|ber) => 1", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `(x as nullable num|ber) => 1`,
        );
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseOkAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it("let a = 1 is |", () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(
            `let a = 1 is |`,
        );
        const expected: AbridgedAutocomplete = {
            primitiveTypes: Language.Constant.PrimitiveTypeConstantKinds,
            others: [Language.Constant.LanguageConstantKind.Nullable],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkPrimitiveType(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });
});
