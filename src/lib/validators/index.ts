import { ZodError, z } from "zod";

type MyZodSchema = z.ZodType<any, any>;

export const validateZodInput = (payload: unknown, schema: MyZodSchema, isArrayErrorResult = false): { isError: boolean, data: any, message: string} => {
    try {
        const parsedResult = schema.parse(payload);

        return { isError: false, data: parsedResult, message: "validators > parse payload successfully"}
    } catch (error: unknown) {
        // if error is of type ZodError
        if (error instanceof ZodError) {
            const errors: Record<string, string> = {};

            // get all issues
            let issues = error.issues;

            // map error messages into one
            const message = issues?.map(issue => issue.message)?.join("\r\n");

            // if error is an array
            if (isArrayErrorResult) {
                const issueMessages = issues.map(issue => issue.message);
                return {
                    isError: true,
                    data: issueMessages,
                    message
                }
            }
            // if error is not array, map the issues message to error
            for (const issue of issues) {
                const key =  issue.path[0] as string;
                errors[key] = issue.message;
            }
            return { isError: true, data: errors, message };
        }
        // if error is not Zoderror type
        return {
            isError: true,
            data: null,
            message: error instanceof Error
                ? error.message
                : "An unknown error occurred"
        }
    }
}