export type StrokeOrderExerciseType = {
    kanji:string;
    stroke:number;
    answers:number[];
    multiple:boolean;
    type: "strokeorder";
    category: "strokeOrder";
}

export type MultipleQuestionReadingExerciseType = {
    text:string;
    type:"reading",
    category:"reading",
    questions:{
        answer:string
    }[]
    group:string|null;
}

export type GroupReadKanjiExercise = {
    texts:{
        text:string;
    }[];
    type:"groupreading";
    questions:{
        answer:string
    }[];
    category:"groupReading";
}

export type GroupWriteKanjiExercise = {
    texts:{
        text:string;
    }[];
    type:"groupwriting";
    questions:{
        answer:{
            text:string,
            kanjis:string[]
        }
    }[];
    category:"groupWriting";
}

export type ChooseExerciseType = {
    type:"choose";
    category:"choose";
    text:string;
    options:string[];
    answer:string;
}

export type WriteHiraganaExerciseType = {
    type:"hiragana",
    category:"hiragana",
    text:string,
    questions:{
        text:string,
        answer:string
    }[]
}

export type WriteKanjiType = {
    type:"kanjirelated"|"kanjicomponents"|"completekanji",
    category:"writeKanji",
    text:string,
    questions:{
        text:string,
        answer:{
            text:string,
            kanjis:string[]
        }
    }[]
}

export type WriteKanjiTextType = {
    type:"textsquares"|"okurigana",
    category:"writeKanji",
    text:string,
    questions:{
        answer:{
            text:string,
            kanjis:string[]
        }
    }[]
}

export type TomehaneExerciseType = {
    type:"tomehane",
    category:"tomehane",
    kanji:string,
    text:string,
    coords:[number,number],
    options:string[],
    answer:string
}

export type ChooseTextExerciseType = {
    type:"choosetext",
    category:"choose",
    text:string,
    options:string[],
    answer:string
}

export type WriteKanjiRelatedGroupExerciseType = {
    type:"kanjirelatedgroup",
    category:"writeKanji",
    questions:{
        text:string,
        answer:{
            text:string,
            kanjis:string[]
        }
    }[],
    hint:string
}

export type MultipleChooseExerciseType = {
    type:"multiplechoose"|"multiplechoosetext",
    category:"multipleChoose",
    text?:string,
    questions:{
        text:string,
        answer:string
    }[],
    options:string[][],
    indexIsOption?:boolean
}

export type ChooseComponentsExerciseType = {
    type:"components",
    category:"choose",
    texts:{
        text:string,
        questions:{
            text:string,
            answer:string
        }[]
    }[]
    options:string[][]
}

export type SynonymsExerciseType = {
    type:"synonyms",
    category:"writeKanji",
    questions:{
        group:"類"|"対",
        text:string,
        answer:{
            text:string,
            kanjis:string[]
        }
    }[],
    hint:string
}

export type MultipleKanjiChooseExerciseType = {
    texts:{
        reading:string;
        questions:{
            text:string;
            answer:string;
        }[]
    }[]
    type:"multiplekanjichoose";
    category:"multipleChoose";
    options:string[];
}

export type DefinitionsExerciseType = {
    type:"definitions",
    category:"multipleChoose",
    texts:{
        text:string,
        answer:string[]
    }[]
    options:string[][];
}

export type CommonKanjiExerciseType = {
    type:"commonkanji",
    category:"choose",
    questions:{
        text:string,
        answer:string
    }[]
    options:string[][];
}

export type WrongKanjiExerciseType = {
    type:"wrongkanji",
    category:"wrongKanji",
    text:string,
    answer:{
        wrong:string,
        text:string,
        kanjis:string[]
    }
}

export type WriteRadicalExerciseType = {
    type:"writeradical",
    category:"writeRadical",
    text:string,
    answer:string
}

export type DefinitionsChooseExerciseType = {
    type:"definitionschoose",
    category:"multipleChoose",
    text?:string,
    questions:{
        text:string,
        answer:string
    }[],
    options:string[][],
    indexIsOption?:boolean
}

export type ExerciseType = (
    MultipleQuestionReadingExerciseType |
    StrokeOrderExerciseType|
    GroupReadKanjiExercise|
    ChooseExerciseType |
    WriteHiraganaExerciseType |
    WriteKanjiType |
    WriteKanjiTextType |
    TomehaneExerciseType |
    ChooseTextExerciseType |
    WriteKanjiRelatedGroupExerciseType |
    MultipleChooseExerciseType |
    ChooseComponentsExerciseType |
    SynonymsExerciseType |
    MultipleKanjiChooseExerciseType |
    DefinitionsExerciseType |
    CommonKanjiExerciseType |
    WrongKanjiExerciseType |
    WriteRadicalExerciseType |
    DefinitionsChooseExerciseType |
    GroupWriteKanjiExercise
    ) & {
    _id:string;
    level:"10",
    exerciseIndex:number,
    examIndex:number|null,
    hint?:string
}