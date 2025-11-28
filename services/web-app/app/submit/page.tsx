'use client'

import { useState, useRef } from 'react'
import { Image, Video, Type, X, Upload } from 'lucide-react'

type SubmitMode = 'text' | 'image' | 'video'

export default function SubmitPage() {
  const [mode, setMode] = useState<SubmitMode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log('SubmitPage render:', { mode, hasText: !!text, hasFile: !!file, loading })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Submit clicked:', { mode, text: text.substring(0, 50), file: file?.name })

    if (mode === 'text' && !text.trim()) {
      console.log('No text provided')
      return
    }
    if ((mode === 'image' || mode === 'video') && !file) {
      console.log('No file provided')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()

      if (mode === 'text') {
        formData.append('text', text)
        console.log('Submitting text:', text.substring(0, 100))
      } else {
        if (file) formData.append('file', file)
        if (text.trim()) formData.append('text', text)
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setText('')
        setFile(null)
      }
    } catch (error) {
      console.error('Submit error:', error)
      setResult({
        success: false,
        message: 'Failed to submit. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  function handleFileSelect(selectedFile: File) {
    const isImage = selectedFile.type.startsWith('image/')
    const isVideo = selectedFile.type.startsWith('video/')

    if (!isImage && !isVideo) {
      alert('Please upload only images or videos')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.')
      return
    }

    setFile(selectedFile)
    setMode(isImage ? 'image' : 'video')
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-neutral-200 p-4 flex items-center justify-between bg-white sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-neutral-900">Create new verification</h1>
          {loading && <span className="text-sm text-neutral-500">Processing...</span>}
        </div>

        <div className="p-6">
          {/* Mode Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-lg w-fit">
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'text' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              <Type size={18} />
              Text
            </button>
            <button
              onClick={() => setMode('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'image' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              <Image size={18} />
              Image
            </button>
            <button
              onClick={() => setMode('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'video' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              <Video size={18} />
              Video
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'text' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[300px] p-4 text-lg border-none focus:ring-0 resize-none placeholder:text-neutral-400"
                placeholder="What would you like to verify today?"
                autoFocus
              />
            ) : (
              <div
                className={`aspect-square sm:aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 bg-neutral-50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="relative w-full h-full">
                    {mode === 'image' ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-contain rounded-lg"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={32} className="text-neutral-500" />
                    </div>
                    <p className="text-lg font-medium text-neutral-900 mb-2">
                      Drag photos or videos here
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 font-semibold hover:text-blue-600"
                    >
                      Select from computer
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={mode === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}

            {(mode === 'image' || mode === 'video') && file && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border-t border-neutral-100 focus:ring-0 resize-none text-sm"
                placeholder="Add a caption or context..."
                rows={3}
              />
            )}

            <div className="flex items-center justify-end pt-4 border-t border-neutral-100">
              <button
                type="submit"
                disabled={loading || (mode === 'text' && !text.trim()) || ((mode === 'image' || mode === 'video') && !file)}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Result Notification */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${result.success ? 'text-green-500' : 'text-red-500'}`}>
              {result.success ? '✓' : '✕'}
            </div>
            <div>
              <h3 className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.success ? 'Verification Started' : 'Submission Failed'}
              </h3>
              <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
