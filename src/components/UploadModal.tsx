import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, CheckCircle2, AlertCircle, ImageIcon, Trash2, Camera, FileText, Plus } from 'lucide-react';
import { type QuestionPaper, type PaperSet } from '../types/paper';
import { GRADE_10_SUBJECTS, SUBJECT_CODES } from '../data/mockPapers';
import { PaperStorage } from '../services/storage';
import { CloudSync } from '../services/cloudSync';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperUploaded: (newPaper: QuestionPaper) => void;
  initialValues?: {
    subject?: string;
    examDate?: string;
    set?: string;
  };
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPaperUploaded,
  initialValues,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subject, setSubject] = useState(initialValues?.subject || 'Mathematics');
  const [examDate, setExamDate] = useState(initialValues?.examDate || new Date().toISOString().split('T')[0]);
  const [set, setSet] = useState<PaperSet>((initialValues?.set as PaperSet) || 'Set A');
  const [uploadedBy, setUploadedBy] = useState('');

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileError, setFileError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files);
      const updatedFiles = [...selectedFiles, ...incoming];
      setSelectedFiles(updatedFiles);
      setFileError('');

      const newImages: string[] = [];
      for (const file of incoming) {
        if (file.type.startsWith('image/')) {
          try {
            const dataUrl = await PaperStorage.fileToDataUrl(file);
            newImages.push(dataUrl);
          } catch {
            // ignore
          }
        }
      }
      setPreviewImages((prev) => [...prev, ...newImages]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const incoming = Array.from(e.dataTransfer.files);
      const updatedFiles = [...selectedFiles, ...incoming];
      setSelectedFiles(updatedFiles);
      setFileError('');

      const newImages: string[] = [];
      for (const file of incoming) {
        if (file.type.startsWith('image/')) {
          try {
            const dataUrl = await PaperStorage.fileToDataUrl(file);
            newImages.push(dataUrl);
          } catch {
            // ignore
          }
        }
      }
      setPreviewImages((prev) => [...prev, ...newImages]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFileAtIndex = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setFileError('Please select or capture at least 1 photo/PDF of your question paper');
      return;
    }

    setIsProcessing(true);
    setFileError('');

    try {
      const subjectCode = SUBJECT_CODES[subject] || 'EXAM10';
      const year = parseInt(examDate.split('-')[0]) || new Date().getFullYear();
      const primaryFile = selectedFiles[0];
      const isImage = primaryFile.type.startsWith('image/');

      let fileData: string | undefined = undefined;
      const imagesList: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const dataUrl = await PaperStorage.fileToDataUrl(file);

        if (i === 0) {
          fileData = dataUrl;
        }

        if (file.type.startsWith('image/')) {
          imagesList.push(dataUrl);
        }
      }

      // Try uploading image directly to Supabase Storage if configured
      if (CloudSync.isConfigured() && primaryFile) {
        try {
          const remoteFileName = `${subjectCode}_${set.replace(/\s+/g, '')}_${Date.now()}_${primaryFile.name}`;
          const publicUrl = await CloudSync.uploadFile(primaryFile, remoteFileName);
          if (publicUrl) {
            fileData = publicUrl;
          }
        } catch {
          // fall back to data URL
        }
      }

      const fileName = primaryFile
        ? primaryFile.name
        : `${subjectCode}_${set.replace(/\s+/g, '')}.pdf`;

      const fileSize = primaryFile
        ? primaryFile.size > 1024 * 1024
          ? `${(primaryFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(primaryFile.size / 1024)} KB`
        : '1.2 MB';

      const newPaper: QuestionPaper = {
        id: `qp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        subject: subject.trim(),
        subjectCode,
        department: 'General & Other',
        examDate,
        examYear: year,
        session: 'Daily Practice Exam',
        set,
        category: 'standard',
        semester: 'Class 10',
        maxMarks: 80,
        duration: '3 Hours',
        hasSolution: false,
        fileType: isImage ? 'image' : 'pdf',
        fileData,
        images: imagesList.length > 0 ? imagesList : undefined,
        fileName,
        fileSize,
        pageCount: imagesList.length > 0 ? imagesList.length : 1,
        uploadedBy: uploadedBy.trim() || 'Classmate',
        uploadDate: new Date().toISOString().split('T')[0],
        downloadsCount: 1,
        viewsCount: 1,
        tags: [subject, set, 'Class 10'],
        instructions: ['Answer all questions carefully.'],
        questions: [],
      };

      onPaperUploaded(newPaper);
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      setFileError('Failed to process file. Please try again.');
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/15 shadow-2xl p-6 sm:p-7 my-6 text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black font-display text-white mb-1">
                PAPER SAVED &amp; SYNCED!
              </h3>
              <p className="text-xs text-zinc-400">
                {subject} • {set} is now accessible to the whole class.
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-zinc-900 text-white rounded-xl border border-zinc-700">
                  <UploadCloud className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">
                    Upload Class 10 Paper
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Upload your paper photo or PDF for the class to practice
                  </p>
                </div>
              </div>

              {fileError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Subject Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-mono text-zinc-300">
                    Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-zinc-400"
                  >
                    {GRADE_10_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub} className="bg-zinc-900 text-white">
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Set & Exam Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-mono text-zinc-300">
                      Exam Set *
                    </label>
                    <select
                      value={set}
                      onChange={(e) => setSet(e.target.value as PaperSet)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-zinc-400"
                    >
                      <option value="Set A">Set A</option>
                      <option value="Set B">Set B</option>
                      <option value="Set C">Set C</option>
                      <option value="Set D">Set D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-mono text-zinc-300">
                      Exam Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

                {/* 3. Contributor Name (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-mono text-zinc-300">
                    Uploaded By (Your Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul, Sneha, Amit (Optional)"
                    value={uploadedBy}
                    onChange={(e) => setUploadedBy(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-sans text-white focus:outline-none focus:border-zinc-400"
                  />
                </div>

                {/* 4. Drag & Drop or Camera File Upload Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-mono text-zinc-300">
                    Paper Photo / Scanned PDF *
                  </label>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-purple-500 rounded-2xl p-5 text-center cursor-pointer transition-all bg-zinc-900/40 hover:bg-zinc-900/80"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {selectedFiles.length > 0 ? (
                      <div className="space-y-3 text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                            <ImageIcon className="w-4 h-4 text-purple-400" />
                            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1 text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-lg border border-purple-500/30 flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add More</span>
                            </button>
                            <button
                              type="button"
                              onClick={removeAllFiles}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg cursor-pointer"
                              title="Clear all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Thumbnail Previews Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                          {selectedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 aspect-square flex items-center justify-center"
                            >
                              {previewImages[idx] ? (
                                <img
                                  src={previewImages[idx]}
                                  alt={`Page ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="p-2 text-center">
                                  <FileText className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
                                  <span className="text-[10px] text-zinc-400 font-mono block truncate max-w-[60px]">
                                    {file.name}
                                  </span>
                                </div>
                              )}

                              <div className="absolute top-1 left-1 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                                #{idx + 1}
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFileAtIndex(idx)}
                                className="absolute top-1 right-1 p-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full transition-opacity opacity-80 group-hover:opacity-100 cursor-pointer"
                                title="Remove this page"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}

                          {/* Add another photo tile */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-xl border border-dashed border-zinc-700 hover:border-purple-500 aspect-square flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-all bg-zinc-900/30 hover:bg-zinc-900/60 cursor-pointer"
                          >
                            <Plus className="w-5 h-5" />
                            <span className="text-[10px] font-bold">Add Page</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-center gap-2 mb-2 text-zinc-400">
                          <Camera className="w-5 h-5 text-zinc-300" />
                          <UploadCloud className="w-5 h-5 text-zinc-300" />
                        </div>
                        <p className="text-xs font-bold text-white mb-0.5">
                          Click to Take Photo or Browse Files
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          Select multiple photos at once, or add photos one by one
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 active:scale-95 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-black" />
                    <span>{isProcessing ? 'Uploading to Supabase...' : 'Save & Share with Class'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
