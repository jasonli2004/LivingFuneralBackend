# The Living Funeral Backend

This repository contains the backend services for **The Living Funeral**, an interactive web-based art project that combines AI and user interaction to explore themes of life, death, and reflection. The backend manages tasks such as maintaining a user wish list, generating audio responses using ElevenLabs, and integrating with Backblaze B2 for file storage.

## 🌟 Features

1. **Wish List Management**:
   - Append and upload user input to a `Wishlist.txt` file stored in Backblaze B2.
   - Retrieve and display the wish list contents dynamically.

2. **Audio Generation**:
   - Generate AI-driven audio responses using the ElevenLabs Text-to-Speech API.
   - Deliver audio files directly to the frontend in real-time.

3. **Cloud Storage Integration**:
   - Utilize Backblaze B2 for efficient and secure file storage.
   - Support file downloads and uploads via API.

4. **CORS Middleware**:
   - Enable secure cross-origin requests for seamless integration with the frontend.

---

## 🛠️ Technology Stack

- **Backblaze B2**: For file storage and retrieval.
- **ElevenLabs API**: For text-to-speech audio generation.
- **Node.js**: Backend runtime environment.
- **Express-like API**: Custom handlers for RESTful endpoints.
- **CORS Middleware**: To manage cross-origin requests.

---

## 📂 Project Structure

- **`allowCors` Middleware**: Ensures proper handling of CORS for API endpoints.
- **Wish List Endpoints**:
  - **Add to List**: Adds a new wish to `Wishlist.txt` in Backblaze B2.
  - **Read List**: Retrieves and returns the contents of `Wishlist.txt`.
- **Audio Generation Endpoint**:
  - Generates audio from a text prompt and streams it to the frontend.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** installed on your system.
- Backblaze B2 credentials:
  - `B2_APPLICATION_KEY_ID`
  - `B2_APPLICATION_KEY`
  - `B2_BUCKET_NAME`
  - `B2_BUCKET_ID`
- ElevenLabs API Key (`ELEVENLABS_API_KEY`).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jasonli2004/LivingFuneralBackend.git
   cd LivingFuneralBackend
