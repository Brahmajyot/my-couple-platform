
export default function MovieUploader() {

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-secondary-purple/50">
      <h3 className="text-2xl font-bold text-primary-pink mb-4">
        Upload a Memory 🎞️
      </h3>
      <form onSubmit={handleUpload} className="space-y-4">
        
        <input 
          type="text" 
          placeholder="Movie Title (e.g., 'Our Rome Trip')" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
          className="w-full p-3 bg-stone-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-primary-pink focus:border-primary-pink"
        />
        
        <div className="relative border-2 border-dashed border-primary-pink/50 rounded-lg p-6 text-center hover:bg-stone-900 transition duration-200 cursor-pointer">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            accept="video/*" 
            required 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <p className="text-primary-pink font-medium">
            {file ? `Selected: ${file.name}` : 'Click to select video file (MP4, MOV, etc.)'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max 2GB recommended.
          </p>
        </div>
        
        <button 
          type="submit"
          disabled={status.includes('Uploading...')}
          className={`w-full py-3 rounded-lg font-bold transition duration-300 ${
            status.includes('Uploading...') 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-secondary-purple hover:bg-primary-pink shadow-lg shadow-secondary-purple/50'
          }`}
        >
          {status.includes('Uploading...') ? status : 'Start Upload'}
        </button>
      </form>
      <p className={`mt-4 text-sm ${status.includes('Error') ? 'text-red-400' : 'text-gray-300'}`}>
        Status: {status}
      </p>
    </div>
  );
}