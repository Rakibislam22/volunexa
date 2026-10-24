const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("volunexa_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred with the request");
    }

    return data;
  }

  // Auth Endpoints
  async register(body: any) {
    return this.request<{ success: boolean; token: string; user: any }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(body) }
    );
  }

  async login(body: any) {
    return this.request<{ success: boolean; token: string; user: any }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(body) }
    );
  }

  async getMe() {
    return this.request<{ success: boolean; user: any }>("/auth/me");
  }

  async updateProfile(body: any) {
    return this.request<{ success: boolean; user: any }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  // Events Endpoints
  async getEvents(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<{
      success: boolean;
      events: any[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/events${query ? `?${query}` : ""}`);
  }

  async getEvent(id: string) {
    return this.request<{ success: boolean; event: any }>(`/events/${id}`);
  }

  async createEvent(body: any) {
    return this.request<{ success: boolean; event: any }>("/events", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateEvent(id: string, body: any) {
    return this.request<{ success: boolean; event: any }>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async deleteEvent(id: string) {
    return this.request<{ success: boolean; message: string }>(
      `/events/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async getOrganizerEvents() {
    return this.request<{ success: boolean; events: any[] }>(
      "/events/organizer/my-events"
    );
  }

  // Registration Endpoints
  async registerForEvent(body: { eventId: string; selectedSkill: string }) {
    return this.request<{ success: boolean; registration: any }>(
      "/registrations",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  }

  async getEventRegistrations(eventId: string) {
    return this.request<{ success: boolean; registrations: any[] }>(
      `/registrations/event/${eventId}`
    );
  }

  async updateRegistrationStatus(id: string, status: string) {
    return this.request<{ success: boolean; registration: any }>(
      `/registrations/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
  }

  async getMyRegistrations() {
    return this.request<{ success: boolean; registrations: any[] }>(
      "/registrations/my-registrations"
    );
  }

  async cancelRegistration(id: string) {
    return this.request<{ success: boolean; message: string }>(
      `/registrations/${id}/cancel`,
      {
        method: "PUT",
      }
    );
  }

  async checkRegistration(eventId: string) {
    return this.request<{
      success: boolean;
      isRegistered: boolean;
      registration: any;
    }>(`/registrations/check/${eventId}`);
  }

  // Analytics Endpoints
  async getDashboardStats() {
    return this.request<{
      success: boolean;
      stats: any;
      upcomingEventsList: any[];
    }>("/analytics/dashboard");
  }

  async getEventsByCategory() {
    return this.request<{ success: boolean; data: any[] }>(
      "/analytics/events-by-category"
    );
  }

  async getRegistrationStats() {
    return this.request<{ success: boolean; data: any[] }>(
      "/analytics/registration-stats"
    );
  }

  async getVolunteerStatusBreakdown() {
    return this.request<{ success: boolean; data: any[] }>(
      "/analytics/volunteer-status"
    );
  }

  async getVolunteerDashboardStats() {
    return this.request<{ success: boolean; stats: any }>(
      "/analytics/volunteer-dashboard"
    );
  }

  // AI Assistant Endpoint
  async generateAIDescription(eventIdea: string) {
    return this.request<{
      success: boolean;
      generated: {
        description: string;
        volunteerRoles: string[];
        requiredSkills: string[];
        promotionalMessage: string;
        suggestedCategory: string;
      };
      source: string;
    }>("/ai/generate-description", {
      method: "POST",
      body: JSON.stringify({ eventIdea }),
    });
  }

  // Favorites Endpoints
  async toggleFavorite(eventId: string) {
    return this.request<{ success: boolean; isFavorited: boolean }>(
      `/favorites/${eventId}`,
      { method: "POST" }
    );
  }

  async getFavorites() {
    return this.request<{ success: boolean; favorites: any[] }>("/favorites");
  }

  async checkFavorite(eventId: string) {
    return this.request<{ success: boolean; isFavorited: boolean }>(
      `/favorites/check/${eventId}`
    );
  }
}

export const api = new ApiService();
