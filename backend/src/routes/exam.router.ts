import {examService} from "../services/exam.service";
import {getExamDto, gradeExamDto} from "../dto/exam.dto";
import Elysia from "elysia";
import {rateLimit} from "elysia-rate-limit";

export const examRouter = new Elysia({prefix: "/exams"})
    .use(rateLimit())

examRouter.get(
    "/:level",
    async ({params}) => {
        return await examService.generateRandomExam(params.level);
    },
    {
        params: getExamDto
    }
);

examRouter.post(
    "/grade",
    async ({body}) => {
        return await examService.gradeExam(body.answers);
    },
    {
        body: gradeExamDto
    }
);


export default examRouter;