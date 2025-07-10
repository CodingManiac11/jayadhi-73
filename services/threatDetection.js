const path = require('path');

const modelPath = path.join(__dirname, '..', process.env.AI_MODEL_PATH);


const model = fs.readFileSync(modelPath);
