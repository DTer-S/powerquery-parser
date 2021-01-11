// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from "chai";
import "mocha";
import { Assert, DefaultSettings, Inspection, Language, LexSettings, Parser, ParseSettings } from "../../../..";
import { TestAssertUtils } from "../../../testUtils";

interface AbridgedAutocomplete {
    readonly languageConstant: Inspection.AutocompleteLanguageConstant | undefined;
    readonly others: ReadonlyArray<string>;
}

function assertGetParseErrAutocompleteOkLanguageConstant<S extends Parser.IParseState = Parser.IParseState>(
    settings: LexSettings & ParseSettings<S>,
    text: string,
    position: Inspection.Position,
): AbridgedAutocomplete {
    const actual: Inspection.Autocomplete = TestAssertUtils.assertGetParseErrAutocompleteOk(settings, text, position);
    return getAbridgedAutocomplete(actual);
}

function getAbridgedAutocomplete(autocomplete: Inspection.Autocomplete): AbridgedAutocomplete {
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

    others.push(...autocomplete.triedPrimitiveType.value);

    return {
        languageConstant: autocomplete.triedLanguageConstant.value,
        others,
    };
}

function assertExpected(expected: AbridgedAutocomplete, actual: AbridgedAutocomplete): void {
    expect(actual.languageConstant).to.equal(expected.languageConstant);
    expect(actual.others).to.have.members(expected.others);
}

describe(`Inspection - Autocomplete - Language constants`, () => {
    it(`a as |`, () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`a as |`);
        const expected: AbridgedAutocomplete = {
            languageConstant: Language.Constant.LanguageConstantKind.Nullable,
            others: Language.Constant.PrimitiveTypeConstantKinds,
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkLanguageConstant(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it(`a as n|`, () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`a as n|`);
        const expected: AbridgedAutocomplete = {
            languageConstant: Language.Constant.LanguageConstantKind.Nullable,
            others: [
                Language.Constant.PrimitiveTypeConstantKind.None,
                Language.Constant.PrimitiveTypeConstantKind.Null,
                Language.Constant.PrimitiveTypeConstantKind.Number,
            ],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkLanguageConstant(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it(`(a as |`, () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`(a as |`);
        const expected: AbridgedAutocomplete = {
            languageConstant: Language.Constant.LanguageConstantKind.Nullable,
            others: Language.Constant.PrimitiveTypeConstantKinds,
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkLanguageConstant(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it(`WIP (a as n|`, () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`(a as n|`);
        const expected: AbridgedAutocomplete = {
            languageConstant: Language.Constant.LanguageConstantKind.Nullable,
            others: [
                Language.Constant.PrimitiveTypeConstantKind.None,
                Language.Constant.PrimitiveTypeConstantKind.Null,
                Language.Constant.PrimitiveTypeConstantKind.Number,
            ],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkLanguageConstant(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it(`(x, |`, () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`(x, |`);
        const expected: AbridgedAutocomplete = {
            languageConstant: Language.Constant.LanguageConstantKind.Optional,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkLanguageConstant(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });

    it(`(x, op|`, () => {
        const [text, position]: [string, Inspection.Position] = TestAssertUtils.assertGetTextWithPosition(`(x, op|`);
        const expected: AbridgedAutocomplete = {
            languageConstant: Language.Constant.LanguageConstantKind.Optional,
            others: [],
        };
        const actual: AbridgedAutocomplete = assertGetParseErrAutocompleteOkLanguageConstant(
            DefaultSettings,
            text,
            position,
        );
        assertExpected(expected, actual);
    });
});
