const API_URL = "http://localhost:5000/api/placement";

// Get authentication token
const getToken = () => {
    return localStorage.getItem("token");
};

// Get placement readiness
export const getPlacementReadiness = async () => {
    const response = await fetch(
        `${API_URL}/readiness`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch placement readiness"
        );
    }

    return data;
};

// Get placement recommendations
export const getPlacementRecommendations = async () => {
    const response = await fetch(
        `${API_URL}/recommendations`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch placement recommendations"
        );
    }

    return data;
};