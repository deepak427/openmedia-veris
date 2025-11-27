adk deploy cloud_run \
  --project=veris-478615 \
  --region=us-central1 \
  --service_name=veris-ai\
  --app_name=veris_agent \
  --with_ui \
  --allow_origins=* \
  .

gcloud builds submit --tag gcr.io/pungde-477205/pungda-predict-service 

gcloud run deploy pungda-predict-service   --image gcr.io/pungde-477205/pungda-predict-service   --platform managed   --region us-central1   --allow-unauthenticated