import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

function resizeImage(file, maxSize = 400) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > h) {
          if (w > maxSize) { h = Math.round((h * maxSize) / w); w = maxSize }
        } else {
          if (h > maxSize) { w = Math.round((w * maxSize) / h); h = maxSize }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ImageUpload({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB')
      return
    }
    const base64 = await resizeImage(file)
    onChange(base64)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const clear = (e) => {
    e.stopPropagation()
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      className={`image-upload-zone ${dragOver ? 'drag-over' : ''} ${value ? 'has-image' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {value ? (
        <div className="image-upload-preview">
          <img src={value} alt="Profile preview" />
          <button type="button" className="image-upload-clear" onClick={clear}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="image-upload-placeholder">
          <div className="image-upload-icon">
            <ImageIcon size={28} />
          </div>
          <div className="image-upload-text">
            <span style={{ fontWeight: 700 }}>Click to upload</span> or drag & drop
          </div>
          <div className="image-upload-hint">JPG, PNG up to 10MB</div>
        </div>
      )}
    </div>
  )
}
