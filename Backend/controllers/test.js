import { ErrorHandler } from "../utils/utility.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YT_API_KEY = process.env.YT_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const getResult = async (req, res, next) => {
  try {
    const { syllabus, subject } = req.body;

    if (!syllabus || !subject) {
      return next(
        new ErrorHandler(400, "Please provide both syllabus and subject")
      );
    }

    const prompt = `This is my syllabus or module: "${syllabus}" for the subject "${subject}".
        Analyze it and return only a pure JavaScript array with topics and subtopics as youtube search prompt with the subject name.
        MUST INCLUDE:
        - Some subtopics or key topics
        - Topics must be a youtube searchable query
        DO NOT INCLUDE:
        - The words "topic" or "subtopic"
        - Any explanations or extra text
        - Code block formatting
        - topics must not repeat
        Output format must be exactly like this example:
        ["Data communication", "Networks", "OSI model"]
        Return only the raw array as a plain string without any escape characters.`;

    const result = await model.generateContent(prompt);
    let syllArray = result.response.text().trim();

    try {
      const parsedArray = JSON.parse(syllArray);
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const videoResults = [];
      const resourceResults = [];
      const notesResults = [];

      for (const topic of parsedArray) {
        try {
          const searchQuery = `${topic} tutorial explanation`;
          const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "snippet",
                maxResults: 1,
                q: searchQuery,
                type: "video",
                key: YT_API_KEY,
                relevanceLanguage: ["hi", "en"],
                videoEmbeddable: true,
                order: "viewCount",
              },
            }
          );

          if (response.data.items && response.data.items.length > 0) {
            videoResults.push({
              topic,
              link: `https://www.youtube.com/embed/${response.data.items[0].id.videoId}`,
            });
          }

          const webSearchQuery = `${topic}`;
          const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            webSearchQuery
          )}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&num=3`;

          const googleResponse = await axios.get(googleSearchUrl);

          if (googleResponse.data.items) {
            const filteredResults = googleResponse.data.items
              .filter((item) =>
                [
                  "researchgate.net","arxiv.org","geeksforgeeks.org","tutorialspoint.com","w3schools.com","javatpoint.com","freecodecamp.org","coursera.org","udacity.com","udemy.com","khanacademy.org","codecademy.com","sciencedirect.com","springer.com","ieee.org","acm.org","nature.com","nptel.ac.in","cs50.harvard.edu","ibm.com","developer.mozilla.org","stackoverflow.com","medium.com","towardsdatascience.com","dataquest.io","machinelearningmastery.com","analyticsvidhya.com","paperswithcode.com","scholar.google.com","semanticscholar.org","plos.org",
                ].some((trustedSite) => item.displayLink.includes(trustedSite))
              )
              .map((item) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
              }));
          
            if (filteredResults.length > 0) {
              resourceResults.push({
                topic,
                resources: filteredResults,
              });
            }
          }

          const notesPrompt = `Generate concise notes for "${topic}" just one paragraph no headlines needed `;
          const notesResult = await model.generateContent(notesPrompt);
          const notesText = notesResult.response.text().trim().replace(/[#*\n]/g, '');
          notesResults.push({ topic, notes: notesText });

          await delay(100);
        } catch (error) {
          console.error(`Error fetching video for topic "${topic}":`, error);
          continue;
        }
      }

      return res.status(200).json({
        success: true,
        message: "Syllabus analyzed and videos fetched successfully",
        data: {
          topics: parsedArray,
          videos: videoResults,
          resources: resourceResults,
          notes: notesResults,
        },
      });
    } catch (parseError) {
      return next(
        new ErrorHandler(422, "Generated content is not a valid array format")
      );
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.message.includes("GEMINI_API_KEY_INVALID")) {
      return next(new ErrorHandler(401, "Invalid API key"));
    }
    if (error.message.includes("quotaExceeded")) {
      return next(new ErrorHandler(429, "YouTube API quota exceeded"));
    }
    return next(
      new ErrorHandler(500, `Error processing request: ${error.message}`)
    );
  }
};

export { getResult };
