import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const User = pgTable(
    "user",
    {
        //columns
        id: serial('id').primaryKey(),
        email: varchar('email').unique().notNull(),
        plan: varchar('plan').default('Free').notNull(),
        createdAt: varchar('createdAt'),
    }
);
export const MockInterview = pgTable(
    "mockInterview",
    {
        //columns
        id: serial('id').primaryKey(),
        aiMockResponses: text('aiMockResponses').notNull(),
        jobPosition: varchar('jobPosition').notNull(),
        jobDescription: varchar('jobDescription').notNull(),
        jobExperience: varchar('jobExperience').notNull(),
        createdBy: varchar('createdBy').notNull(),
        createdAt: varchar('createdAt'),
        mockId: varchar('mockId').notNull(),
    }
);

export const UserAnswer = pgTable(
    "userAnswer",
    {
        //columns 
        id: serial('id').primaryKey(),
        mockIdRef: varchar('mockIdRef').notNull(),
        question: varchar('question').notNull(),
        correctAns: varchar('correctAns'),
        userAnswer: varchar('userAnswer'),
        feedback: varchar('feedback'),
        rating: varchar('rating'),
        userEmail: varchar('userEmail'),
        createdAt: varchar('createdAt'),
    }
);