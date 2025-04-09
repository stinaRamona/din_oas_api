const fs = require('fs');
const path = require('path');

const handleFileUpload = async (file) => {
    if (!file || !file.hapi) {
        throw new Error('Ingen fil mottagen eller ogiltig filstruktur.');
    }

    // Extrahera metadata från file.hapi
    const { filename } = file.hapi;
    console.log('Mottagen fil:', filename);

    // Spara filen till en lokal mapp
    const uploadPath = path.join(__dirname, '../uploads', filename);
    const fileStream = fs.createWriteStream(uploadPath);

    await new Promise((resolve, reject) => {
        file.pipe(fileStream);
        file.on('end', resolve);
        file.on('error', reject);
    });

    console.log('Fil uppladdad till:', uploadPath);
    return { filename, uploadPath };
};

module.exports = { handleFileUpload }; 