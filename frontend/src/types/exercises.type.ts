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
    type:"kanjirelated",
    category:"writeKanji",
    text?:string,
    questions:{
        text:string,
        answer:{
            text:string,
            kanjis:string[]
        }
    }[],
    divider?:boolean
}

export type CompleteKanjiExerciseType = {
    type:"completekanji",
    category:"writeKanji",
    text:string,
    questions:{
        text:string,
        answer:{
            text:string,
            kanjis:string[]
        }
    }[],
    divider?:boolean
}

export type WriteKanjiComponentsType = {
    type: "kanjicomponents"
    category:"writeKanji",
    text:string,
    questions:{
        text:string,
        answer:{
            text:string,
            kanjis:string[]
        }
    }[],
    divider?:boolean
}

export type WriteKanjiTextType = {
    type:"textsquares",
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

export type OkuriganaExerciseType = {
    type:"okurigana",
    category:"writeKanji",
    text:string,
    questions:{
        answer:{
            text:string,
            kanjis:string[]
        }
    }[]
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
    type:"multiplechoose",
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
    options:string[][],
}

export type SynonymsExerciseType = {
    group:"類"|"対",
    type:"synonyms",
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

export type MultipleChooseTextExerciseType = {
    type:"multiplechoosetext",
    category:"choose",
    questions:{
        text:string,
        answer:string
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
    GroupWriteKanjiExercise|
    ChooseExerciseType |
    WriteHiraganaExerciseType |
    WriteKanjiType |
    WriteKanjiTextType |
    TomehaneExerciseType |
    WriteKanjiComponentsType |
    OkuriganaExerciseType |
    ChooseTextExerciseType |
    WriteKanjiRelatedGroupExerciseType |
    MultipleChooseExerciseType |
    ChooseComponentsExerciseType |
    CompleteKanjiExerciseType |
    SynonymsExerciseType |
    MultipleKanjiChooseExerciseType |
    DefinitionsExerciseType |
    MultipleChooseTextExerciseType |
    CommonKanjiExerciseType |
    WrongKanjiExerciseType |
    WriteRadicalExerciseType |
    DefinitionsChooseExerciseType
    ) & {
    _id:string;
    level:string;
    exerciseIndex:number,
    examIndex:number|null,
    hint?:string
}

export type ExerciseProps<ExerciseType> = {
    answers:Record<string, string[]>;
    answerQuestion: (questionId:string, questionIndex:number, answer:string) => void;

    exercises:ExerciseType[];
    fontSize:number;
}