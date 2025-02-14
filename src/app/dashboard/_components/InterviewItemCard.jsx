import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview }) => {
    const router = useRouter();

    return (
        <div className="border border-gray-700 shadow-sm rounded-lg p-4">
            <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
            <h2 className="text-sm text-gray-600">
                {interview?.jobExperience} Years of Experience
            </h2>
            <h2 className="text-xs text-gray-400">
                Created At: {new Date(interview?.createdAt).toLocaleDateString()}
            </h2>

            <div className="flex justify-between mt-4 gap-3">
                {/* Feedback Button - Outlined in Grey */}
                <Button
                    variant="outlined"
                    size="small"
                    className="w-full"
                    onClick={() =>
                        router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
                    }
                    sx={{
                        borderColor: "#888", // Grey border
                        color: "#222", // Light grey text
                        "&:hover": {
                            backgroundColor: "#ddd",
                            color: "#111",
                        },
                    }}
                >
                    Feedback
                </Button>

                {/* Start Button - Solid Dark Grey */}
                <Button
                    variant="contained"
                    size="small"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/interview/${interview?.mockId}`)}
                    sx={{
                        backgroundColor: "#222", // Dark grey
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#444",
                        },
                    }}
                >
                    Start
                </Button>
            </div>
        </div>
    );
};

export default InterviewItemCard;
