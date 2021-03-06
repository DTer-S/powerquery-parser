// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type TConstantKind =
    | ArithmeticOperatorKind
    | EqualityOperatorKind
    | KeywordConstantKind
    | LanguageConstantKind
    | LogicalOperatorKind
    | MiscConstantKind
    | PrimitiveTypeConstantKind
    | RelationalOperatorKind
    | UnaryOperatorKind
    | WrapperConstantKind;

export type TBinOpExpressionOperator =
    | ArithmeticOperatorKind
    | EqualityOperatorKind
    | LogicalOperatorKind
    | RelationalOperatorKind
    | MiscConstantKind.NullCoalescingOperator
    | KeywordConstantKind.As
    | KeywordConstantKind.Is
    | KeywordConstantKind.Meta;

// ---------------------------------
// ---------- const enums ----------
// ---------------------------------

export const enum LanguageConstantKind {
    Nullable = "nullable",
    Optional = "optional",
}

export const enum KeywordConstantKind {
    As = "as",
    Each = "each",
    Else = "else",
    Error = "error",
    False = "false",
    If = "if",
    In = "in",
    Is = "is",
    Let = "let",
    Meta = "meta",
    Otherwise = "otherwise",
    Section = "section",
    Shared = "shared",
    Then = "then",
    True = "true",
    Try = "try",
    Type = "type",
}

// Mostly direct mappings from their respective TokenKind
export const enum MiscConstantKind {
    Ampersand = "&",
    AtSign = "@",
    Comma = ",",
    DotDot = "..",
    Ellipsis = "...",
    Equal = "=",
    FatArrow = "=>",
    NullCoalescingOperator = "??",
    Semicolon = ";",
    QuestionMark = "?",
}

export const enum PrimitiveTypeConstantKind {
    Action = "action",
    Any = "any",
    AnyNonNull = "anynonnull",
    Binary = "binary",
    Date = "date",
    DateTime = "datetime",
    DateTimeZone = "datetimezone",
    Duration = "duration",
    Function = "function",
    List = "list",
    Logical = "logical",
    None = "none",
    Null = "null",
    Number = "number",
    Record = "record",
    Table = "table",
    Text = "text",
    Time = "time",
    Type = "type",
}

export const enum WrapperConstantKind {
    LeftBrace = "{",
    LeftBracket = "[",
    LeftParenthesis = "(",
    RightBrace = "}",
    RightBracket = "]",
    RightParenthesis = ")",
}

// ------------------------------------------
// ---------- operator const enums ----------
// ------------------------------------------

export const enum ArithmeticOperatorKind {
    Multiplication = "*",
    Division = "/",
    Addition = "+",
    Subtraction = "-",
    And = "&",
}

export const enum EqualityOperatorKind {
    EqualTo = "=",
    NotEqualTo = "<>",
}

export const enum LogicalOperatorKind {
    And = "and",
    Or = "or",
}

export const enum RelationalOperatorKind {
    LessThan = "<",
    LessThanEqualTo = "<=",
    GreaterThan = ">",
    GreaterThanEqualTo = ">=",
}

export const enum UnaryOperatorKind {
    Positive = "+",
    Negative = "-",
    Not = "not",
}

// ----------------------------------------
// ---------- const enum iterals ----------
// ----------------------------------------

export const ArithmeticOperatorKinds: ReadonlyArray<ArithmeticOperatorKind> = [
    ArithmeticOperatorKind.Multiplication,
    ArithmeticOperatorKind.Division,
    ArithmeticOperatorKind.Addition,
    ArithmeticOperatorKind.Subtraction,
    ArithmeticOperatorKind.And,
];

export const EqualityOperatorKinds: ReadonlyArray<EqualityOperatorKind> = [
    EqualityOperatorKind.EqualTo,
    EqualityOperatorKind.NotEqualTo,
];

export const LogicalOperatorKinds: ReadonlyArray<LogicalOperatorKind> = [
    LogicalOperatorKind.And,
    LogicalOperatorKind.Or,
];

export const PrimitiveTypeConstantKinds: ReadonlyArray<PrimitiveTypeConstantKind> = [
    PrimitiveTypeConstantKind.Action,
    PrimitiveTypeConstantKind.Any,
    PrimitiveTypeConstantKind.AnyNonNull,
    PrimitiveTypeConstantKind.Binary,
    PrimitiveTypeConstantKind.Date,
    PrimitiveTypeConstantKind.DateTime,
    PrimitiveTypeConstantKind.DateTimeZone,
    PrimitiveTypeConstantKind.Duration,
    PrimitiveTypeConstantKind.Function,
    PrimitiveTypeConstantKind.List,
    PrimitiveTypeConstantKind.Logical,
    PrimitiveTypeConstantKind.None,
    PrimitiveTypeConstantKind.Null,
    PrimitiveTypeConstantKind.Number,
    PrimitiveTypeConstantKind.Record,
    PrimitiveTypeConstantKind.Table,
    PrimitiveTypeConstantKind.Text,
    PrimitiveTypeConstantKind.Time,
    PrimitiveTypeConstantKind.Type,
];

export const RelationalOperatorKinds: ReadonlyArray<RelationalOperatorKind> = [
    RelationalOperatorKind.LessThan,
    RelationalOperatorKind.LessThanEqualTo,
    RelationalOperatorKind.GreaterThan,
    RelationalOperatorKind.GreaterThanEqualTo,
];

export const UnaryOperatorKinds: ReadonlyArray<UnaryOperatorKind> = [
    UnaryOperatorKind.Positive,
    UnaryOperatorKind.Negative,
    UnaryOperatorKind.Not,
];
