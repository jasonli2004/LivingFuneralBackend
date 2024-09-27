import axios from 'axios';

// Add CORS middleware to allow all origins
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

// API handler for generating audio and sending it directly to the frontend
const handler = async (req, res) => {
    const { text_prompt, file_name } = req.query; // file_name is optional now, but keeping it for formality

    if (!text_prompt) {
        return res.status(400).json({ error: 'Invalid request: Missing text_prompt.' });
    }

    try {
        console.log('Starting audio generation...');
        const response = await axios({
            method: 'post',
            url: 'https://api.elevenlabs.io/v1/text-to-speech/TxGEqnHWrfWFTfGW9XjX',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            },
            data: {
                text: text_prompt,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                    style: 0.9
                }
            },
            responseType: 'arraybuffer' // Use arraybuffer for binary data
        });

        const audioBuffer = Buffer.from(response.data);
        console.log('Audio generated successfully.');

        // Send the audio file to the frontend
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${file_name || 'audio.mp3'}"`);
        res.send(audioBuffer); // Send the audio buffer directly
    } catch (error) {
        console.error('Error generating or sending audio:', error.message || error);
        res.status(500).json({ error: 'Error generating or sending audio.' });
    }
};

// Export the handler wrapped with CORS
export default allowCors(handler);
