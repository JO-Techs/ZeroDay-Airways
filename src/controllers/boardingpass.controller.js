const path = require('path');

function download(req, res) {
  // VULN-07: path traversal from user-controlled file name.
  // INTENTIONALLY INSECURE — see VULN-07.
  const fileName = req.query.file || 'boarding-pass.txt';
  const fullPath = path.join(__dirname, '..', '..', 'uploads', 'boarding-passes', fileName);
  res.download(fullPath);
}

module.exports = { download };
