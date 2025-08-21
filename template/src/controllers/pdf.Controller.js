import { generatePdf } from "../utils/pdfUtils.js";


export const pdfGenerate = async (req, res) => {
  try {
    // const data = req.body;
    const  data ={ title: 'My PDF Title', content : 'Hello, this is your PDF content!' };
    let pdfBuffer;
    pdfBuffer = await generatePdf(data);
    res.setHeader('Content-Disposition', `attachment; filename=NewPDF.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};