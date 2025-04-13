import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaHome, FaDownload } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import jsPDF from "jspdf";

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("resultsData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setData(parsedData.data);
      }
    } catch (error) {
      console.error("localStorage is unavailable or blocked:", error);
      setData(null); 
    }
  }, []);
  

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4"
    });
    
    let yOffset = 10;
    if (!data) return;
  
    const addPageIfNeeded = (y) => {
      if (y > 270) {
        pdf.addPage();
        addWatermark(pdf);
        return 10;
      }
      return y;
    };
  
    const addWatermark = (pdf) => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.saveGraphicsState();
      
      const fontSize = 80; 
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(fontSize);
      pdf.setGState(new pdf.GState({ opacity: 0.5 }));
      
      const text = "SYLLYAPP";
      const textWidth = (pdf.getStringUnitWidth(text) * fontSize) / pdf.internal.scaleFactor;
      
      
      pdf.text(text, pageWidth/2, pageHeight/2, { 
        align: 'center', 
        angle: -45, 
        renderingMode: 'fill' 
      });
      
      pdf.restoreGraphicsState();
    };
  
    addWatermark(pdf);
  
    const colors = {
      headings:[129, 63, 235],
      headline: [99, 94, 242],
      links: [87, 147, 222],  
      topics: [140, 56, 235]  
    };
  
    pdf.setFontSize(20);
    pdf.setTextColor(...colors.headings);
    pdf.text("Syllabus Analysis By SYLLYAPP", 10, yOffset);
    yOffset += 10;
  
    if (data.videos) {
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.headline);
      pdf.text("Videos Suggested For You", 10, yOffset);
      yOffset += 8;
      
      data.videos.forEach((video, index) => {
        pdf.setFontSize(12);
        pdf.setTextColor(...colors.topics);
        pdf.text(`${index + 1}. ${video.topic}`, 10, yOffset);
        yOffset += 6;
        
        pdf.setFontSize(10);
        pdf.setTextColor(...colors.links);
        pdf.text(video.link, 12, yOffset);
        yOffset += 8;
        yOffset = addPageIfNeeded(yOffset);
      });
    }
  
    if (data.resources) {
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.headline);
      pdf.text("Helpful Articles For You", 10, yOffset);
      yOffset += 8;
      
      data.resources.forEach((resourceGroup, index) => {
        pdf.setFontSize(12);
        pdf.setTextColor(...colors.topics);
        pdf.text(`${index + 1}. ${resourceGroup.topic}`, 10, yOffset);
        yOffset += 6;
        
        resourceGroup.resources.forEach((res, idx) => {
          pdf.setFontSize(10);
          pdf.setTextColor(...colors.topics);
          pdf.text(`${idx + 1}. ${res.title}`, 12, yOffset);
          yOffset += 6;
          
          pdf.setTextColor(...colors.links);
          pdf.text(res.link, 14, yOffset);
          yOffset += 8;
          yOffset = addPageIfNeeded(yOffset);
        });
      });
    }
  
    if (data.notes) {
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.headline);
      pdf.text("Short Notes", 10, yOffset);
      yOffset += 8;
      
      data.notes.forEach((note, index) => {
        pdf.setFontSize(12);
        pdf.setTextColor(...colors.topics);
        pdf.text(`${index + 1}. ${note.topic}`, 10, yOffset);
        yOffset += 6;
        
        pdf.setFontSize(10);
        pdf.setTextColor(40, 40, 40);
        const splitText = pdf.splitTextToSize(note.notes, 180);
        splitText.forEach((line) => {
          pdf.text(line, 12, yOffset);
          yOffset += 6;
          yOffset = addPageIfNeeded(yOffset);
        });
        yOffset += 6;
      });
    }
  
    const pdfBlob = pdf.output('blob');
    setGeneratedPdf(pdfBlob);
    setPdfLoading(false);
  };

  const handleDownloadPDF = () => {
    if (generatedPdf) {
      const url = URL.createObjectURL(generatedPdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = "syllabus_analysis.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-900 text-white">
      {pdfLoading && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div 
            className="bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ImSpinner2 className="text-5xl text-purple-500 animate-spin" />
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold text-white">Generating PDF</h3>
              <p className="text-gray-400">Please wait while we create your document...</p>
            </div>
            <motion.div 
              className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden mt-2"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      )}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold animate-shine">SYLLYAPP</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-2xl text-[#813feb] hover:text-[#4579f5] transition-colors"
            >
              <FaHome />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-4 min-h-screen">
        <div className="w-full max-w-3xl space-y-8 mt-20">
          <motion.h1
            className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Analysis Results
          </motion.h1>

          {data ? (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Videos Suggested For You
                </h2>
                {data.videos?.map((video, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                      {video.topic}
                    </h3>
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={video.link}
                        title={video.topic}
                        allowFullScreen
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Helpful Articles For You
                </h2>
                {data.resources?.map((resourceGroup, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                      {resourceGroup.topic}
                    </h3>
                    <ul className="space-y-4">
                      {resourceGroup.resources?.map((res, idx) => (
                        <li
                          key={idx}
                          className="border-l-2 border-purple-400 pl-4"
                        >
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-lg"
                          >
                            {res.title}
                          </a>
                          <p className="text-gray-400 mt-1">{res.snippet}</p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Short Notes For You
                </h2>
                {data.notes?.map((note, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                      {note.topic}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {note.notes}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-8 pb-16">
                {!generatedPdf ? (
                  <motion.button
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
                    onClick={handleGeneratePDF}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={pdfLoading}
                  >
                    <FaFilePdf className="text-xl" /> 
                    Generate PDF
                  </motion.button>
                ) : (
                  <motion.button
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
                    onClick={handleDownloadPDF}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaDownload className="text-xl" />
                    Download PDF
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.p
              className="text-gray-400 text-center text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              No data available. Please go back and submit your syllabus.
            </motion.p>
          )}
        </div>
      </div>

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Results;
