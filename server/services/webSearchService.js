
const axios = require("axios");

/*
============================================================
SKILLBRIDGE WEB SEARCH SERVICE
============================================================

This service communicates with the external search provider.

IMPORTANT:
The API key stays on the backend.
Never put your search API key inside React/frontend code.
============================================================
*/

const searchWeb = async (query) => {
    try {
        if (!query || !query.trim()) {
            throw new Error("Search query is required");
        }

        const apiKey = process.env.SEARCH_API_KEY;

        if (!apiKey) {
            throw new Error(
                "SEARCH_API_KEY is missing from .env"
            );
        }

        console.log("Web search:", query);

        /*
        --------------------------------------------------------
        SEARCH REQUEST
        --------------------------------------------------------
        */

        const response = await axios.get(
            "https://www.googleapis.com/customsearch/v1",
            {
                params: {
                    key: apiKey,
                    cx: process.env.SEARCH_ENGINE_ID,
                    q: query,
                    num: 8,
                },
            }
        );

        const items = response.data?.items || [];

        /*
        --------------------------------------------------------
        CLEAN SEARCH RESULTS
        --------------------------------------------------------
        */

        const results = items.map((item) => ({
            title: item.title || "",
            link: item.link || "",
            snippet: item.snippet || "",
            displayLink:
                item.displayLink || "",
        }));

        return {
            success: true,
            query,
            results,
        };

    } catch (error) {

        console.error(
            "Web Search Error:",
            error.response?.data ||
            error.message
        );

        return {
            success: false,
            query,
            results: [],
            error:
                error.response?.data?.error?.message ||
                error.message ||
                "Web search failed",
        };
    }
};

module.exports = {
    searchWeb,
};
