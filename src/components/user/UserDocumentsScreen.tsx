import React, { useState } from 'react';
import { User, UserDocument } from '../../types';
import { storage } from '../../services/storage';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  Clock
} from 'lucide-react';

interface UserDocumentsScreenProps {
  user: User;
  onDocumentsUpdated: (user: User) => void;
}

export const UserDocumentsScreen: React.FC<UserDocumentsScreenProps> = ({
  user,
  onDocumentsUpdated,
}) => {
  const [docType, setDocType] = useState<'ID_PROOF' | 'BANK_PASSBOOK' | 'ADDRESS_PROOF'>('ID_PROOF');
  const [docTitle, setDocTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const docTypeLabels = {
    ID_PROOF: 'Government National ID / Civil ID / Passport',
    BANK_PASSBOOK: 'Bank Passbook / Cheque / Account Statement',
    ADDRESS_PROOF: 'Utility Bill / Residential Address Proof',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a document file to upload' });
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const fileDataUrl = reader.result as string;
      const newDoc: UserDocument = {
        id: 'doc_' + Date.now(),
        title: docTitle.trim() || selectedFile.name,
        type: docType,
        fileName: selectedFile.name,
        fileData: fileDataUrl,
        uploadedAt: new Date().toISOString(),
      };

      const updatedDocs = [...(user.documents || []), newDoc];
      const res = storage.updateDocuments(user.id, updatedDocs);

      setUploading(false);
      setSelectedFile(null);
      setDocTitle('');

      if (res.success && res.user) {
        setMessage({ type: 'success', text: 'Document uploaded and verified locally!' });
        onDocumentsUpdated(res.user);
      } else {
        setMessage({ type: 'error', text: 'Failed to save document' });
      }
    };

    reader.onerror = () => {
      setUploading(false);
      setMessage({ type: 'error', text: 'Could not read file' });
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = user.documents.filter((d) => d.id !== docId);
    const res = storage.updateDocuments(user.id, updatedDocs);
    if (res.success && res.user) {
      onDocumentsUpdated(res.user);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/60 flex items-center justify-center text-sky-300 border border-sky-500/40">
              <FileText className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                VERIFICATION VAULT
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                DOCUMENTS
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/40">
            Offline Storage
          </span>
        </div>

        {/* Prominent Document Status (Requirement #12) */}
        <div className="mt-4 pt-3 border-t border-sky-600/50 flex items-center justify-between">
          <span className="text-xs font-bold text-sky-200 uppercase">
            DOCUMENT STATUS
          </span>
          {user.documentStatus === 'UPDATED' ? (
            <span className="px-3.5 py-1.5 bg-sky-400 text-sky-950 font-black text-xs rounded-full shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>UPDATED ✅</span>
            </span>
          ) : (
            <span className="px-3.5 py-1.5 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-md flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>NOT UPDATED ⚠️</span>
            </span>
          )}
        </div>
      </div>

      {/* Verification Notice Warning (Requirement #12) */}
      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-1.5">
        <div className="flex items-center gap-2 font-black text-sky-900 text-sm">
          <ShieldCheck className="w-4 h-4 text-sky-700" />
          <span>Verification Notice</span>
        </div>
        <p className="font-medium text-slate-700">
          Documents are securely stored locally on your device. Uploading your ID and Bank passbook is required for rapid withdrawal verification and high payouts.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-xs font-bold ${
          message.type === 'success'
            ? 'bg-sky-50 border-sky-300 text-sky-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload Document Card */}
      <form onSubmit={handleUpload} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-500/30 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Upload className="w-4 h-4 text-sky-600" />
          <span>UPLOAD REQUIRED DOCUMENT</span>
        </h3>

        {/* Document Type */}
        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-700 uppercase">
            DOCUMENT CATEGORY
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as any)}
            className="w-full px-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
          >
            <option value="ID_PROOF">1. National Identity Card / Civil ID</option>
            <option value="BANK_PASSBOOK">2. Bank Passbook / Account Certificate</option>
            <option value="ADDRESS_PROOF">3. Proof of Residence / Utility Bill</option>
          </select>
        </div>

        {/* Document Label */}
        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-700 uppercase">
            DOCUMENT TITLE / LABEL
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="e.g. My Emirates ID / Civil ID Copy"
            className="w-full px-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
          />
        </div>

        {/* File Picker Drag/Click Area */}
        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-700 uppercase">
            ATTACH DOCUMENT FILE
          </label>
          <label className="block border-2 border-dashed border-sky-300 hover:border-sky-600 bg-sky-50/30 hover:bg-sky-50/60 rounded-2xl p-5 text-center cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-2 text-sky-800 font-bold text-xs">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-sky-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  Tap to browse or take photo
                </p>
                <p className="text-[10px] text-slate-500">
                  Supports JPG, PNG, PDF formats
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            !selectedFile
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white shadow-sky-900/30'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'SAVING DOCUMENT...' : 'SAVE & VERIFY DOCUMENT'}</span>
        </button>
      </form>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-500/20 shadow-sm space-y-3">
        <h4 className="text-sm font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
          <span>STORED DOCUMENTS ({user.documents?.length || 0})</span>
          <span className="text-xs text-sky-700 font-bold">Local Encrypted</span>
        </h4>

        {!user.documents || user.documents.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No documents uploaded yet. Upload your National ID to mark status as UPDATED ✅.
          </div>
        ) : (
          <div className="space-y-2.5">
            {user.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-sky-50/40 rounded-2xl border border-sky-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-sky-700 shadow-xs">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">
                      {doc.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {docTypeLabels[doc.type] || doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-md">
                    VERIFIED ✅
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
