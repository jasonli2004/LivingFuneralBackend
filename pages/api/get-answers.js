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

const b2 = new BackblazeB2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

const authorizeB2 = async () => {
  await b2.authorize();
};

const handler = async (req, res) => {
  const fileName = 'Todolist.txt';

  try {
    await authorizeB2();
    const downloadResponse = await b2.downloadFileByName({
      bucketName: process.env.B2_BUCKET_NAME,
      fileName: fileName,
    });
    const fileContent = downloadResponse.data;
    const linesArray = fileContent.split('\n').filter(line => line.trim() !== '');
    res.json(linesArray);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read Todolist.txt' });
  }
};

export default allowCors(handler);
