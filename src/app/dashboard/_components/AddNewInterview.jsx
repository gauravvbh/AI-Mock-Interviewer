'use client';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Typography } from '@mui/material';
import chatSession from 'utils/AIModal';
import { LoaderCircle, Router } from 'lucide-react';
import { db } from 'utils/db'
import { MockInterview } from 'utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';


function AddNewInterview() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        jobRole: '',
        jobDescription: '',
        experience: ''
    });
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([])
    const { user } = useUser();
    const router = useRouter();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const { jobRole, jobDescription, experience } = formData;

        // Input validation
        if (!jobRole || !jobDescription || !experience) {
            alert("Please fill in all fields.");
            setLoading(false);
            return;
        }

        // Generating prompt for AI
        const InputPrompt = `
            Job Position: ${jobRole}, 
            Job Description: ${jobDescription}, 
            Years of Experience: ${experience} 
            \nBased on this information, give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT} interview questions and answers in JSON format. 
            The questions and answers must be simple and human-friendly.
        `;

        try {
            const result = await chatSession.sendMessage(InputPrompt);

            // Assuming the result is valid JSON text
            const responseText = result.response.text();
            let mockJsonResponse = responseText.replace('```json', '').replace('```', '');

            // Parse it if needed
            const parsedResponse = JSON.parse(mockJsonResponse);
            setJsonResponse(parsedResponse);


            if (mockJsonResponse) {
                const resp = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        aiMockResponses: mockJsonResponse,
                        jobPosition: formData.jobRole,
                        jobDescription: formData.jobDescription,
                        jobExperience: formData.experience,
                        // createdAt: new Date().toISOString(),
                        createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
                        createdBy: user?.primaryEmailAddress?.emailAddress
                    }).returning({ mockId: MockInterview.mockId })


                if (resp) {
                    setFormData({
                        jobRole: '',
                        jobDescription: '',
                        experience: ''
                    });
                    router.push(`/dashboard/interview/${resp[0].mockId}`);
                }
            }
            else {
                alert("Error in fetching AI data. Please try again.");
            }


        } catch (error) {
            console.error("Error in fetching AI data: ", error);
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-gray-200 hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={handleClickOpen}
            >
                <h2 className="text-lg text-center">+ Add New</h2>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slotProps={{
                    paper: {
                        sx: { maxWidth: '40rem', width: '100%' }
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: '1.5rem' }}>
                    Tell us more about your job interviewing.
                </DialogTitle>

                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Add details about your job position/role, job description, and years of experience.
                    </Typography>

                    {/* Form for Input Fields */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Job Role/Job Position
                            </label>
                            <TextField
                                required
                                fullWidth
                                name="jobRole"
                                placeholder="Ex. Full Stack Developer"
                                value={formData.jobRole}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Job Description/ Tech Stack (In Short)
                            </label>
                            <TextField
                                required
                                fullWidth
                                multiline
                                minRows={3}
                                name="jobDescription"
                                placeholder="Ex. React, Angular, Next.js, MySQL, PostgreSQL"
                                value={formData.jobDescription}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Years of Experience
                            </label>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                name="experience"
                                placeholder="Ex. 5"
                                value={formData.experience}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </div>

                        <DialogActions>
                            <Button
                                disabled={loading}
                                sx={{
                                    // borderColor: "#888", // Grey border
                                    // color: "#222", // Light grey text
                                    backgroundColor: "#ddd",
                                    color: "#111",
                                    // "&:hover": {
                                    //     backgroundColor: "white",
                                    //     color: "#ddd",
                                    // },
                                }}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={loading}
                                type="submit"
                                sx={{
                                    backgroundColor: "#222", // Dark grey
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#444",
                                    },
                                }}
                                autoFocus
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <LoaderCircle className='text-white animate-spin' size={16} />
                                        <span className="ml-2 text-white">Generating from AI</span>
                                    </div>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
