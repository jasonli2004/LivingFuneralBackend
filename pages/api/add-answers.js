import BackblazeB2 from 'backblaze-b2';

// Add CORS middleware
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
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

// Backblaze B2 setup
const b2 = new BackblazeB2({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
});

const authorizeB2 = async () => {
    await b2.authorize();
};

const handler = async (req, res) => {
    const { line } = req.body;
    const fileName = 'Todolist.txt';

    try {
        await authorizeB2();

        // Fetch existing file content
        let fileContent = '';
        try {
            const downloadResponse = await b2.downloadFileByName({
                bucketName: process.env.B2_BUCKET_NAME,
                fileName: fileName,
            });
            fileContent = downloadResponse.data;
        } catch (err) {
            console.log('Todolist.txt does not exist yet. Creating new one.');
        }

        // Append new line to the content
        const updatedContent = `${fileContent}${line}\n`;

        // Upload updated content
        const uploadUrlResponse = await b2.getUploadUrl({
            bucketId: process.env.B2_BUCKET_ID,
        });
        await b2.uploadFile({
            uploadUrl: uploadUrlResponse.data.uploadUrl,
            uploadAuthToken: uploadUrlResponse.data.authorizationToken,
            fileName: fileName,
            data: Buffer.from(updatedContent, 'utf-8'),
        });

        res.send('Line added and file uploaded successfully');
    } catch (error) {
        console.error('Error updating Todolist.txt:', error);
        res.status(500).json({ error: 'Failed to update Todolist.txt' });
    }
};

// Export the handler wrapped with CORS
export default allowCors(handler);
