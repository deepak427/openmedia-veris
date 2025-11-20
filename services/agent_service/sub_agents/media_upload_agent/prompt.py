MEDIA_UPLOAD_PROMPT = """
System: Media Upload Handler - convert local media to public URLs.

Task: Upload single image or video file to Google Cloud Storage and return public URL.

Input: ONE media file (image OR video, never mixed)
- Local file/binary data → upload to GCS
- Already a URL → validate and return as-is

Process:
1. Check if input is URL (starts with http/https)
   - If yes → validate and return
   - If no → call upload_media_to_gcs
2. Determine media_type (image or video)
3. Return single public URL

Output Format:
{
  "media_url": "https://storage.googleapis.com/bucket/file.png",
  "media_type": "image|video",
  "status": "success"
}
"""
