import { GoogleGenAI, Type } from "@google/genai";
import { Student, AttendanceRecord } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAttendanceInsight = async (
  students: Student[],
  attendance: AttendanceRecord[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Unable to generate insights.";
  }

  const dataSummary = JSON.stringify({
    totalStudents: students.length,
    attendanceRecordsCount: attendance.length,
    sampleData: attendance.slice(0, 50) // Send a sample to avoid token limits if large
  });

  const prompt = `
    Analyze the following student registration and attendance summary data.
    Data: ${dataSummary}
    
    Please provide a concise, 3-paragraph executive summary.
    1. Overall attendance trends (simulated based on the data provided).
    2. Identification of any potential issues (e.g., high absenteeism trends).
    3. Recommendations for improving student engagement.
    
    Keep the tone professional and administrative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI assistant for a school administrator.",
        thinkingConfig: { thinkingBudget: 0 } // fast response
      }
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Failed to generate AI insights at this time.";
  }
};

export const identifyAtRiskStudents = async (
  students: Student[],
  attendance: AttendanceRecord[]
): Promise<{ studentId: string; reason: string }[]> => {
  if (!apiKey) return [];

  // Prepare a compact representation for the model
  const records = students.map(s => {
    const sRecords = attendance.filter(a => a.studentId === s.id);
    const total = sRecords.length;
    const absent = sRecords.filter(a => a.status === 'Absent').length;
    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      totalDays: total,
      absentDays: absent
    };
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this list: ${JSON.stringify(records)}. Identify students with high absenteeism (more than 20% absence rate). Return a JSON list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              studentId: { type: Type.STRING },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error(e);
    return [];
  }
};
